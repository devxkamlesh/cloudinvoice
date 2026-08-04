#!/bin/sh
# Database initialization script - runs migrations on container startup

echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "Running Prisma migrations..."
cd /app
# Pin the CLI version. Bare `npx prisma` resolves to latest (7.x), which rejects the
# `url` property in schema.prisma and fails with P1012. Keep this matching the prisma
# version in package.json.
npx --yes prisma@6.19.3 migrate deploy || echo "Migration failed or already applied"

echo "Starting Next.js application..."
exec node server.js
