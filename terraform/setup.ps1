# CloudInvoice Terraform Setup Script
# This script guides you through the initial Terraform setup

Write-Host "🚀 CloudInvoice Terraform Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Terraform is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$terraformInstalled = Get-Command terraform -ErrorAction SilentlyContinue

if (-not $terraformInstalled) {
    Write-Host "❌ Terraform not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Terraform:" -ForegroundColor Yellow
    Write-Host "  1. Using Chocolatey: choco install terraform" -ForegroundColor White
    Write-Host "  2. Or download from: https://www.terraform.io/downloads" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Terraform installed: $(terraform version | Select-Object -First 1)" -ForegroundColor Green

# Check AWS CLI
$awsInstalled = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsInstalled) {
    Write-Host "❌ AWS CLI not installed" -ForegroundColor Red
    Write-Host "Please install AWS CLI v2 from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ AWS CLI installed: $(aws --version)" -ForegroundColor Green
Write-Host ""

# Check AWS credentials
Write-Host "Checking AWS credentials..." -ForegroundColor Yellow
$awsIdentity = aws sts get-caller-identity 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS credentials not configured" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please configure AWS CLI:" -ForegroundColor Yellow
    Write-Host "  aws configure" -ForegroundColor White
    Write-Host ""
    Write-Host "You'll need:" -ForegroundColor Yellow
    Write-Host "  - AWS Access Key ID" -ForegroundColor White
    Write-Host "  - AWS Secret Access Key" -ForegroundColor White
    Write-Host "  - Default region: ap-southeast-1" -ForegroundColor White
    Write-Host ""
    exit 1
}

$awsAccountInfo = $awsIdentity | ConvertFrom-Json
Write-Host "✅ AWS credentials configured" -ForegroundColor Green
Write-Host "   Account: $($awsAccountInfo.Account)" -ForegroundColor Gray
Write-Host "   User: $($awsAccountInfo.Arn)" -ForegroundColor Gray
Write-Host ""

# Initialize Terraform
Write-Host "Initializing Terraform..." -ForegroundColor Yellow
terraform init

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform initialization failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Terraform initialized" -ForegroundColor Green
Write-Host ""

# Validate configuration
Write-Host "Validating Terraform configuration..." -ForegroundColor Yellow
terraform validate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform validation failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Configuration valid" -ForegroundColor Green
Write-Host ""

# Show plan
Write-Host "Generating Terraform plan..." -ForegroundColor Yellow
Write-Host "(This shows what resources will be created)" -ForegroundColor Gray
Write-Host ""
terraform plan -out=tfplan

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform plan failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Review the plan above carefully" -ForegroundColor White
Write-Host "2. If everything looks good, apply the changes:" -ForegroundColor White
Write-Host "   terraform apply tfplan" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. After apply, confirm your email subscription:" -ForegroundColor White
Write-Host "   Check account@cloudinvoice.co.in for SNS confirmation" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Import your existing EC2 instance:" -ForegroundColor White
Write-Host "   terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: This will NOT affect your running instance" -ForegroundColor Yellow
Write-Host "   It only creates new monitoring, backups, and security resources" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see: terraform\README.md" -ForegroundColor Cyan
Write-Host ""
