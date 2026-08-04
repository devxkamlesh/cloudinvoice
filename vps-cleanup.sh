#!/usr/bin/env bash
# Prep VPS for CloudPanel: remove Docker, Oracle Cloud agents, nginx, certbot.
#
# DELIBERATELY NOT TOUCHED:
#   - ssh / sshd            (remote access)
#   - iscsid, multipathd    (OCI boot volume)
#   - linux-*-oracle        (the running kernel; matches "oracle" but is NOT the agent)
#   - snapd, core18         (snap runtime itself)

export DEBIAN_FRONTEND=noninteractive

echo "########## 1. STOP SERVICES ##########"
systemctl disable --now docker.service docker.socket containerd.service 2>&1 | grep -v '^$' || true
systemctl disable --now nginx.service 2>&1 | grep -v '^$' || true
systemctl disable --now unified-monitoring-agent.service 2>&1 | grep -v '^$' || true
echo "services stopped"

echo
echo "########## 2. PURGE DOCKER ##########"
apt-get -y purge \
  docker-ce docker-ce-cli docker-ce-rootless-extras \
  docker-buildx-plugin docker-compose-plugin docker-model-plugin \
  containerd.io 2>&1 | tail -5

echo
echo "########## 3. PURGE NGINX + CERTBOT ##########"
apt-get -y purge nginx nginx-common certbot python3-certbot python3-certbot-nginx 2>&1 | tail -5

echo
echo "########## 4. PURGE UNIFIED MONITORING AGENT ##########"
apt-get -y purge unified-monitoring-agent 2>&1 | tail -5

echo
echo "########## 5. REMOVE ORACLE CLOUD AGENT SNAP ##########"
snap remove --purge oracle-cloud-agent 2>&1 || echo "snap remove reported an issue"

echo
echo "########## 6. DELETE LEFTOVER DATA ##########"
rm -rf /var/lib/docker /var/lib/containerd /etc/docker /var/run/docker.sock
rm -rf /etc/nginx /var/log/nginx /var/www/crackerx /var/www/html
rm -rf /etc/letsencrypt /var/log/letsencrypt /var/lib/letsencrypt
rm -rf /opt/unified-monitoring-agent /etc/unified-monitoring-agent /var/log/unified-monitoring-agent
rm -rf /var/snap/oracle-cloud-agent
rm -f /etc/apt/sources.list.d/docker.list
echo "leftover data removed"

echo
echo "########## 7. AUTOREMOVE ORPHANS ##########"
apt-get -y autoremove --purge 2>&1 | tail -8
apt-get update -qq 2>&1 | tail -3

echo
echo "########## 8. SAFETY VERIFICATION ##########"
echo "-- ssh must be active --"
systemctl is-active ssh
echo "-- boot volume services must be active --"
systemctl is-active iscsid multipathd
echo "-- running kernel + installed kernel packages --"
uname -r
dpkg -l | grep -c 'linux-image.*oracle'
echo "-- /boot contents --"
ls /boot | head
echo "-- ports 80/443/3306 must now be free, 22 must be listening --"
ss -tulnp | grep -E ':(22|80|443|3306) ' || echo "(only expected entries above)"
echo "-- disk --"
df -h /
echo
echo "########## CLEANUP COMPLETE ##########"
