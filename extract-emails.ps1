# Email Extraction Script
# Educational Purpose Only

param(
    [Parameter(Mandatory=$true)]
    [string]$url
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Email Address Extractor" -ForegroundColor Cyan
Write-Host "  Educational Purpose Only" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Clean URL
if ($url -notmatch '^https?://') {
    $url = "https://$url"
}

Write-Host "Scanning: $url" -ForegroundColor Yellow
Write-Host ""

# Fetch the website
Write-Host "[1] Fetching website content..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 15 -UseBasicParsing -ErrorAction Stop
    $html = $response.Content
    Write-Host "  [+] Content retrieved successfully" -ForegroundColor Green
    Write-Host "  Size: $($html.Length) bytes" -ForegroundColor Cyan
} catch {
    Write-Host "  [!] Failed to retrieve content: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Extract email addresses
Write-Host "[2] Extracting email addresses..." -ForegroundColor Green

# Email regex pattern
$emailPattern = '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

$emails = [regex]::Matches($html, $emailPattern) | ForEach-Object { $_.Value } | Select-Object -Unique | Sort-Object

if ($emails.Count -gt 0) {
    Write-Host "  [+] Found $($emails.Count) unique email address(es):" -ForegroundColor Green
    Write-Host ""
    
    foreach ($email in $emails) {
        Write-Host "    • $email" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [-] No email addresses found in HTML" -ForegroundColor Gray
}
Write-Host ""

# Look for contact page
Write-Host "[3] Checking for contact pages..." -ForegroundColor Green

$contactUrls = @(
    "/contact",
    "/contact-us",
    "/contactus",
    "/?do=feedback",
    "/about",
    "/about-us"
)

$foundContactPages = @()

foreach ($contactUrl in $contactUrls) {
    $testUrl = $url.TrimEnd('/') + $contactUrl
    try {
        $test = Invoke-WebRequest -Uri $testUrl -Method Head -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($test.StatusCode -eq 200) {
            Write-Host "  [+] Contact page found: $contactUrl" -ForegroundColor Green
            $foundContactPages += $testUrl
        }
    } catch {
        # Page not found, continue
    }
}

if ($foundContactPages.Count -eq 0) {
    Write-Host "  [-] No standard contact pages found" -ForegroundColor Gray
}
Write-Host ""

# Check for social media links
Write-Host "[4] Looking for social media links..." -ForegroundColor Green

$socialPatterns = @{
    'Facebook' = 'facebook\.com/[a-zA-Z0-9._-]+'
    'Twitter/X' = 'twitter\.com/[a-zA-Z0-9._-]+'
    'Instagram' = 'instagram\.com/[a-zA-Z0-9._-]+'
    'Telegram' = 't\.me/[a-zA-Z0-9._-]+'
    'YouTube' = 'youtube\.com/(c/|channel/|user/)?[a-zA-Z0-9._-]+'
}

$foundSocial = $false

foreach ($platform in $socialPatterns.Keys) {
    $pattern = $socialPatterns[$platform]
    $matches = [regex]::Matches($html, $pattern) | ForEach-Object { $_.Value } | Select-Object -Unique
    
    if ($matches.Count -gt 0) {
        $foundSocial = $true
        Write-Host "  [+] $platform found:" -ForegroundColor Green
        foreach ($match in $matches) {
            Write-Host "      https://$match" -ForegroundColor Cyan
        }
    }
}

if (-not $foundSocial) {
    Write-Host "  [-] No social media links found" -ForegroundColor Gray
}
Write-Host ""

# Check for newsletter signup
Write-Host "[5] Checking for newsletter/subscription..." -ForegroundColor Green

$newsletterPatterns = @(
    'newsletter',
    'subscribe',
    'subscription',
    'email.*updates',
    'mailing.*list'
)

$foundNewsletter = $false

foreach ($pattern in $newsletterPatterns) {
    if ($html -match $pattern) {
        $foundNewsletter = $true
        Write-Host "  [+] Found reference to: $pattern" -ForegroundColor Yellow
    }
}

if (-not $foundNewsletter) {
    Write-Host "  [-] No newsletter signup detected" -ForegroundColor Gray
}
Write-Host ""

# Look for mailto links
Write-Host "[6] Searching for mailto links..." -ForegroundColor Green

$mailtoPattern = 'mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})'
$mailtoLinks = [regex]::Matches($html, $mailtoPattern) | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

if ($mailtoLinks.Count -gt 0) {
    Write-Host "  [+] Found $($mailtoLinks.Count) mailto link(s):" -ForegroundColor Green
    foreach ($mailto in $mailtoLinks) {
        Write-Host "    • $mailto" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [-] No mailto links found" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($emails.Count -gt 0 -or $mailtoLinks.Count -gt 0 -or $foundContactPages.Count -gt 0 -or $foundSocial) {
    Write-Host "Contact Information Found:" -ForegroundColor Green
    Write-Host ""
    
    if ($emails.Count -gt 0) {
        Write-Host "Email Addresses: $($emails.Count)" -ForegroundColor Yellow
        foreach ($e in $emails) {
            Write-Host "  • $e" -ForegroundColor Cyan
        }
        Write-Host ""
    }
    
    if ($foundContactPages.Count -gt 0) {
        Write-Host "Contact Pages: $($foundContactPages.Count)" -ForegroundColor Yellow
        foreach ($page in $foundContactPages) {
            Write-Host "  • $page" -ForegroundColor Cyan
        }
        Write-Host ""
    }
    
    if ($foundSocial) {
        Write-Host "Social Media: Found (see above)" -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host "No contact information found." -ForegroundColor Gray
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor White
    Write-Host "  • Contact info loaded via JavaScript" -ForegroundColor Cyan
    Write-Host "  • Email addresses obfuscated" -ForegroundColor Cyan
    Write-Host "  • Using contact forms instead of direct email" -ForegroundColor Cyan
    Write-Host "  • Content protected by Cloudflare" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Export to file
if ($emails.Count -gt 0) {
    $outputFile = "extracted_emails.txt"
    $emails | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host "Email addresses saved to: $outputFile" -ForegroundColor Green
    Write-Host ""
}
