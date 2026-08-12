# VPS Cleanup After Migration

## 🧹 Cleanup Commands - Run After Successful Migration

Once your migration is complete and verified working on cPanel, run these commands to clean up temporary files and free up space on VPS.

---

## Step 1: Stop HTTP Server

```bash
ssh vps-2

# Stop the temporary download server
pkill -f "python3 -m http.server"
```

---

## Step 2: Remove Backup Files

```bash
# Remove all backup files (saves ~200-300MB)
rm -rf ~/backups/vegamovies-*

# Verify deleted
ls -lh ~/backups/
```

---

## Step 3: Remove Temporary Web Directory

```bash
# Remove temporary download directory
sudo rm -rf /var/www/html/temp-download
```

---

## Step 4: Clear Temporary Files

```bash
# Clear temp logs
rm -f /tmp/http.log /tmp/http-server.log /tmp/http-server.pid

# Clear other temp files
rm -f /tmp/*.py /tmp/fix*.sh /tmp/search.html
```

---

## Step 5: Clean Package Cache (Optional)

```bash
# Free up more space by cleaning package cache
sudo apt clean
sudo apt autoremove -y
```

---

## 🎯 All-in-One Cleanup Script

Save this as `cleanup.sh` and run after migration is confirmed working:

```bash
#!/bin/bash
echo "==================================="
echo "VPS Cleanup After Migration"
echo "==================================="
echo ""

# Stop HTTP server
echo "📛 Stopping HTTP server..."
pkill -f "python3 -m http.server"
sleep 2

# Remove backups
echo "🗑️  Removing backup files..."
rm -rf ~/backups/vegamovies-*

# Remove temp web directory
echo "🗑️  Removing temporary web directory..."
sudo rm -rf /var/www/html/temp-download

# Clear temp files
echo "🗑️  Clearing temporary files..."
rm -f /tmp/http*.log /tmp/http-server.pid
rm -f /tmp/*.py /tmp/fix*.sh /tmp/search.html /tmp/h*.php

# Clean package cache
echo "🧹 Cleaning package cache..."
sudo apt clean
sudo apt autoremove -y

# Show disk space freed
echo ""
echo "==================================="
echo "✅ Cleanup Complete!"
echo "==================================="
echo ""
echo "Disk usage in home directory:"
du -sh ~/backups/ ~/
echo ""
echo "Total disk space:"
df -h /
echo ""
echo "✅ VPS cleaned up successfully!"
```

Run it:
```bash
chmod +x cleanup.sh
./cleanup.sh
```

---

## ⚠️ IMPORTANT: Only Run After

- ✅ Migration is complete
- ✅ New site is working on cPanel
- ✅ All files uploaded successfully
- ✅ Database imported correctly
- ✅ Site tested and verified

---

## 📊 Expected Space Freed

- Backup files: ~200-300 MB
- Temp files: ~1-5 MB
- Package cache: ~50-100 MB

**Total: ~250-400 MB freed**

---

## 🔐 Keep VPS WordPress Site?

**Option 1: Keep Running (Recommended for now)**
- Keep site as backup
- Test new cPanel site first
- Delete after 7-14 days when confirmed stable

**Option 2: Remove WordPress (After Confirmed Working)**
```bash
# ⚠️ DANGER - Only run after migration is 100% confirmed!
sudo rm -rf /home/vegamovies/htdocs/vegamoviess.online/
```

**Option 3: Stop Services Only**
```bash
# Stop nginx to save resources
sudo systemctl stop nginx

# Stop PHP-FPM
sudo systemctl stop php*-fpm

# They won't start on reboot unless you enable them
```

---

## ✅ Quick Cleanup (After Download Finishes)

Run this NOW after your download completes:

```bash
ssh vps-2 "pkill -f 'python3 -m http.server' && rm -rf ~/backups/vegamovies-* && sudo rm -rf /var/www/html/temp-download && echo '✅ Cleanup done!'"
```

This removes:
- HTTP download server
- Backup files
- Temporary web directory

---

## 📞 Need Help?

If something goes wrong during migration:
- Don't delete VPS files yet!
- Keep backups until 100% confirmed working
- You can always re-download from VPS if needed

**Safety First: Keep VPS backup until new site is stable!** 🛡️
