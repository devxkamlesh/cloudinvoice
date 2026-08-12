# CMS Detection Script - Educational Purpose Only
param(
    [Parameter(Mandatory=$true)]
    [string]$url
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  CMS Detection Tool" -ForegroundColor Cyan
Write-Host "  Educational Purpose Only" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Clean URL
if ($url -notmatch '^https?://') {
    $url = "https://$url"
}

Write-Host "Analyzing: $url" -ForegroundColor Yellow
Write-Host ""

# Check HTTP Headers
Write-Host "[1] Checking HTTP Headers..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -ErrorAction Stop
    
    if ($response.Headers['X-Powered-By']) {
        Write-Host "  X-Powered-By: $($response.Headers['X-Powered-By'])" -ForegroundColor Cyan
    }
    
    if ($response.Headers['Server']) {
        Write-Host "  Server: $($response.Headers['Server'])" -ForegroundColor Cyan
    }
    
    Write-Host "  Status: Success" -ForegroundColor Green
} catch {
    Write-Host "  Status: Failed - $_" -ForegroundColor Red
}
Write-Host ""

# Check Common CMS Paths
Write-Host "[2] Checking Common CMS Paths..." -ForegroundColor Green

$cmsChecks = @(
    @{ Name = 'WordPress'; Paths = @('/wp-admin/', '/wp-login.php', '/wp-json/') },
    @{ Name = 'Joomla'; Paths = @('/administrator/', '/components/') },
    @{ Name = 'Drupal'; Paths = @('/user/login', '/core/') }
)

foreach ($cms in $cmsChecks) {
    $detected = $false
    foreach ($path in $cms.Paths) {
        $testUrl = $url.TrimEnd('/') + $path
        try {
            $test = Invoke-WebRequest -Uri $testUrl -Method Head -TimeoutSec 3 -ErrorAction Stop
            if ($test.StatusCode -eq 200) {
                Write-Host "  [+] $($cms.Name) detected! ($path exists)" -ForegroundColor Yellow
                $detected = $true
                break
            }
        } catch {
            # Continue to next path
        }
    }
    if (-not $detected) {
        Write-Host "  [-] $($cms.Name) not detected" -ForegroundColor Gray
    }
}
Write-Host ""

# Analyze HTML Content
Write-Host "[3] Analyzing HTML Content..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -ErrorAction Stop
    $html = $response.Content
    
    $signatures = @{
        'WordPress' = 'wp-content'
        'Joomla' = 'Joomla!'
        'Drupal' = 'Drupal'
        'Wix' = 'wixstatic.com'
    }
    
    foreach ($cms in $signatures.Keys) {
        if ($html -match $signatures[$cms]) {
            Write-Host "  [+] $cms signature found in HTML" -ForegroundColor Yellow
        } else {
            Write-Host "  [-] $cms not detected" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  Failed to analyze HTML" -ForegroundColor Red
}
Write-Host ""

# Check robots.txt
Write-Host "[4] Checking robots.txt..." -ForegroundColor Green
$robotsUrl = $url.TrimEnd('/') + '/robots.txt'
try {
    $robots = Invoke-WebRequest -Uri $robotsUrl -TimeoutSec 5 -ErrorAction Stop
    if ($robots.Content -match 'wp-admin') {
        Write-Host "  [+] WordPress paths in robots.txt" -ForegroundColor Yellow
    } elseif ($robots.Content -match 'administrator') {
        Write-Host "  [+] Joomla paths in robots.txt" -ForegroundColor Yellow
    } else {
        Write-Host "  [-] No clear CMS indicators" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  [-] robots.txt not accessible" -ForegroundColor Gray
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Analysis Complete" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed analysis, try:" -ForegroundColor White
Write-Host "  - WhatCMS.org" -ForegroundColor Cyan
Write-Host "  - BuiltWith.com" -ForegroundColor Cyan
Write-Host "  - Wappalyzer extension" -ForegroundColor Cyan
