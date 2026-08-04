#!/usr/bin/env bash
# Read-only inventory before CloudPanel prep. Makes no changes.

echo "===== APT PACKAGES: docker / containerd / runc ====="
dpkg -l | grep -E 'docker|containerd|runc' || echo "(none)"

echo
echo "===== APT PACKAGES: nginx / certbot ====="
dpkg -l | grep -E 'nginx|certbot|letsencrypt' || echo "(none)"

echo
echo "===== APT PACKAGES: oracle / monitoring agents ====="
dpkg -l | grep -E 'oracle|unified-monitoring|osmh' || echo "(none)"

echo
echo "===== SNAPS ====="
snap list

echo
echo "===== DOCKER IMAGES / CONTAINERS ====="
docker ps -a --format '{{.Names}} {{.Status}}' 2>/dev/null || echo "(cannot list containers)"
echo "image count: $(docker images -q 2>/dev/null | wc -l)"

echo
echo "===== APT REPO FILES ====="
ls /etc/apt/sources.list.d/ 2>/dev/null || echo "(none)"

echo
echo "===== DISK USAGE HOTSPOTS ====="
du -sh /var/lib/docker /var/lib/containerd /opt/unified-monitoring-agent 2>/dev/null

echo
echo "===== CRITICAL SERVICES (must stay) ====="
systemctl is-active ssh iscsid multipathd

echo
echo "===== PORTS ====="
ss -tulnp 2>/dev/null | grep -E ':(22|80|443|3306|8443) ' || true
