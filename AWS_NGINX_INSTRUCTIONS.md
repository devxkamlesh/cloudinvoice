# AWS nginx Setup Instructions

Since SSH is blocked, follow these steps to set up nginx via AWS Console.

---

## Method 1: EC2 Instance Connect (Easiest)

### Step 1: Connect to Instance
1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **Instances** in left sidebar
3. Select your instance (54.151.245.180)
4. Click **Connect** button at top
5. Choose **EC2 Instance Connect** tab
6. Click **Connect**

A browser terminal will open.

### Step 2: Run Setup Script

Copy and paste this entire script into the terminal:

```bash
#!/bin/bash
set -e

echo "=========================================="
echo "CloudInvoice - nginx Setup"
echo "=========================================="

# Update and install nginx
echo "[1/6] Installing nginx..."
sudo apt update -qq
sudo apt install -y nginx

# Stop nginx
sudo systemctl stop nginx

# Create config
echo "[2/6] Creating configuration..."
sudo bash -c 'cat > /etc/nginx/sites-available/cloudinvoice' <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name cloudinvoice.co.in www.cloudinvoice.co.in;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    access_log /var/log/nginx/cloudinvoice-access.log;
    error_log /var/log/nginx/cloudinvoice-error.log;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /api/health {
        proxy_pass http://127.0.0.1:3002/api/health;
        access_log off;
    }
}
EOF

# Enable site
echo "[3/6] Enabling site..."
sudo ln -sf /etc/nginx/sites-available/cloudinvoice /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
echo "[4/6] Testing configuration..."
sudo nginx -t

# Start nginx
echo "[5/6] Starting nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx

# Test
echo "[6/6] Testing..."
curl -s http://localhost/api/health

echo ""
echo "✓ nginx setup complete!"
echo ""
sudo systemctl status nginx --no-pager | head -10
```

Press **Enter** and wait for it to complete.

---

## Step 3: Open Port 80 in Security Group

1. Go back to **EC2 Console** → **Instances**
2. Select your instance
3. Scroll to **Security** tab
4. Click the **Security group** link
5. Click **Inbound rules** tab
6. Click **Edit inbound rules**
7. Click **Add rule**
8. Fill in:
   - **Type:** HTTP
   - **Port:** 80
   - **Source:** Anywhere-IPv4 (0.0.0.0/0)
9. Click **Add rule** again
10. Fill in:
    - **Type:** HTTP
    - **Port:** 80
    - **Source:** Anywhere-IPv6 (::/0)
11. Click **Save rules**

---

## Step 4: Update Cloudflare DNS

1. Go to **Cloudflare Dashboard** → **DNS**
2. Find A record for `cloudinvoice.co.in` (@)
3. Change IP to: **54.151.245.180**
4. Keep **Proxy status: Proxied** (orange cloud)
5. Click **Save**

---

## Step 5: Test

Wait 2-3 minutes, then visit:
- **http://54.151.245.180** (should work immediately)
- **https://cloudinvoice.co.in** (should work after DNS update)

---

## Method 2: Systems Manager Session Manager (Alternative)

If EC2 Instance Connect doesn't work:

1. Go to **AWS Systems Manager Console**
2. Click **Session Manager** in left menu
3. Click **Start session**
4. Select your instance
5. Click **Start session**
6. Run the same script from Method 1

---

## Troubleshooting

### nginx won't start
```bash
# Check errors
sudo nginx -t
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Port 80 not accessible
```bash
# Check if nginx is listening
sudo netstat -tlnp | grep :80

# Check firewall
sudo ufw status
```

### CloudInvoice app not responding
```bash
# Check Docker containers
docker ps

# Check app logs
docker logs cloudinvoice-app

# Test app directly
curl http://localhost:3002/api/health
```

---

## After Setup

Once working, you can optionally:

1. **Close port 3002** (no longer needed):
   - Remove port 3002 rule from security group
   - Traffic goes: Cloudflare → nginx (port 80) → app (port 3002)

2. **Enable HTTPS logs**:
   ```bash
   sudo tail -f /var/log/nginx/cloudinvoice-access.log
   ```

3. **Monitor performance**:
   ```bash
   sudo systemctl status nginx
   curl http://localhost/api/health
   ```

---

## Summary

**What this does:**
- Installs nginx web server
- Configures reverse proxy (port 80 → 3002)
- Enables automatic startup
- Adds security headers
- Supports WebSocket connections
- Passes real client IPs from Cloudflare

**Result:**
- ✅ Your domain works: https://cloudinvoice.co.in
- ✅ Cloudflare SSL: Flexible mode works
- ✅ No SSL certificate needed on server
- ✅ Professional setup

---

**Estimated time:** 10 minutes  
**Difficulty:** Easy (copy-paste script)
