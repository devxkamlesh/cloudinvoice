# AWS Setup Guide for CloudInvoice

Complete step-by-step guide to deploy CloudInvoice on AWS infrastructure.

---

## Prerequisites

- AWS account with billing enabled
- AWS CLI installed locally (optional but recommended)
- SSH key pair or ability to create one
- Basic terminal/command-line knowledge

---

## Architecture Overview

**What we're building:**
- **Compute:** EC2 instance running Ubuntu with Docker
- **Database:** PostgreSQL in Docker (can migrate to RDS later)
- **Networking:** VPC with public subnet, security groups for SSH/HTTP/HTTPS
- **Domain:** Elastic IP for stable addressing, Route53 for DNS (optional)
- **Storage:** EBS volume for persistent data

**Estimated monthly cost:** $15–25 for t3.small + 30GB storage (well within AWS Activate credits)

---

## Part 1: Launch an EC2 Instance

### Step 1: Navigate to EC2

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Search for "EC2" in the top search bar
3. Click **Launch Instance**

### Step 2: Configure Instance

**Name and tags:**
```
Name: cloudinvoice-prod
```

**Application and OS Images (AMI):**
- Select: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
- Architecture: **64-bit (x86)**
- ✅ Free tier eligible if you're within your first 12 months

**Instance type:**
- For CloudInvoice only: **t3.micro** (1 vCPU, 1 GB RAM) — $7.50/month
- For multiple projects: **t3.small** (2 vCPU, 2 GB RAM) — $15/month
- Recommended: **t3.small** (your current VPS runs 13 containers, so you need headroom)

**Key pair (login):**
- Click **Create new key pair**
- Name: `cloudinvoice-prod`
- Type: **RSA**
- Format: **.pem** (for SSH on Windows/Mac/Linux)
- Click **Create key pair** — the `.pem` file downloads automatically
- **Save this file securely** — you cannot download it again

**Network settings:**
- VPC: Use default
- Subnet: No preference
- Auto-assign public IP: **Enable**

**Firewall (security groups):**
- Click **Create security group**
- Name: `cloudinvoice-sg`
- Description: `Allow SSH, HTTP, HTTPS for CloudInvoice`

Add these rules:

| Type  | Protocol | Port | Source       | Description          |
|-------|----------|------|--------------|----------------------|
| SSH   | TCP      | 22   | My IP        | SSH access           |
| HTTP  | TCP      | 80   | 0.0.0.0/0    | Public HTTP          |
| HTTPS | TCP      | 443  | 0.0.0.0/0    | Public HTTPS         |
| Custom TCP | TCP | 3002 | 0.0.0.0/0 | Direct app access (remove after nginx setup) |

**Important:** Set SSH source to **My IP**, not `0.0.0.0/0`. This locks SSH to your current IP address only.

**Configure storage:**
- Size: **30 GiB** (8 GiB is too tight once Docker images accumulate)
- Volume type: **gp3** (newer, slightly cheaper than gp2)
- Delete on termination: **No** (keeps your data if you accidentally terminate the instance)

**Advanced details:**
- Leave defaults

### Step 3: Launch

- Review the summary on the right
- Click **Launch instance**
- Wait ~60 seconds for the instance to reach "Running" state
- Note the **Public IPv4 address** (e.g., `54.123.45.67`)

---

## Part 2: Connect to Your Instance

### Option A: Windows (PowerShell)

```powershell
# Navigate to where you saved the .pem file
cd C:\path\to\your\key

# Set correct permissions (required by SSH)
icacls cloudinvoice-prod.pem /inheritance:r
icacls cloudinvoice-prod.pem /grant:r "$($env:USERNAME):R"

# Connect (replace with your actual IP)
ssh -i cloudinvoice-prod.pem ubuntu@54.123.45.67
```

### Option B: Mac/Linux

```bash
# Navigate to where you saved the .pem file
cd ~/Downloads

# Set correct permissions
chmod 400 cloudinvoice-prod.pem

# Connect (replace with your actual IP)
ssh -i cloudinvoice-prod.pem ubuntu@54.123.45.67
```

### Add to SSH Config (Recommended)

Create or edit `~/.ssh/config` (Windows: `C:\Users\YourName\.ssh\config`):

```
Host aws-prod
    HostName 54.123.45.67
    User ubuntu
    IdentityFile C:\path\to\cloudinvoice-prod.pem
```

Now you can connect with just: `ssh aws-prod`

**First connection:** You'll see a message about authenticity — type `yes` and press Enter.

---

## Part 3: Install Docker and Dependencies

Once connected to your instance:

### Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Docker

```bash
# Download and run Docker's official install script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu

# Log out and back in for group change to take effect
exit
```

Reconnect: `ssh aws-prod`

### Install Docker Compose v2

```bash
sudo apt install docker-compose-plugin -y
```

### Verify installation

```bash
docker --version
# Expected: Docker version 24.x or higher

docker compose version
# Expected: Docker Compose version v2.x or higher
```

---

## Part 4: Deploy CloudInvoice

### Clone the repository

```bash
cd /home/ubuntu
git clone https://github.com/devxkamlesh/cloudinvoice.git
cd cloudinvoice
```

### Set up environment variables

```bash
cp .env.example .env
nano .env
```

**Fill in these values:**

```bash
# Database
DATABASE_URL="postgresql://cloudinvoice:YOUR_STRONG_PASSWORD@postgres:5432/cloudinvoice"
POSTGRES_PASSWORD="YOUR_STRONG_PASSWORD"

# Auth (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-32-char-secret-here"
BETTER_AUTH_URL="http://54.123.45.67:3002"

# Public URLs
NEXT_PUBLIC_APP_URL="http://54.123.45.67:3002"
NEXT_PUBLIC_SUPPORT_EMAIL="support@cloudinvoice.co.in"
NEXT_PUBLIC_SECURITY_EMAIL="security@cloudinvoice.co.in"

# Email (from Resend dashboard)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="CloudInvoice <billing@yourdomain.com>"

# Cloudinary (from Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_URL="cloudinary://key:secret@cloud-name"

# Stripe (from Stripe dashboard)
STRIPE_SECRET_KEY="sk_test_xxxx or sk_live_xxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxx"

# Upstash Redis (optional, for rate limiting)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

**Generate a strong secret:**
```bash
openssl rand -base64 32
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### Start the application

```bash
docker compose up -d
```

This starts:
- `cloudinvoice-app` on port 3002
- `cloudinvoice-postgres` on internal port 5432

### Run database migrations

```bash
docker compose exec app npx prisma migrate deploy
```

### Verify it's running

```bash
docker ps
# Should show both containers as "Up" and "healthy"

curl http://localhost:3002/api/health
# Should return: {"ok":true}
```

**Test from your local machine:**
```
curl http://54.123.45.67:3002
# Should return the CloudInvoice homepage HTML
```

Open in browser: `http://54.123.45.67:3002`

---

## Part 5: Set Up a Domain and HTTPS

### Allocate an Elastic IP (optional but recommended)

By default, EC2 public IPs change when you stop/start the instance. An Elastic IP is permanent.

1. **EC2 Console** → **Elastic IPs** (left sidebar)
2. Click **Allocate Elastic IP address**
3. Click **Allocate**
4. Select the new IP → **Actions** → **Associate Elastic IP address**
5. Select your instance → **Associate**

Now your instance has a stable IP. Update your `.env` with the new IP if it changed.

### Point your domain to AWS

**Option A: Use Route53 (AWS DNS)**
1. **Route53** → **Hosted zones** → **Create hosted zone**
2. Domain name: `yourdomain.com`
3. Create an **A record**:
   - Name: Leave blank (for root) or `app` (for subdomain)
   - Type: **A**
   - Value: Your Elastic IP
   - TTL: 300

**Option B: Use your existing registrar**
1. Log in to GoDaddy/Namecheap/wherever you bought the domain
2. Go to DNS settings
3. Add an **A record**:
   - Host: `@` (root) or `app` (subdomain)
   - Points to: Your Elastic IP
   - TTL: 600

Wait 5–15 minutes for DNS propagation.

### Install nginx

```bash
sudo apt install nginx -y
```

### Configure nginx as reverse proxy

```bash
sudo nano /etc/nginx/sites-available/cloudinvoice
```

Paste this:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Replace `yourdomain.com` with your actual domain.

**Enable the site:**

```bash
sudo ln -s /etc/nginx/sites-available/cloudinvoice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Test:** Visit `http://yourdomain.com` in your browser.

### Install SSL certificate (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose **2: Redirect** (forces HTTPS)

Certbot automatically:
- Obtains a certificate from Let's Encrypt
- Updates your nginx config
- Sets up auto-renewal

**Test:** Visit `https://yourdomain.com` — you should see the green lock.

### Update environment for HTTPS

```bash
nano .env
```

Change:
```bash
BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**Rebuild and restart:**

```bash
docker compose build app
docker compose up -d
```

### Remove port 3002 from security group

Now that nginx is proxying, you don't need direct access:

1. **EC2 Console** → **Security Groups** → `cloudinvoice-sg`
2. **Inbound rules** → **Edit inbound rules**
3. **Delete** the Custom TCP 3002 rule
4. **Save rules**

---

## Part 6: Set Up Backups

### Automated daily database backup

```bash
mkdir -p /home/ubuntu/backups
crontab -e
```

Choose an editor (nano is `1`), then add this line:

```cron
0 2 * * * docker exec cloudinvoice-postgres pg_dump -U cloudinvoice -d cloudinvoice > /home/ubuntu/backups/cloudinvoice-$(date +\%Y\%m\%d).sql
```

This runs every day at 2 AM.

### Keep only last 7 days of backups

Add this line too:

```cron
0 3 * * * find /home/ubuntu/backups -name "cloudinvoice-*.sql" -mtime +7 -delete
```

Save and exit: `Ctrl+X`, `Y`, `Enter`

### Restore from backup

If you ever need to restore:

```bash
docker exec -i cloudinvoice-postgres psql -U cloudinvoice -d cloudinvoice < /home/ubuntu/backups/cloudinvoice-20260805.sql
```

---

## Part 7: Security Hardening

### Enable firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Disable password authentication (SSH key only)

```bash
sudo nano /etc/ssh/sshd_config
```

Find and change:
```
PasswordAuthentication no
```

Save and restart SSH:

```bash
sudo systemctl restart sshd
```

### Enable automatic security updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

Choose **Yes** when prompted.

---

## Part 8: Make Yourself Admin

The first admin cannot be created through the UI (by design — no request path can grant platform access).

```bash
docker exec -it cloudinvoice-postgres psql -U cloudinvoice -d cloudinvoice
```

In the Postgres prompt:

```sql
UPDATE "User" SET "platformRole" = 'ADMIN' WHERE email = 'your@email.com';
\q
```

Now `/admin` appears in your dashboard sidebar.

---

## Part 9: Monitoring (Optional)

### CloudWatch

AWS automatically sends basic metrics (CPU, disk, network) to CloudWatch.

**Set up alarms:**
1. **CloudWatch** → **Alarms** → **Create alarm**
2. Select metric: **EC2** → **Per-Instance Metrics** → Your instance → **CPUUtilization**
3. Threshold: Greater than **80%** for 5 minutes
4. Actions: Send notification to your email

Repeat for **DiskSpaceUtilization** and **NetworkIn**.

### Application logs

```bash
# View app logs
docker logs cloudinvoice-app

# Follow logs in real-time
docker logs -f cloudinvoice-app

# Last 50 lines
docker logs --tail 50 cloudinvoice-app
```

---

## Maintenance Commands

### Update the application

```bash
cd /home/ubuntu/cloudinvoice
git pull origin main
docker compose build app
docker compose up -d
```

### Restart services

```bash
docker compose restart app
```

### View running containers

```bash
docker ps
```

### Check disk space

```bash
df -h
```

### Clean up unused Docker images

```bash
docker system prune -a
```

---

## Troubleshooting

### "Permission denied (publickey)"

Your SSH key isn't being used. Check:
1. Key permissions: `chmod 400 cloudinvoice-prod.pem`
2. Correct key: `ssh -i /path/to/correct/key.pem ubuntu@ip`
3. Security group allows SSH from your current IP

### "Connection refused" on port 3002

1. Check container is running: `docker ps`
2. Check app logs: `docker logs cloudinvoice-app`
3. Check security group allows port 3002
4. Try from inside the instance: `curl localhost:3002`

### nginx 502 Bad Gateway

1. App isn't running: `docker ps` — should show `cloudinvoice-app` as Up
2. Check nginx config: `sudo nginx -t`
3. Check app is listening: `curl localhost:3002`

### Database connection errors

1. Check Postgres is running: `docker ps | grep postgres`
2. Check `DATABASE_URL` in `.env` matches `docker-compose.yml`
3. View Postgres logs: `docker logs cloudinvoice-postgres`

### SSL certificate renewal fails

Certbot renews automatically, but if it fails:
```bash
sudo certbot renew --dry-run
```

Check:
1. Port 80 is open in security group
2. nginx is running: `sudo systemctl status nginx`
3. Domain DNS points to your Elastic IP

---

## Migration from Current VPS

If you're moving from your existing DigitalOcean-like VPS:

### Step 1: Backup existing data

On your old VPS:
```bash
cd /home/ubuntu/cloudinvoice
docker exec cloudinvoice-postgres pg_dump -U cloudinvoice -d cloudinvoice > cloudinvoice-backup.sql
```

### Step 2: Copy to AWS

From your local machine:
```bash
# Download from old VPS
scp vps-1:/home/ubuntu/cloudinvoice/cloudinvoice-backup.sql .

# Upload to AWS
scp -i cloudinvoice-prod.pem cloudinvoice-backup.sql ubuntu@54.123.45.67:/home/ubuntu/
```

### Step 3: Restore on AWS

On AWS:
```bash
docker exec -i cloudinvoice-postgres psql -U cloudinvoice -d cloudinvoice < /home/ubuntu/cloudinvoice-backup.sql
```

### Step 4: Update DNS

Point your domain from the old IP to the new Elastic IP. Keep the old server running until DNS fully propagates (24–48 hours).

---

## Cost Breakdown

| Resource | Spec | Monthly Cost |
|----------|------|--------------|
| EC2 t3.small | 2 vCPU, 2 GB RAM | ~$15 |
| EBS gp3 | 30 GB storage | ~$2.50 |
| Elastic IP | 1 static IP | Free while associated |
| Data transfer | First 100 GB/month | Free |
| **Total** | | **~$17.50** |

**With AWS Activate credits:** $0 for 12–24 months (depending on your credit tier).

---

## Next Steps

Once this is running smoothly:

1. **Move database to RDS** for managed backups and scaling
2. **Add CloudFront CDN** for faster global delivery
3. **Move app to ECS Fargate** for auto-scaling
4. **Set up CI/CD** with GitHub Actions or CodePipeline
5. **Enable CloudWatch Container Insights** for deeper monitoring

---

## Support

If you encounter issues not covered here:
- Check AWS documentation: https://docs.aws.amazon.com/ec2/
- CloudInvoice deployment issues: Open an issue on GitHub
- AWS billing questions: AWS Support (part of your account)

---

**Last updated:** August 2026  
**Tested on:** Ubuntu 22.04 LTS, Docker 24.x, Next.js 15.5
