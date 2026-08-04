# Cloudflare Setup Guide for CloudInvoice on AWS

Complete guide to connect your domain through Cloudflare to your AWS instance, with free SSL and DDoS protection.

---

## Why Cloudflare?

**Benefits over direct DNS:**
- ✅ Free SSL certificate (no Let's Encrypt setup needed)
- ✅ DDoS protection and firewall
- ✅ Global CDN for faster page loads
- ✅ Caching for static assets
- ✅ Web Application Firewall (WAF)
- ✅ Analytics and threat insights
- ✅ Automatic HTTPS redirects
- ✅ Easy DNS management

---

## Prerequisites

- Domain name registered (GoDaddy, Namecheap, etc.)
- AWS instance running at **54.151.245.180**
- CloudInvoice deployed and accessible on port 3002

---

## Part 1: Open Port 3002 in AWS Security Group

Before setting up Cloudflare, make sure external traffic can reach your instance.

### Step 1: Find Your Security Group

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **Instances** in the left sidebar
3. Select your `cloudinvoice-prod` instance
4. Scroll down to **Security** tab
5. Click on the security group name (e.g., `sg-xxxxxxxxx`)

### Step 2: Add Inbound Rule

1. Click **Inbound rules** tab
2. Click **Edit inbound rules**
3. Click **Add rule**
4. Configure:
   - **Type:** Custom TCP
   - **Port range:** 3002
   - **Source:** 0.0.0.0/0 (Anywhere IPv4)
   - **Description:** CloudInvoice app
5. Click **Add rule** again for IPv6:
   - **Type:** Custom TCP
   - **Port range:** 3002
   - **Source:** ::/0 (Anywhere IPv6)
   - **Description:** CloudInvoice app IPv6
6. Click **Save rules**

### Step 3: Verify Access

Open in browser: **http://54.151.245.180:3002**

You should see the CloudInvoice homepage. If not, check:
- Security group rules saved correctly
- Docker containers are running: `docker ps`
- App logs: `docker logs cloudinvoice-app`

---

## Part 2: Add Domain to Cloudflare

### Step 1: Create Cloudflare Account

1. Go to https://www.cloudflare.com/
2. Click **Sign Up** (it's free)
3. Enter your email and create a password
4. Verify your email

### Step 2: Add Your Site

1. Click **Add site** on the dashboard
2. Enter your domain (e.g., `cloudinvoice.co.in`)
3. Click **Add site**

### Step 3: Choose Plan

1. Select **Free** plan (includes everything you need)
2. Click **Continue**

### Step 4: Import DNS Records

Cloudflare will scan your current DNS records.

1. Review the records it found
2. **Delete any existing A records** pointing to old servers
3. Click **Continue**

---

## Part 3: Point Domain to AWS

### Option A: Root Domain (cloudinvoice.co.in)

Add these DNS records in Cloudflare:

| Type | Name | Content           | Proxy status | TTL  |
|------|------|-------------------|--------------|------|
| A    | @    | 54.151.245.180    | Proxied      | Auto |
| A    | www  | 54.151.245.180    | Proxied      | Auto |

### Option B: Subdomain (app.yourdomain.com)

Add this DNS record:

| Type | Name | Content           | Proxy status | TTL  |
|------|------|-------------------|--------------|------|
| A    | app  | 54.151.245.180    | Proxied      | Auto |

**To add a record:**
1. Click **DNS** in Cloudflare sidebar
2. Click **Add record**
3. Fill in the details above
4. Make sure **Proxy status** is **Proxied** (orange cloud icon) ← This enables SSL and protection
5. Click **Save**

---

## Part 4: Update Nameservers

Cloudflare will give you 2 nameservers like:
- `alice.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

### Update at Your Registrar

**GoDaddy:**
1. Log in to https://dcc.godaddy.com/
2. Find your domain → Click **DNS**
3. Scroll to **Nameservers** → Click **Change**
4. Select **Use custom nameservers**
5. Enter Cloudflare's 2 nameservers
6. Click **Save**

**Namecheap:**
1. Log in to https://www.namecheap.com/
2. Domain List → **Manage** next to your domain
3. Find **Nameservers** → Select **Custom DNS**
4. Enter Cloudflare's 2 nameservers
5. Click green checkmark

**Other registrars:**
- Look for "Nameservers", "DNS", or "Name Server Settings"
- Replace existing nameservers with Cloudflare's

### Wait for Propagation

- Nameserver changes take **2–48 hours** (usually under 2 hours)
- Cloudflare will email you when it's active
- Check status in Cloudflare dashboard

---

## Part 5: Configure SSL in Cloudflare

### Step 1: Set SSL Mode

1. In Cloudflare dashboard, click **SSL/TLS**
2. Set mode to: **Flexible**
   - Visitor → Cloudflare: HTTPS (encrypted)
   - Cloudflare → Your server: HTTP (port 3002)
3. This works because your app doesn't have its own SSL certificate yet

**For production (recommended later):**
- Upgrade to **Full (strict)** after installing SSL on your AWS instance
- See "Part 7: Full SSL Setup" below

### Step 2: Enable Always Use HTTPS

1. Go to **SSL/TLS** → **Edge Certificates**
2. Turn on **Always Use HTTPS**
3. This auto-redirects HTTP to HTTPS

### Step 3: Enable HTTP Strict Transport Security (HSTS)

1. Same page → Scroll to **HSTS**
2. Click **Enable HSTS**
3. Settings:
   - Max Age: 6 months
   - Include subdomains: Yes (if using www)
   - Preload: No (unless you know what this means)
4. Click **Save**

---

## Part 6: Update CloudInvoice Environment

Once DNS is active, update your `.env` to use the domain instead of IP.

### Connect to AWS

```bash
ssh -i "C:\Users\kamle\Downloads\cloudinvoice-prod.pem" ubuntu@54.151.245.180
```

### Edit Environment

```bash
cd /home/ubuntu/cloudinvoice
nano .env
```

**Update these lines:**

```bash
# Replace IP with your domain
BETTER_AUTH_URL="https://cloudinvoice.co.in"
NEXT_PUBLIC_APP_URL="https://cloudinvoice.co.in"

# Or if using subdomain:
# BETTER_AUTH_URL="https://app.yourdomain.com"
# NEXT_PUBLIC_APP_URL="https://app.yourdomain.com"
```

**Important:** Use `https://`, not `http://`

Save: `Ctrl+X`, `Y`, `Enter`

### Rebuild and Restart

```bash
docker compose build app
docker compose up -d
```

### Test

Visit: **https://cloudinvoice.co.in** (or your domain)

You should see:
- ✅ Green lock icon in browser (HTTPS working)
- ✅ CloudInvoice homepage loads
- ✅ No "Mixed Content" warnings in browser console

---

## Part 7: Cloudflare Security Settings

### Enable WAF Rules

1. **Security** → **WAF**
2. Click **Create rule**
3. Name: `Block Malicious Bots`
4. Expression: `(cf.threat_score gt 10)`
5. Action: **Block**
6. Click **Deploy**

### Rate Limiting (Free Tier)

1. **Security** → **WAF**
2. Go to **Rate limiting rules**
3. Click **Create rule**
4. Name: `Login Rate Limit`
5. Match: `http.request.uri.path contains "/api/auth"`
6. Rate: 10 requests per 1 minute
7. Action: **Block** for 1 minute
8. Click **Deploy**

### Bot Fight Mode

1. **Security** → **Bots**
2. Turn on **Bot Fight Mode** (free)
3. This blocks known bad bots automatically

---

## Part 8: Cloudflare Performance Settings

### Enable Auto Minify

1. **Speed** → **Optimization**
2. Turn on:
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML

### Enable Brotli

1. Same page → **Brotli**
2. Turn it **On**
3. Better compression than Gzip

### Caching

1. **Caching** → **Configuration**
2. Caching Level: **Standard**
3. Browser Cache TTL: **4 hours**

### Page Rules (Optional)

Cache static assets longer:

1. **Rules** → **Page Rules**
2. Click **Create Page Rule**
3. URL: `*cloudinvoice.co.in/*.{jpg,jpeg,png,gif,css,js,woff,woff2,svg,ico}`
4. Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
5. Click **Save and Deploy**

---

## Part 9: Full SSL Setup (Optional but Recommended)

For maximum security, encrypt traffic between Cloudflare and your server.

### Install nginx on AWS

```bash
ssh -i "C:\Users\kamle\Downloads\cloudinvoice-prod.pem" ubuntu@54.151.245.180
sudo apt update
sudo apt install nginx -y
```

### Create nginx Config

```bash
sudo nano /etc/nginx/sites-available/cloudinvoice
```

Paste this:

```nginx
server {
    listen 80;
    server_name cloudinvoice.co.in www.cloudinvoice.co.in;

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
        
        # Cloudflare real IP
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
    }
}
```

Replace `cloudinvoice.co.in` with your domain.

**Enable the site:**

```bash
sudo ln -s /etc/nginx/sites-available/cloudinvoice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Get Cloudflare Origin Certificate

1. In Cloudflare: **SSL/TLS** → **Origin Server**
2. Click **Create Certificate**
3. Keep defaults:
   - Private key type: RSA
   - Hostnames: `*.yourdomain.com, yourdomain.com`
   - Validity: 15 years
4. Click **Create**
5. **Copy both** the certificate and private key

### Install Certificate on AWS

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/cert.pem
```

Paste the **Origin Certificate**, save (`Ctrl+X`, `Y`, `Enter`)

```bash
sudo nano /etc/ssl/cloudflare/key.pem
```

Paste the **Private Key**, save

```bash
sudo chmod 600 /etc/ssl/cloudflare/key.pem
```

### Update nginx for HTTPS

```bash
sudo nano /etc/nginx/sites-available/cloudinvoice
```

Replace entire file with:

```nginx
server {
    listen 80;
    server_name cloudinvoice.co.in www.cloudinvoice.co.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cloudinvoice.co.in www.cloudinvoice.co.in;

    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

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
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
    }
}
```

**Reload nginx:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Update AWS Security Group

Now that nginx is proxying:

1. EC2 Console → Security Groups
2. **Remove** port 3002 rule (no longer needed)
3. **Keep** port 80 and 443

### Change Cloudflare SSL Mode

1. Cloudflare dashboard: **SSL/TLS**
2. Change mode to: **Full (strict)**
3. Now traffic is encrypted end-to-end

---

## Part 10: Monitoring and Analytics

### Cloudflare Analytics

1. **Analytics & Logs** → **Traffic**
2. View:
   - Requests per day
   - Bandwidth usage
   - Threats blocked
   - Top countries/pages

### Set Up Alerts

1. **Notifications**
2. Click **Add**
3. Select alerts you want:
   - Traffic spike
   - Error rate increase
   - DDoS attack detected
4. Choose delivery method (email, webhook, PagerDuty)

---

## Troubleshooting

### "Too many redirects" error

**Cause:** SSL mode mismatch between Cloudflare and your server.

**Fix:**
- If no nginx: Use **Flexible** SSL mode
- If nginx with Cloudflare cert: Use **Full (strict)** SSL mode
- Never use **Full** without a valid certificate

### "Origin server unreachable"

**Check:**
1. AWS security group allows port 3002 (or 80/443 if using nginx)
2. Docker containers are running: `docker ps`
3. DNS is pointing to correct IP: `dig yourdomain.com`
4. Cloudflare proxy is enabled (orange cloud icon)

### Changes not reflecting

**Cloudflare caches aggressively:**
1. **Caching** → **Configuration**
2. Click **Purge Everything**
3. Or use **Development Mode** (disables caching for 3 hours)

### Real visitor IP is wrong

Your app sees Cloudflare IPs instead of real users.

**Fix in Next.js (already done in CloudInvoice):**
- Check `X-Forwarded-For` header
- Or use `CF-Connecting-IP` header (Cloudflare-specific)

---

## Migration Checklist

When moving from IP to domain:

- [ ] DNS records added in Cloudflare
- [ ] Nameservers updated at registrar
- [ ] DNS propagation complete (check: https://dnschecker.org/)
- [ ] SSL mode set to Flexible (or Full if using nginx)
- [ ] `.env` updated with `https://yourdomain.com`
- [ ] Docker containers rebuilt and restarted
- [ ] Can access site at https://yourdomain.com
- [ ] HTTPS lock icon shows green
- [ ] Sign in/sign up works (auth redirects to correct URL)
- [ ] Invoice PDFs generate with correct domain
- [ ] Share links work with domain
- [ ] Email links point to domain
- [ ] Old IP bookmarks redirected (optional: add redirect rule in Cloudflare)

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Cloudflare Free Plan | $0 |
| SSL Certificate | $0 (included) |
| DDoS Protection | $0 (unlimited) |
| CDN Bandwidth | $0 (unlimited) |
| DNS | $0 |
| **Total** | **$0** |

**Paid plans (optional):**
- **Pro ($20/month):** Advanced security, image optimization, mobile redirects
- **Business ($200/month):** Custom WAF rules, prioritized support
- **Enterprise (custom):** 100% uptime SLA, dedicated account team

For CloudInvoice, the **Free plan is perfect**.

---

## Next Steps

Once domain is live with Cloudflare:

1. **Set up email sending** with custom domain (Resend + your domain)
2. **Add Cloudflare Workers** for edge functions (API rate limiting, geo-blocking)
3. **Enable Cloudflare Images** for invoice logo optimization
4. **Set up Cloudflare Pages** for marketing site (separate from app)
5. **Add Cloudflare Turnstile** for CAPTCHA (free, privacy-friendly alternative to reCAPTCHA)

---

## Support

**Cloudflare Issues:**
- Community forum: https://community.cloudflare.com/
- Support: https://dash.cloudflare.com/?to=/:account/support
- Status page: https://www.cloudflarestatus.com/

**CloudInvoice Issues:**
- GitHub: https://github.com/devxkamlesh/cloudinvoice
- Email: support@cloudinvoice.co.in

---

**Last updated:** August 2026  
**Tested with:** Cloudflare Free Plan, AWS EC2, Next.js 15.5
