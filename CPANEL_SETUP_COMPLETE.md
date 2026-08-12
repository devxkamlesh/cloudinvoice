# Complete cPanel Setup Guide for vegamoviess.online

## 📋 What You Have
- ✅ Downloaded file: `vegamovies-files-20260812.tar.gz` (107 MB)
- ✅ cPanel URL: https://135-181-224-230.cprapid.com:2083/
- ✅ Username: vegamoviess
- ✅ Password: vk^38+%Fd1+%,J#o

---

## 🚀 Complete Setup Process

### PHASE 1: Database Setup (5 minutes)

#### Step 1.1: Create MySQL Database

1. **Login to cPanel**: https://135-181-224-230.cprapid.com:2083/
2. Find and click **"MySQL® Databases"** (under Databases section)
3. **Create Database**:
   - Database Name: `vegamovies` (it will become `vegamoviess_vegamovies`)
   - Click **"Create Database"**
   - You'll see: ✅ Database created successfully

#### Step 1.2: Create Database User

1. Scroll down to **"MySQL Users"** section
2. **Add New User**:
   - Username: `vegadb` (it will become `vegamoviess_vegadb`)
   - Password: Click **"Generate Password"** button
   - **IMPORTANT**: Copy and save this password!
   - Strength: Should be 100 (Very Strong)
   - Click **"Create User"**

**Save these credentials:**
```
DB_NAME: vegamoviess_vegamovies
DB_USER: vegamoviess_vegadb
DB_PASSWORD: [the password you just generated]
DB_HOST: localhost
```

#### Step 1.3: Add User to Database

1. Scroll to **"Add User To Database"** section
2. **User**: Select `vegamoviess_vegadb`
3. **Database**: Select `vegamoviess_vegamovies`
4. Click **"Add"**
5. On privileges page, check **"ALL PRIVILEGES"** checkbox at top
6. Click **"Make Changes"**

✅ **Database setup complete!**

---

### PHASE 2: Upload WordPress Files (15 minutes)

#### Step 2.1: Access File Manager

1. In cPanel, click **"File Manager"** (under Files section)
2. Navigate to **`public_html`** folder (this is your web root)
3. Check if domain folder exists:
   - If you see `vegamoviess.online` folder → go into it
   - If not → stay in `public_html`

#### Step 2.2: Upload Backup File

1. Click **"Upload"** button at top
2. Click **"Select File"** button
3. Find and select: `vegamovies-files-20260812.tar.gz` from Downloads/Documents
4. Wait for upload to complete (shows 100%)
5. Click **"Go Back to..."** to return to File Manager

**Upload time: ~10-15 minutes at typical upload speeds**

#### Step 2.3: Extract Files

1. In File Manager, find `vegamovies-files-20260812.tar.gz`
2. **Right-click** on the file → Select **"Extract"**
3. Extract Path: (leave as current directory)
4. Click **"Extract File(s)"**
5. Wait for extraction (progress bar)
6. Click **"Close"** when done

#### Step 2.4: Move Files to Root (If Needed)

After extraction, you might see a folder like `vegamoviess.online`. If so:

1. Open that folder
2. Select **ALL files** (click checkbox at top)
3. Click **"Move"** button
4. Destination: `/home/vegamoviess/public_html/`
5. Click **"Move File(s)"**
6. Go back and delete the empty `vegamoviess.online` folder
7. Delete `vegamovies-files-20260812.tar.gz` (no longer needed)

**Final structure should be:**
```
public_html/
├── wp-admin/
├── wp-content/
├── wp-includes/
├── wp-config.php
├── index.php
└── ... other WordPress files
```

✅ **Files uploaded and extracted!**

---

### PHASE 3: Database Import (10 minutes)

#### Step 3.1: Get Database File

**Option A: Database already in uploaded files**
1. Check File Manager → `public_html/` for `.sql` or `.sql.gz` file
2. If you find it, note the filename

**Option B: Need to download database separately**
1. Run on your PC:
   ```bash
   scp vps-2:~/backups/vegamovies-db-*.sql.gz C:\Users\kamle\Desktop\
   ```
2. Wait for download

#### Step 3.2: Upload Database (if separate file)

If database wasn't in the tar.gz:

1. **File Manager** → `public_html/`
2. **Upload** the `vegamovies-db-*.sql.gz` file
3. Wait for upload to complete

#### Step 3.3: Import Database via phpMyAdmin

1. In cPanel, click **"phpMyAdmin"** (under Databases)
2. **Left sidebar**: Click on `vegamoviess_vegamovies` database
3. Click **"Import"** tab at top
4. Click **"Choose File"** button
5. **Option A - If .sql.gz file is on PC**:
   - Select the `.sql.gz` file from your Downloads
   - phpMyAdmin can import .gz files directly
6. **Option B - If .sql file in cPanel**:
   - First extract it in File Manager (right-click → Extract)
   - Then browse and select the `.sql` file
7. Scroll down and click **"Import"** button
8. Wait for import (may take 2-5 minutes)
9. You should see: ✅ Import has been successfully finished

**Alternative: Import via File Manager SQL**
If file is large and phpMyAdmin fails:
1. Extract `.sql.gz` in File Manager
2. Use cPanel's built-in SQL import tool
3. Or contact cPanel support for assistance

✅ **Database imported!**

---

### PHASE 4: Configure WordPress (5 minutes)

#### Step 4.1: Update wp-config.php

1. **File Manager** → `public_html/`
2. Find `wp-config.php`
3. **Right-click** → **"Edit"**
4. Click **"Edit"** button in popup (ignore encoding warning)

#### Step 4.2: Update Database Credentials

Find these lines and update:

**BEFORE:**
```php
define( 'DB_NAME', 'something_old' );
define( 'DB_USER', 'something_old' );
define( 'DB_PASSWORD', 'old_password' );
define( 'DB_HOST', 'localhost' );
```

**AFTER:** (use YOUR credentials from Step 1)
```php
define( 'DB_NAME', 'vegamoviess_vegamovies' );
define( 'DB_USER', 'vegamoviess_vegadb' );
define( 'DB_PASSWORD', 'your_generated_password_here' );
define( 'DB_HOST', 'localhost' );
```

#### Step 4.3: Add Security Keys (Optional but Recommended)

If you see placeholder security keys, update them:
1. Visit: https://api.wordpress.org/secret-key/1.1/salt/
2. Copy all the generated keys
3. Replace the old keys in wp-config.php with new ones

#### Step 4.4: Save Changes

1. Click **"Save Changes"** button (top-right)
2. Click **"Close"** to exit editor

✅ **WordPress configured!**

---

### PHASE 5: Update URLs in Database (CRITICAL!)

#### Step 5.1: Update Site URLs via phpMyAdmin

1. **phpMyAdmin** → Select `vegamoviess_vegamovies` database
2. Click **"SQL"** tab
3. **Copy and paste** this query:

```sql
-- Update WordPress site URLs
UPDATE wp_options 
SET option_value = 'https://vegamoviess.online' 
WHERE option_name IN ('siteurl', 'home');

-- Verify the change
SELECT * FROM wp_options 
WHERE option_name IN ('siteurl', 'home');
```

4. Click **"Go"** button
5. You should see: 2 rows affected

#### Step 5.2: Replace Old URLs in Content (If Domain Changed)

**Only if you're changing domain names**, run this:

```sql
-- Replace old domain in post content
UPDATE wp_posts 
SET post_content = REPLACE(post_content, 'http://old-domain.com', 'https://vegamoviess.online');

-- Replace in post meta
UPDATE wp_postmeta 
SET meta_value = REPLACE(meta_value, 'http://old-domain.com', 'https://vegamoviess.online');

-- Replace in options
UPDATE wp_options 
SET option_value = REPLACE(option_value, 'http://old-domain.com', 'https://vegamoviess.online');
```

✅ **URLs updated!**

---

### PHASE 6: Fix Permissions (2 minutes)

#### Step 6.1: Set Correct Permissions

1. **File Manager** → `public_html/`
2. Select **ALL files and folders** (click top checkbox)
3. Click **"Permissions"** button at top
4. For **Folders**:
   - Set to: `755` (rwxr-xr-x)
5. For **Files**:
   - Set to: `644` (rw-r--r--)
6. Check **"Recurse into subdirectories"**
7. Click **"Change Permissions"**

#### Step 6.2: Secure wp-config.php

1. Find `wp-config.php` only
2. Right-click → **"Permissions"**
3. Set to: `600` or `400` (read-only for owner)
4. Click **"Change Permissions"**

✅ **Permissions secured!**

---

### PHASE 7: Update DNS & SSL (10-60 minutes)

#### Step 7.1: Get Your cPanel IP

1. cPanel homepage → Look for **"Server IP"** or **"Shared IP Address"**
2. Copy the IP (e.g., `135.181.224.230`)

#### Step 7.2: Update DNS Records

**If using Cloudflare:**

1. Login to Cloudflare: https://dash.cloudflare.com
2. Select domain: `vegamoviess.online`
3. Go to **DNS** tab
4. Find **A record** for `@` or `vegamoviess.online`
5. Click **Edit**
6. **Update IP address** to your cPanel IP: `135.181.224.230`
7. Keep **Proxy status**: Proxied (orange cloud)
8. Click **Save**
9. **Wait 5-30 minutes** for DNS propagation

**If using domain registrar DNS:**

1. Login to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS management
3. Update A record to point to cPanel IP
4. Save changes
5. Wait 15-60 minutes for propagation

#### Step 7.3: Install SSL Certificate

**Option A: AutoSSL (cPanel automatic - easiest)**

1. cPanel → **"SSL/TLS Status"** (under Security)
2. Find `vegamoviess.online`
3. Click **"Run AutoSSL"**
4. Wait 2-5 minutes
5. Should show ✅ SSL installed

**Option B: Let's Encrypt (if AutoSSL not available)**

1. cPanel → **"Let's Encrypt™ SSL"**
2. Select domain: `vegamoviess.online`
3. Click **"Issue"**
4. Wait for certificate installation

**Option C: Cloudflare SSL**

1. Cloudflare → **SSL/TLS** tab
2. Set SSL mode to: **"Full"** or **"Full (strict)"**
3. SSL/TLS → Edge Certificates
4. Enable **"Always Use HTTPS"**

✅ **DNS updated & SSL installed!**

---

### PHASE 8: Test Your Site (5 minutes)

#### Step 8.1: Test Domain Access

1. **Open browser** (use Incognito/Private mode)
2. Visit: `https://vegamoviess.online`
3. Check if site loads

**If not loading:**
- DNS may not be propagated yet (wait 15-30 mins)
- Clear browser cache
- Try: `http://your-cpanel-ip/~vegamoviess`

#### Step 8.2: Test WordPress Admin

1. Visit: `https://vegamoviess.online/wp-admin`
2. Login with your WordPress credentials
3. Should see WordPress dashboard

**If "Error establishing database connection":**
- Check wp-config.php database credentials
- Verify database user has ALL PRIVILEGES

#### Step 8.3: Test Frontend Features

- ✅ Homepage loads
- ✅ Images display
- ✅ Links work
- ✅ Mobile search works (your custom search box)
- ✅ Category pages work
- ✅ Single post pages work

#### Step 8.4: Fix Permalinks (If 404 errors)

1. **WordPress Admin** → **Settings** → **Permalinks**
2. Click **"Save Changes"** (don't change anything)
3. This regenerates `.htaccess` file
4. Test links again

✅ **Site is working!**

---

### PHASE 9: Post-Migration Tasks (10 minutes)

#### Step 9.1: Clear All Caches

1. **WordPress cache** (if using cache plugin):
   - WP Super Cache: Settings → Delete Cache
   - W3 Total Cache: Performance → Purge All Caches

2. **Cloudflare cache**:
   - Cloudflare Dashboard
   - Caching → Purge Everything
   - Confirm

3. **Browser cache**:
   - Clear browser cache
   - Test in Incognito mode

#### Step 9.2: Update Cloudflare Settings

1. **SSL/TLS**: Set to "Full" or "Full (strict)"
2. **Turn off "I'm Under Attack" mode** (if still on)
3. **Keep Bot Fight Mode**: Enabled
4. **Keep Rate Limiting rules**: If configured
5. Test site loading speed

#### Step 9.3: Setup Backups

**cPanel Automatic Backups:**
1. cPanel → **"Backup"**
2. Enable automatic backups if available
3. Or setup manual backup schedule

**WordPress Backup Plugin (Recommended):**
1. Install **UpdraftPlus** plugin
2. Configure backup schedule
3. Connect to cloud storage (Google Drive, Dropbox, etc.)

#### Step 9.4: Test Email Functions

1. Test password reset
2. Test contact forms (if any)
3. Configure SMTP if needed:
   - Install **WP Mail SMTP** plugin
   - Use your email provider's SMTP settings

#### Step 9.5: Check Site Performance

1. Test on mobile device
2. Test mobile search feature
3. Check page load speed
4. Monitor for any errors

✅ **Migration complete!**

---

## 🔍 Troubleshooting Guide

### Issue: "Error establishing a database connection"

**Fix:**
1. Check `wp-config.php` credentials
2. Verify database exists in phpMyAdmin
3. Test database connection:
   - phpMyAdmin → Select database
   - Run: `SELECT * FROM wp_options LIMIT 1;`
   - Should return results

### Issue: "500 Internal Server Error"

**Fix:**
1. Check `.htaccess` file - delete and regenerate via Permalinks
2. Check PHP version (should be 7.4+ or 8.0+)
3. Check error logs: cPanel → **"Errors"**
4. Check file permissions (folders: 755, files: 644)

### Issue: "404 Not Found" on pages

**Fix:**
1. Settings → Permalinks → Save Changes
2. Check `.htaccess` exists in root
3. Make sure mod_rewrite is enabled (contact host)

### Issue: Images not loading / broken

**Fix:**
1. Check file permissions on wp-content/uploads
2. Verify URLs in database are correct
3. Re-run URL search-replace if needed

### Issue: Can't login to wp-admin

**Fix:**
1. Clear browser cookies
2. Try: `yoursite.com/wp-login.php`
3. Reset password via database:
   ```sql
   UPDATE wp_users 
   SET user_pass = MD5('newpassword123') 
   WHERE user_login = 'admin';
   ```

### Issue: White screen (no error)

**Fix:**
1. Enable WordPress debug mode in wp-config.php:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```
2. Check: `wp-content/debug.log`
3. Fix the reported error

### Issue: Slow loading

**Fix:**
1. Install cache plugin (WP Super Cache)
2. Enable Cloudflare caching
3. Optimize images
4. Check PHP version (8.0+ is faster)

---

## ✅ Migration Checklist

### Pre-Migration
- [x] Downloaded backup from VPS (107 MB)
- [x] VPS cleanup script ready
- [x] cPanel credentials confirmed

### Database
- [ ] Database created
- [ ] Database user created
- [ ] User added to database with ALL PRIVILEGES
- [ ] Credentials saved

### Files
- [ ] Files uploaded to cPanel
- [ ] Files extracted
- [ ] Files moved to correct location
- [ ] Cleanup .tar.gz file

### Database Import
- [ ] Database file obtained
- [ ] Database imported via phpMyAdmin
- [ ] Import successful (no errors)

### Configuration
- [ ] wp-config.php updated
- [ ] Database credentials correct
- [ ] URLs updated in database
- [ ] File permissions set correctly

### DNS & SSL
- [ ] DNS A record updated
- [ ] SSL certificate installed
- [ ] HTTPS working

### Testing
- [ ] Homepage loads
- [ ] Admin panel accessible
- [ ] Permalinks working
- [ ] Images loading
- [ ] Mobile search working
- [ ] No PHP errors

### Post-Migration
- [ ] All caches cleared
- [ ] Cloudflare settings updated
- [ ] Backups configured
- [ ] Email tested
- [ ] Performance verified

### Cleanup
- [ ] VPS temporary files removed
- [ ] cPanel .tar.gz deleted
- [ ] Old VPS kept as backup (7-14 days)

---

## 📞 Support Resources

**cPanel Help:**
- cPanel Documentation: https://docs.cpanel.net/
- Video Tutorials: https://cpanel.net/videos/

**WordPress Help:**
- Moving WordPress: https://wordpress.org/support/article/moving-wordpress/
- Common Issues: https://wordpress.org/support/article/common-wordpress-errors/

**Need Professional Help?**
- Contact your cPanel hosting support
- WordPress.org forums
- Hire WordPress developer on Fiverr/Upwork

---

## 🎯 Quick Command Reference

**VPS Cleanup (after download):**
```bash
ssh vps-2 "~/cleanup-after-download.sh"
```

**Database URL Update:**
```sql
UPDATE wp_options SET option_value = 'https://vegamoviess.online' 
WHERE option_name IN ('siteurl', 'home');
```

**Test Database Connection:**
```bash
# In cPanel Terminal
mysql -u vegamoviess_vegadb -p vegamoviess_vegamovies -e "SELECT 1;"
```

**Regenerate .htaccess:**
WordPress Admin → Settings → Permalinks → Save

---

## 🎉 Success!

Once all checklist items are complete and site is working:

1. ✅ Migration successful!
2. ☕ Monitor site for 24 hours
3. 🗄️ Keep VPS backup for 7-14 days
4. 🎯 After confirmed stable, clean up VPS completely

**Congratulations! Your WordPress site is now on cPanel!** 🚀

---

**Need help? Check WORDPRESS_MIGRATION_GUIDE.md for detailed explanations!**
