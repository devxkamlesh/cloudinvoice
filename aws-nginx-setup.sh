#!/bin/bash
# AWS nginx Setup Script for CloudInvoice
# Run this on your AWS EC2 instance

set -e

echo "=========================================="
echo "CloudInvoice - nginx Reverse Proxy Setup"
echo "=========================================="
echo ""

# Update system
echo "[1/6] Updating system packages..."
sudo apt update -qq

# Install nginx
echo "[2/6] Installing nginx..."
sudo apt install -y nginx

# Stop nginx temporarily
sudo systemctl stop nginx

# Create nginx config
echo "[3/6] Creating nginx configuration..."
sudo tee /etc/nginx/sites-available/cloudinvoice > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name cloudinvoice.co.in www.cloudinvoice.co.in;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/cloudinvoice-access.log;
    error_log /var/log/nginx/cloudinvoice-error.log;

    # Proxy settings
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Cloudflare real IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://127.0.0.1:3002/api/health;
        access_log off;
    }
}
EOF

# Enable the site
echo "[4/6] Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/cloudinvoice /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
echo "[5/6] Testing nginx configuration..."
sudo nginx -t

# Start and enable nginx
echo "[6/6] Starting nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx

echo ""
echo "=========================================="
echo "✓ nginx Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open port 80 in AWS Security Group"
echo "2. Update Cloudflare DNS to point to this server"
echo "3. Test: http://54.151.245.180"
echo ""
echo "Status:"
sudo systemctl status nginx --no-pager | head -10
echo ""
echo "Test local:"
curl -s http://localhost/api/health | jq . || curl -s http://localhost/api/health
