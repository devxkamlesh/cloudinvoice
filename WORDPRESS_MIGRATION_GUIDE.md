# WordPress Migration Guide: VPS to cPanel

## Site Details
- **Current Site**: vegamoviess.online (VPS)
- **Site Size**: ~346MB
- **Target**: cPanel account
- **Migration Method**: Manual backup and restore

---

## 📋 Pre-Migration Checklist

### What You Need:
- ✅ cPanel login credentials
- ✅ FTP/File Manager access
- ✅ phpMyAdmin access in cPanel
- ✅ SSH access to VPS (for backup)
- ✅ At least 500MB free space in cPanel

### Important Notes:
- ⚠️ **Downtime**: Expect 15-30 minutes downtime
- ⚠️ **DNS**: Update DNS after migration
- ⚠️ **Backup**: Keep VPS backup until confirmed working
- ⚠️ **Cloudflare**: Pause before migration

---

## 🚀 Migration Steps

### STEP 1: Backup WordPress Files from VPS

**Option A: Create Compressed Backup (Recommended)**

```bash
# SSH into VPS
ssh vps-2

# Create backup directory
mkdir -p ~/backups

# Backup WordPress files (excludes cache/logs)
sudo tar -czf ~/backups/vegamovies-files-$(date +%Y%m%d).tar.gz \
  --exclude='wp-content/cache' \
  --exclude='wp-content/uploads/cache' \
  --exclude='.git' \
  -C /home/vegamovies/htdocs vegamoviess.online

# Check backup size
ls -lh ~/backups/

# Make it downloadable
sudo chown ubuntu:ubuntu ~/backups/*.tar.gz
```

**Option B: Use WordPress Plugin (All-in-One WP Migration)**
- Install "All-in-One WP Migration" plugin
- Export → File
- Download the .wpress file
- (Note: Free version has 512MB limit)

---

### STEP 2: Backup Database

```bash
# SSH into VPS
ssh vps-2

# Export database
sudo -u vegamovies wp db export ~/backups/vegamovies-db-$(date +%Y%m%d).sql \
  --path=/home/vegamovies/htdocs/vegamoviess.online/ \
  --add-drop-table

# Compress database
gzip ~/backups/vegamovies-db-*.sql

# Make it downloadable
sudo chown ubuntu:ubuntu ~/backups/*.sql.gz

# Check files
ls -lh ~/backups/
```

---

### STEP 3: Download Backups to Your PC

**Option A: Using SCP (Windows PowerShell)**

```powershell
# Download files backup
scp vps-2:~/backups/vegamovies-files-*.tar.gz C:\Users\kamle\Desktop\

# Download database backup
scp vps-2:~/backups/vegamovies-db-*.sql.gz C:\Users\kamle\Desktop\
```

**Option B: Using SFTP Client**
- Use FileZilla/WinSCP
- Connect to VPS
- Download from `~/backups/` folder

---

### STEP 4: Prepare cPanel

#### A. Create Database in cPanel

1. Login to cPanel
2. Go to **MySQL Databases**
3. Create new database:
   - Database name: `youraccount_vegamovies`
   - Click "Create Database"
4. Create database user:
   - Username: `youraccount_vega`
   - Password: (generate strong password)
   - Click "Create User"
5. Add user to database:
   - User: `youraccount_vega`
   - Database: `youraccount_vegamovies`
   - Privileges: **ALL PRIVILEGES**
   - Click "Make Changes"

**Save These Credentials:**
```
DB_NAME: youraccount_vegamovies
DB_USER: youraccount_vega
DB_PASSWORD: [your_password]
DB_HOST: localhost
```

#### B. Create Subdomain/Domain in cPanel

1. Go to **Domains** or **Subdomains**
2. Add domain: `vegamoviess.online`
3. Document root: `/public_html/vegamoviess.online` or `/public_html`
4. Click "Create"

---

### STEP 5: Upload Files to cPanel

#### Option A: Using cPanel File Manager

1. Login to cPanel
2. Open **File Manager**
3. Navigate to your domain root (e.g., `/public_html/vegamoviess.online`)
4. Click **Upload**
5. Upload `vegamovies-files-*.tar.gz`
6. After upload, **right-click → Extract**
7. Delete the `.tar.gz` file after extraction

#### Option B: Using FTP (FileZilla)

1. Connect to cPanel via FTP
2. Navigate to domain root
3. Upload extracted WordPress files
4. (This takes longer - use File Manager instead)

---

### STEP 6: Import Database

#### Method 1: Using phpMyAdmin (Files < 50MB)

1. cPanel → **phpMyAdmin**
2. Select your database (`youraccount_vegamovies`)
3. Click **Import** tab
4. Click **Choose File**
5. Select `vegamovies-db-*.sql.gz` (phpMyAdmin handles .gz)
6. Click **Go**
7. Wait for import to complete

#### Method 2: Using SSH (Large Databases)

```bash
# If your cPanel has SSH access
# Upload database file via FTP first

# Extract and import
gunzip vegamovies-db-*.sql.gz

mysql -u youraccount_vega -p youraccount_vegamovies < vegamovies-db-*.sql
```

#### Method 3: Using WP-CLI (if available)

```bash
wp db import vegamovies-db-*.sql --path=/home/youraccount/public_html/vegamoviess.online
```

---

### STEP 7: Update wp-config.php

1. Open **File Manager** in cPanel
2. Navigate to WordPress root
3. Find `wp-config.php`
4. Right-click → **Edit**
5. Update these lines:

```php
/** Database name */
define( 'DB_NAME', 'youraccount_vegamovies' );

/** Database username */
define( 'DB_USER', 'youraccount_vega' );

/** Database password */
define( 'DB_PASSWORD', 'your_password_here' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset */
define( 'DB_CHARSET', 'utf8mb4' );
```

6. **Save Changes**

---

### STEP 8: Update Site URLs in Database

**Option A: Using WP-CLI (if available)**

```bash
# SSH into cPanel
cd /home/youraccount/public_html/vegamoviess.online

# Update URLs
wp search-replace 'https://vegamoviess.online' 'https://vegamoviess.online' \
  --all-tables --precise

# Or if moving to different domain:
wp search-replace 'https://old-domain.com' 'https://new-domain.com' \
  --all-tables
```

**Option B: Using phpMyAdmin**

```sql
-- Run these SQL queries in phpMyAdmin

-- Update site URL
UPDATE wp_options 
SET option_value = 'https://vegamoviess.online' 
WHERE option_name IN ('siteurl', 'home');

-- Update post content URLs (if domain changed)
UPDATE wp_posts 
SET post_content = REPLACE(post_content, 'http://old-domain', 'https://new-domain');

-- Update post meta
UPDATE wp_postmeta 
SET meta_value = REPLACE(meta_value, 'http://old-domain', 'https://new-domain');
```

**Option C: Using Better Search Replace Plugin**
1. Install "Better Search Replace" plugin
2. Go to Tools → Better Search Replace
3. Search: `http://old-domain.com`
4. Replace: `https://new-domain.com`
5. Select all tables
6. Check "Run as dry run" first
7. Then run actual replacement

---

### STEP 9: Fix File Permissions

```bash
# In cPanel terminal or via SSH
cd /home/youraccount/public_html/vegamoviess.online

# Fix ownership (cPanel usually auto-fixes this)
# chown -R youraccount:youraccount .

# Set proper permissions
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 600 wp-config.php
```

Or use **cPanel File Manager**:
1. Select all files
2. Right-click → **Permissions**
3. Folders: 755
4. Files: 644

---

### STEP 10: Update DNS

#### If Using Same Domain:

1. **Update A Record**:
   - Go to your domain registrar or Cloudflare
   - Update A record to point to cPanel IP
   - Wait 5-60 minutes for DNS propagation

2. **Update Cloudflare (if using)**:
   - Cloudflare Dashboard → DNS
   - Update A record: `vegamoviess.online` → `your_cpanel_ip`
   - Pause "I'm Under Attack" mode during testing

---

### STEP 11: Test Site

1. **Test Domain**: Visit `https://vegamoviess.online`
2. **Check Frontend**:
   - Homepage loads
   - Images display correctly
   - Links work
   - Search works
3. **Check Admin Panel**:
   - Login to `/wp-admin`
   - Check posts, pages, media
   - Test creating/editing content
4. **Test Mobile Search**: Verify your custom mobile search works
5. **Check SSL**: Ensure HTTPS is working

#### Common Issues:

**Issue**: White screen / 500 error
- Check `wp-config.php` database credentials
- Check PHP version (should be 7.4+ or 8.0+)
- Check error logs in cPanel

**Issue**: Site shows old VPS URL
- Run search-replace again
- Clear browser cache
- Clear Cloudflare cache

**Issue**: Images broken
- Check file permissions
- Verify wp-content/uploads exists
- Check .htaccess file

**Issue**: Permalinks not working
- Go to Settings → Permalinks
- Click "Save Changes" (regenerates .htaccess)

---

### STEP 12: Post-Migration Tasks

1. **Regenerate .htaccess**:
   - WordPress Admin → Settings → Permalinks
   - Click "Save Changes"

2. **Clear All Caches**:
   - WordPress cache (if using cache plugin)
   - Cloudflare cache
   - Browser cache

3. **Update Cloudflare Settings**:
   - SSL: Full (strict)
   - Turn off "I'm Under Attack" mode
   - Enable Bot Fight Mode
   - Check rate limiting rules still work

4. **Test Email**:
   - Test contact forms
   - Test password reset
   - Configure SMTP if needed

5. **Setup Backups**:
   - Enable cPanel automatic backups
   - Or install UpdraftPlus backup plugin

6. **Monitor**:
   - Check site for 24 hours
   - Monitor error logs
   - Watch for 404s, broken links

---

## 🔧 Migration Scripts

### Quick Migration Script (VPS Side)

Save this as `migrate-wp.sh` on VPS:

```bash
#!/bin/bash

# Configuration
SITE_PATH="/home/vegamovies/htdocs/vegamoviess.online"
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

echo "=== WordPress Migration Backup ==="
echo "Site: $SITE_PATH"
echo "Backup Dir: $BACKUP_DIR"
echo ""

# Backup files
echo "📁 Backing up files..."
sudo tar -czf $BACKUP_DIR/vegamovies-files-$DATE.tar.gz \
  --exclude='wp-content/cache' \
  --exclude='wp-content/uploads/cache' \
  --exclude='.git' \
  --exclude='*.log' \
  -C /home/vegamovies/htdocs vegamoviess.online

# Backup database
echo "🗄️ Backing up database..."
sudo -u vegamovies wp db export $BACKUP_DIR/vegamovies-db-$DATE.sql \
  --path=$SITE_PATH \
  --add-drop-table

# Compress database
echo "📦 Compressing database..."
gzip $BACKUP_DIR/vegamovies-db-$DATE.sql

# Fix permissions
echo "🔐 Fixing permissions..."
sudo chown ubuntu:ubuntu $BACKUP_DIR/*

# Summary
echo ""
echo "✅ Backup Complete!"
echo ""
echo "Files:"
ls -lh $BACKUP_DIR/vegamovies-files-$DATE.tar.gz
echo ""
echo "Database:"
ls -lh $BACKUP_DIR/vegamovies-db-$DATE.sql.gz
echo ""
echo "Total Size:"
du -sh $BACKUP_DIR
echo ""
echo "📥 Download these files to your PC:"
echo "   scp vps-2:$BACKUP_DIR/vegamovies-files-$DATE.tar.gz ."
echo "   scp vps-2:$BACKUP_DIR/vegamovies-db-$DATE.sql.gz ."
```

Run it:
```bash
chmod +x migrate-wp.sh
./migrate-wp.sh
```

---

## 📊 Migration Checklist

### Before Migration:
- [ ] Backup VPS site (files + database)
- [ ] Download backups to PC
- [ ] Pause Cloudflare "I'm Under Attack" mode
- [ ] Note current database credentials
- [ ] Document custom configurations

### During Migration:
- [ ] Create cPanel database
- [ ] Upload files to cPanel
- [ ] Import database
- [ ] Update wp-config.php
- [ ] Fix file permissions
- [ ] Update site URLs

### After Migration:
- [ ] Test frontend
- [ ] Test admin panel
- [ ] Test mobile search
- [ ] Update DNS records
- [ ] Clear all caches
- [ ] Test SSL/HTTPS
- [ ] Test contact forms
- [ ] Monitor for 24 hours

### Optional:
- [ ] Setup cPanel backups
- [ ] Install SSL certificate
- [ ] Configure email (SMTP)
- [ ] Setup cron jobs (if any)
- [ ] Install security plugins

---

## 🆘 Troubleshooting

### Database Connection Error
```
Error establishing a database connection
```
**Fix**: Check wp-config.php database credentials

### Internal Server Error (500)
**Fix**: 
- Check PHP version (Settings → MultiPHP Manager)
- Check .htaccess file
- Check error logs (cPanel → Errors)

### Permalinks Not Working (404s)
**Fix**:
- Settings → Permalinks → Save Changes
- Check .htaccess exists and is writable

### Mixed Content Warnings
**Fix**:
- Run search-replace for http → https
- Check Cloudflare SSL settings

---

## 📞 Need Help?

If you encounter issues during migration:
1. Check cPanel error logs
2. Enable WordPress debug mode
3. Check database connection
4. Verify file permissions
5. Clear all caches

---

## 🎯 Quick Summary

**Estimated Time**: 30-60 minutes
**Difficulty**: Moderate
**Downtime**: 15-30 minutes

**Steps**:
1. Backup VPS (files + database)
2. Download to PC
3. Create cPanel database
4. Upload files to cPanel
5. Import database
6. Update wp-config.php
7. Update URLs
8. Update DNS
9. Test everything
10. Monitor site

**Good luck with your migration! 🚀**
