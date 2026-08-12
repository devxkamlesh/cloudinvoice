# WordPress Migration - Quick Steps

## 🚀 5-Step Migration Process

### STEP 1: Create Backup on VPS (5 mins)
```bash
ssh vps-2
./migrate-wp.sh
```
This creates:
- `vegamovies-files-YYYYMMDD.tar.gz` (~300MB)
- `vegamovies-db-YYYYMMDD.sql.gz` (~5-50MB)

---

### STEP 2: Download to Your PC (10 mins)
```powershell
# Run from Windows PowerShell
scp vps-2:~/backups/vegamovies-files-*.tar.gz C:\Users\kamle\Desktop\
scp vps-2:~/backups/vegamovies-db-*.sql.gz C:\Users\kamle\Desktop\
```

---

### STEP 3: Setup cPanel Database (3 mins)

**Create Database:**
1. cPanel → MySQL Databases
2. Create database: `yourname_vegamovies`
3. Create user: `yourname_vega`
4. Add user to database with ALL PRIVILEGES

**Save credentials:**
- DB Name: `yourname_vegamovies`
- DB User: `yourname_vega`
- DB Pass: `[generated_password]`
- DB Host: `localhost`

---

### STEP 4: Upload & Import (15 mins)

**A. Upload Files:**
1. cPanel → File Manager
2. Go to `/public_html/` (or domain root)
3. Upload `vegamovies-files-*.tar.gz`
4. Right-click → Extract
5. Delete .tar.gz after extraction

**B. Import Database:**
1. cPanel → phpMyAdmin
2. Select your database
3. Import tab
4. Choose `vegamovies-db-*.sql.gz`
5. Click Go

**C. Update wp-config.php:**
1. File Manager → wp-config.php → Edit
2. Change:
```php
define('DB_NAME', 'yourname_vegamovies');
define('DB_USER', 'yourname_vega');
define('DB_PASSWORD', 'your_password');
define('DB_HOST', 'localhost');
```

---

### STEP 5: Test & Go Live (10 mins)

**Update URLs (phpMyAdmin):**
```sql
UPDATE wp_options 
SET option_value = 'https://vegamoviess.online' 
WHERE option_name IN ('siteurl', 'home');
```

**Update DNS:**
- Cloudflare → DNS → Update A record to cPanel IP

**Test:**
- Visit site
- Login to /wp-admin
- Test mobile search
- Clear Cloudflare cache

**Done! 🎉**

---

## 📞 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Database connection error | Check wp-config.php credentials |
| 500 error | Check PHP version (7.4+), check .htaccess |
| 404 on pages | Settings → Permalinks → Save |
| Images broken | Check file permissions (755/644) |
| Old URLs showing | Run search-replace in database |

---

## 🔗 Useful Links

- **Detailed Guide**: See `WORDPRESS_MIGRATION_GUIDE.md`
- **VPS Backup Script**: `ssh vps-2` → `./migrate-wp.sh`
- **cPanel Login**: [your_cpanel_url]
- **Cloudflare Dashboard**: https://dash.cloudflare.com

---

**Total Time**: ~45 minutes
**Downtime**: ~15-20 minutes
