# DataLife Engine (DLE) Detection Script
# Educational Purpose Only

param(
    [Parameter(Mandatory=$true)]
    [string]$url
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  DataLife Engine (DLE) Detector" -ForegroundColor Cyan
Write-Host "  Educational Analysis Tool" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Clean URL
if ($url -notmatch '^https?://') {
    $url = "https://$url"
}

$baseUrl = $url.TrimEnd('/')

Write-Host "Target: $url" -ForegroundColor Yellow
Write-Host ""

# Detection score
$dleScore = 0
$wpScore = 0
$totalChecks = 0

# Function to test URL
function Test-URL {
    param($testUrl, $description)
    
    try {
        $response = Invoke-WebRequest -Uri $testUrl -Method Head -TimeoutSec 5 -ErrorAction Stop -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "  [+] $description" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "  [-] $description" -ForegroundColor Gray
    }
    return $false
}

# Check 1: DLE-specific paths
Write-Host "[1] Checking DLE-Specific Paths..." -ForegroundColor Cyan
$totalChecks++

$dlePaths = @(
    @{Path="/engine/"; Desc="DLE engine directory"},
    @{Path="/templates/"; Desc="DLE templates directory"},
    @{Path="/?do=register"; Desc="DLE registration URL"},
    @{Path="/?do=lastcomments"; Desc="DLE last comments"},
    @{Path="/index.php?do=feedback"; Desc="DLE feedback form"}
)

$dlePathsFound = 0
foreach ($item in $dlePaths) {
    if (Test-URL "$baseUrl$($item.Path)" $item.Desc) {
        $dlePathsFound++
    }
}

if ($dlePathsFound -gt 0) {
    $dleScore += $dlePathsFound
    Write-Host "  DLE paths found: $dlePathsFound/5" -ForegroundColor Yellow
}
Write-Host ""

# Check 2: WordPress-specific paths
Write-Host "[2] Checking WordPress-Specific Paths..." -ForegroundColor Cyan
$totalChecks++

$wpPaths = @(
    @{Path="/wp-admin/"; Desc="WP admin panel"},
    @{Path="/wp-login.php"; Desc="WP login page"},
    @{Path="/wp-json/"; Desc="WP REST API"},
    @{Path="/wp-content/"; Desc="WP content directory"}
)

$wpPathsFound = 0
foreach ($item in $wpPaths) {
    if (Test-URL "$baseUrl$($item.Path)" $item.Desc) {
        $wpPathsFound++
    }
}

if ($wpPathsFound -gt 0) {
    $wpScore += $wpPathsFound
    Write-Host "  WordPress paths found: $wpPathsFound/4" -ForegroundColor Yellow
}
Write-Host ""

# Check 3: HTML Content Analysis
Write-Host "[3] Analyzing HTML Content..." -ForegroundColor Cyan
$totalChecks++

try {
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    $html = $response.Content
    
    # DLE signatures
    $dleSignatures = @(
        'DataLife Engine',
        'DLE',
        '/engine/',
        'dle_',
        'dle-ajax'
    )
    
    $dleFound = 0
    foreach ($sig in $dleSignatures) {
        if ($html -match [regex]::Escape($sig)) {
            Write-Host "  [+] DLE signature found: $sig" -ForegroundColor Green
            $dleFound++
            $dleScore += 2
        }
    }
    
    if ($dleFound -eq 0) {
        Write-Host "  [-] No DLE signatures in HTML" -ForegroundColor Gray
    }
    
    # WordPress signatures
    $wpSignatures = @(
        'wp-content',
        'wp-includes',
        'wordpress',
        'wp-json'
    )
    
    $wpFound = 0
    foreach ($sig in $wpSignatures) {
        if ($html -match [regex]::Escape($sig)) {
            Write-Host "  [+] WordPress signature found: $sig" -ForegroundColor Yellow
            $wpFound++
            $wpScore += 2
        }
    }
    
    if ($wpFound -eq 0) {
        Write-Host "  [-] No WordPress signatures in HTML" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "  [!] Could not retrieve HTML content" -ForegroundColor Red
}
Write-Host ""

# Check 4: Cookies Analysis
Write-Host "[4] Checking Cookies..." -ForegroundColor Cyan
$totalChecks++

try {
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    
    if ($response.Headers['Set-Cookie']) {
        $cookies = $response.Headers['Set-Cookie'] -join ' '
        
        # DLE cookies
        if ($cookies -match 'dle_') {
            Write-Host "  [+] DLE cookie detected!" -ForegroundColor Green
            $dleScore += 3
        } else {
            Write-Host "  [-] No DLE cookies" -ForegroundColor Gray
        }
        
        # WordPress cookies
        if ($cookies -match 'wordpress') {
            Write-Host "  [+] WordPress cookie detected!" -ForegroundColor Yellow
            $wpScore += 3
        } else {
            Write-Host "  [-] No WordPress cookies" -ForegroundColor Gray
        }
        
        # Generic PHP
        if ($cookies -match 'PHPSESSID') {
            Write-Host "  [i] PHP session detected (both use PHP)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  [-] No cookies found" -ForegroundColor Gray
    }
} catch {
    Write-Host "  [!] Could not check cookies" -ForegroundColor Red
}
Write-Host ""

# Check 5: Server Headers
Write-Host "[5] Analyzing Server Headers..." -ForegroundColor Cyan
$totalChecks++

try {
    $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    
    if ($response.Headers['Server']) {
        Write-Host "  Server: $($response.Headers['Server'])" -ForegroundColor Cyan
    }
    
    if ($response.Headers['X-Powered-By']) {
        Write-Host "  X-Powered-By: $($response.Headers['X-Powered-By'])" -ForegroundColor Cyan
    }
    
    # Check for specific headers
    $headers = $response.Headers
    $headerStr = ($headers.Keys | ForEach-Object { "$_=$($headers[$_])" }) -join ' '
    
    if ($headerStr -match 'DataLife|DLE') {
        Write-Host "  [+] DLE detected in headers!" -ForegroundColor Green
        $dleScore += 3
    } elseif ($headerStr -match 'WordPress|wp-') {
        Write-Host "  [+] WordPress detected in headers!" -ForegroundColor Yellow
        $wpScore += 3
    } else {
        Write-Host "  [-] No clear CMS indicators in headers" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "  [!] Could not retrieve headers" -ForegroundColor Red
}
Write-Host ""

# Check 6: robots.txt
Write-Host "[6] Analyzing robots.txt..." -ForegroundColor Cyan

try {
    $robotsUrl = "$baseUrl/robots.txt"
    $robots = Invoke-WebRequest -Uri $robotsUrl -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    $robotsContent = $robots.Content
    
    if ($robotsContent -match '/engine/') {
        Write-Host "  [+] DLE paths in robots.txt (/engine/)" -ForegroundColor Green
        $dleScore += 2
    }
    
    if ($robotsContent -match '/templates/') {
        Write-Host "  [+] DLE paths in robots.txt (/templates/)" -ForegroundColor Green
        $dleScore += 1
    }
    
    if ($robotsContent -match 'wp-admin|wp-includes|wp-content') {
        Write-Host "  [+] WordPress paths in robots.txt" -ForegroundColor Yellow
        $wpScore += 2
    }
    
    if ($dleScore -eq 0 -and $wpScore -eq 0) {
        Write-Host "  [-] No CMS indicators in robots.txt" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "  [-] robots.txt not found or not accessible" -ForegroundColor Gray
}
Write-Host ""

# Calculate Results
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  DETECTION RESULTS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Detection Scores:" -ForegroundColor White
Write-Host "  DataLife Engine (DLE): $dleScore points" -ForegroundColor $(if($dleScore -gt $wpScore){"Green"}else{"Yellow"})
Write-Host "  WordPress:             $wpScore points" -ForegroundColor $(if($wpScore -gt $dleScore){"Green"}else{"Yellow"})
Write-Host ""

# Determine winner
if ($dleScore -gt $wpScore) {
    $confidence = [math]::Min(90, 50 + ($dleScore * 5))
    Write-Host "VERDICT: DataLife Engine (DLE)" -ForegroundColor Green
    Write-Host "Confidence: $confidence%" -ForegroundColor Green
    Write-Host ""
    Write-Host "Reasoning:" -ForegroundColor White
    Write-Host "  - DLE signatures detected in multiple checks" -ForegroundColor Cyan
    Write-Host "  - Common for movie/media download sites" -ForegroundColor Cyan
    Write-Host "  - Lightweight and fast CMS" -ForegroundColor Cyan
} elseif ($wpScore -gt $dleScore) {
    $confidence = [math]::Min(90, 50 + ($wpScore * 5))
    Write-Host "VERDICT: WordPress" -ForegroundColor Yellow
    Write-Host "Confidence: $confidence%" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Reasoning:" -ForegroundColor White
    Write-Host "  - WordPress signatures detected" -ForegroundColor Cyan
    Write-Host "  - Most popular CMS platform" -ForegroundColor Cyan
    Write-Host "  - Extensive plugin ecosystem" -ForegroundColor Cyan
} else {
    Write-Host "VERDICT: Unknown or Hidden CMS" -ForegroundColor Gray
    Write-Host "Confidence: Low" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Reasoning:" -ForegroundColor White
    Write-Host "  - CMS signatures are hidden or obfuscated" -ForegroundColor Cyan
    Write-Host "  - Could be DLE, WordPress, or custom solution" -ForegroundColor Cyan
    Write-Host "  - Security through obscurity implemented" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "  1. Use browser DevTools (F12) for manual inspection" -ForegroundColor Cyan
Write-Host "  2. Try online tools: WhatCMS.org, BuiltWith.com" -ForegroundColor Cyan
Write-Host "  3. Install Wappalyzer browser extension" -ForegroundColor Cyan
Write-Host "  4. Check HTML source code manually" -ForegroundColor Cyan
Write-Host ""
