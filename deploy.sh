#!/bin/bash
# CloudInvoice deploy. Runs ON the VPS, from /home/ubuntu/cloudinvoice.
#
#   ssh vps-1
#   cd /home/ubuntu/cloudinvoice && ./deploy.sh
#
# Pulls the current main branch, rebuilds the image, recreates the containers and
# applies migrations.
#
# TWO THINGS THAT MUST NOT CHANGE:
#
#   1. The directory name. Compose derives its project name from it, so the database
#      volume is `cloudinvoice_postgres-data`. Renaming or moving this directory makes
#      compose create a fresh empty volume, and the database will look wiped.
#
#   2. The scope of every docker command below. This host also runs ghumo,
#      dailyhabitos, portainer and asus-rewards-monitor. Never add
#      `docker system prune`, `docker image prune -a`, or run compose from outside
#      this directory: those reach across projects and take neighbouring sites down.
#
# .env is intentionally NOT in git. It lives only on this server. `git reset --hard`
# below does not touch it because it is untracked and ignored. Never run `git clean`
# here, that would delete it.

set -euo pipefail

BRANCH="${1:-main}"

if [ ! -f .env ]; then
  echo "✖ .env missing from $(pwd). Restore it before deploying." >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi

echo "▸ Fetching origin/$BRANCH ..."
git fetch --prune origin "$BRANCH"

BEFORE=$(git rev-parse --short HEAD 2>/dev/null || echo none)
git reset --hard "origin/$BRANCH"
AFTER=$(git rev-parse --short HEAD)
echo "  $BEFORE -> $AFTER"

mkdir -p backups
docker inspect --format='{{.Config.Image}} {{.Image}}' cloudinvoice-app \
  > "backups/$(date +%Y%m%d_%H%M%S)-previous-image.txt" 2>/dev/null || true

echo "▸ Building ..."
$DC build app

echo "▸ Recreating containers ..."
$DC up -d

# Pin the CLI version. Bare `npx prisma` resolves to latest (7.x), which rejects the
# `url` property in schema.prisma and fails with P1012. Keep this matching the
# prisma version in package.json.
echo "▸ Applying migrations ..."
$DC exec -T app npx --yes prisma@6.19.3 migrate deploy || echo "⚠ migrate deploy failed, check logs"

echo "▸ Waiting for health ..."
STATUS=starting
for _ in $(seq 1 40); do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' cloudinvoice-app 2>/dev/null || echo starting)
  [ "$STATUS" = "healthy" ] && break
  sleep 5
done

if [ "$STATUS" != "healthy" ]; then
  echo "✖ Not healthy (status: $STATUS). Recent logs:" >&2
  $DC logs --tail=40 app >&2
  echo "  Roll back with: git reset --hard $BEFORE && ./deploy.sh" >&2
  exit 1
fi

$DC ps
# Dangling layers from this build only. Not `-a`, which would evict other projects'
# images on this shared host.
docker image prune -f >/dev/null 2>&1 || true

echo "✔ Deployed $AFTER"
