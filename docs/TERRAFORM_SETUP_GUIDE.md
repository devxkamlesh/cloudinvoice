# CloudInvoice Terraform Infrastructure Setup Guide

Complete guide to managing your AWS infrastructure with Terraform.

## 📖 Table of Contents

1. [What This Does](#what-this-does)
2. [What Won't Change](#what-wont-change)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Detailed Walkthrough](#detailed-walkthrough)
6. [Post-Setup Tasks](#post-setup-tasks)
7. [Cost Breakdown](#cost-breakdown)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 What This Does

This Terraform configuration will:

### ✅ Create New Resources
- **Security Group**: Proper firewall rules (SSH, HTTP, HTTPS, port 3002)
- **Elastic IP**: Stable public IP (won't change after instance restarts)
- **AWS Backup**: Daily snapshots of your instance (7-day retention)
- **CloudWatch Alarms**: Email alerts for:
  - High CPU usage (>80%)
  - Low disk space (>85%)
  - High memory usage (>85%)
  - Status check failures
  - Unusual network traffic
- **SNS Topic**: Email notification system for alerts
- **Cost Budgets**: $50/month overall, $30/month for EC2
- **CloudWatch Logs**: Centralized application log storage

### 📊 Document Existing Resources
- EC2 instance (i-0dfce1d13140d6ac7)
- VPC (vpc-05ca98ea27243783f)
- Subnet (subnet-0faa463d0934dfbdf)
- Current security group (sg-0eccb27134bcc167a)

---

## ✅ What Won't Change

**Your running instance is 100% safe:**
- ✅ No downtime
- ✅ No data loss
- ✅ No service interruption
- ✅ CloudInvoice keeps running
- ✅ SSH access continues working
- ✅ Your August 7 launch is unaffected

---

## 📋 Prerequisites

### 1. Install Terraform

**Windows (Chocolatey)**:
```powershell
choco install terraform
```

**Windows (Manual)**:
1. Download from: https://www.terraform.io/downloads
2. Extract `terraform.exe` to `C:\Windows\System32\`
3. Verify: `terraform version`

### 2. Configure AWS CLI

Your AWS CLI is already installed. Now configure credentials:

```powershell
aws configure
```

You'll need:
- **AWS Access Key ID**: Get from AWS Console → IAM → Users → Your User → Security credentials → Create access key
- **AWS Secret Access Key**: Shown once when creating access key (save it!)
- **Default region**: `ap-southeast-1` (Singapore)
- **Default output format**: `json`

### 3. Verify AWS Access

```powershell
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDAXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

---

## 🚀 Quick Start

### Step 1: Navigate to Terraform Directory

```powershell
cd c:\Users\kamle\Desktop\startup\terraform
```

### Step 2: Run Setup Script

```powershell
.\setup.ps1
```

This script will:
1. ✅ Check if Terraform is installed
2. ✅ Check if AWS CLI is configured
3. ✅ Initialize Terraform
4. ✅ Validate configuration
5. ✅ Generate a plan showing what will be created

### Step 3: Review the Plan

Carefully read the output. You should see:
- **Resources to add**: ~15-20 (backups, alarms, security groups, etc.)
- **Resources to change**: 0
- **Resources to destroy**: 0

### Step 4: Apply the Configuration

```powershell
terraform apply tfplan
```

Type `yes` when prompted.

**Duration**: 2-3 minutes

### Step 5: Confirm Email Subscription

1. Check inbox: `account@cloudinvoice.co.in`
2. Look for email: "AWS Notification - Subscription Confirmation"
3. Click "Confirm subscription"
4. You'll now receive CloudWatch alarms

---

## 📖 Detailed Walkthrough

### Manual Setup (if you prefer step-by-step)

#### 1. Initialize Terraform

```powershell
cd c:\Users\kamle\Desktop\startup\terraform
terraform init
```

Expected output:
```
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...

Terraform has been successfully initialized!
```

#### 2. Format Configuration Files

```powershell
terraform fmt
```

This ensures all `.tf` files are properly formatted.

#### 3. Validate Configuration

```powershell
terraform validate
```

Expected output:
```
Success! The configuration is valid.
```

#### 4. Generate Execution Plan

```powershell
terraform plan -out=tfplan
```

This shows exactly what Terraform will create. Review it carefully.

Key sections to look for:
- `# aws_instance.cloudinvoice will be created` - **This should say "imported" not "created"**
- `# aws_security_group.cloudinvoice_app will be created` - ✅ Good
- `# aws_backup_plan.cloudinvoice will be created` - ✅ Good
- `# aws_cloudwatch_metric_alarm.cpu_high will be created` - ✅ Good

#### 5. Import Existing EC2 Instance

**CRITICAL**: Do this BEFORE applying to avoid recreating your instance:

```powershell
terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7
```

Expected output:
```
aws_instance.cloudinvoice: Importing from ID "i-0dfce1d13140d6ac7"...
aws_instance.cloudinvoice: Import prepared!
aws_instance.cloudinvoice: Import complete!
```

#### 6. Re-generate Plan

After importing, generate a new plan:

```powershell
terraform plan -out=tfplan
```

Now you should see:
- `# aws_instance.cloudinvoice will be updated in-place` - ✅ Perfect (not recreated)

#### 7. Apply Configuration

```powershell
terraform apply tfplan
```

Watch the output. You'll see:
```
aws_backup_vault.cloudinvoice: Creating...
aws_security_group.cloudinvoice_app: Creating...
aws_cloudwatch_metric_alarm.cpu_high: Creating...
...
Apply complete! Resources: 18 added, 1 changed, 0 destroyed.
```

#### 8. View Outputs

```powershell
terraform output
```

You'll see:
- Instance ID
- Public IP
- Elastic IP
- Security group ID
- Backup vault name
- SSH command
- And more...

---

## 📋 Post-Setup Tasks

### 1. Confirm SNS Email Subscription

Within 5 minutes of `terraform apply`:
1. Check email: `account@cloudinvoice.co.in`
2. Subject: "AWS Notification - Subscription Confirmation"
3. Click "Confirm subscription"
4. You'll see: "Subscription confirmed!"

**Without this, you won't receive CloudWatch alarms.**

### 2. Test Monitoring (Optional)

Trigger a test alarm to verify email notifications work:

```powershell
# SSH into instance
ssh vps-3

# Generate high CPU load for 10 minutes
stress --cpu 2 --timeout 600s

# Or install stress if not present:
sudo apt-get install stress -y
stress --cpu 2 --timeout 600s
```

Within 10 minutes, you should receive an email: "ALARM: cloudinvoice-high-cpu"

### 3. Migrate to New Security Group (Optional)

The new security group has better-organized rules. To switch:

1. **Get new security group ID**:
   ```powershell
   terraform output security_group_id
   ```

2. **Attach new security group**:
   ```powershell
   aws ec2 modify-instance-attribute `
     --instance-id i-0dfce1d13140d6ac7 `
     --groups <NEW_SECURITY_GROUP_ID> `
     --region ap-southeast-1
   ```

3. **Test SSH access**:
   ```powershell
   ssh vps-3 "echo 'Connection successful'"
   ```

4. **If successful, keep new security group. If not, revert**:
   ```powershell
   aws ec2 modify-instance-attribute `
     --instance-id i-0dfce1d13140d6ac7 `
     --groups sg-0eccb27134bcc167a `
     --region ap-southeast-1
   ```

### 4. Associate Elastic IP (Optional)

Elastic IP provides a stable public IP that won't change:

```powershell
# Get Elastic IP allocation ID
$eipAllocation = aws ec2 describe-addresses `
  --filters "Name=tag:Name,Values=cloudinvoice-eip" `
  --region ap-southeast-1 `
  --query 'Addresses[0].AllocationId' `
  --output text

# Associate with instance
aws ec2 associate-address `
  --instance-id i-0dfce1d13140d6ac7 `
  --allocation-id $eipAllocation `
  --region ap-southeast-1
```

**After this, update your DNS A record to point to the new Elastic IP.**

### 5. Install CloudWatch Agent (Optional but Recommended)

Enables memory and disk monitoring:

```bash
# SSH into instance
ssh vps-3

# Download CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Create configuration file
sudo tee /opt/aws/amazon-cloudwatch-agent/bin/config.json > /dev/null <<EOF
{
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collected": {
      "disk": {
        "measurement": [
          {"name": "used_percent", "rename": "disk_used_percent"}
        ],
        "metrics_collection_interval": 60,
        "resources": ["*"]
      },
      "mem": {
        "measurement": [
          {"name": "mem_used_percent"}
        ],
        "metrics_collection_interval": 60
      }
    }
  }
}
EOF

# Start CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
```

Verify it's running:
```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -m ec2 \
  -a query
```

Expected output: `"status": "running"`

---

## 💰 Cost Breakdown

### Current Monthly Costs

| Resource | Monthly Cost (USD) |
|----------|-------------------|
| **EC2 t3.small** (existing) | $15.20 |
| **30GB gp3 EBS** (existing) | $2.40 |
| **Data transfer** (5GB/month) | $0.45 |
| **Total (before Terraform)** | **$18.05** |

### Additional Costs After Terraform

| Resource | Monthly Cost (USD) |
|----------|-------------------|
| **Elastic IP** (attached) | $0.00 |
| **AWS Backup** (7 days retention) | $1.50 |
| **CloudWatch alarms** (5 alarms) | $0.50 |
| **CloudWatch Logs** (1GB/month) | $0.50 |
| **SNS notifications** (100 emails/month) | $0.05 |
| **Additional total** | **$2.55** |

### Total Monthly Cost

**Before**: $18.05/month  
**After**: $20.60/month  
**Increase**: $2.55/month (~14%)

### What You Get for $2.55/month

- ✅ Daily backups (7-day retention)
- ✅ Email alerts for system issues
- ✅ CloudWatch monitoring
- ✅ Cost budget tracking
- ✅ Auto-recovery on failures
- ✅ Stable Elastic IP

**Worth it?** Absolutely - the peace of mind alone is worth it.

---

## 🚨 Troubleshooting

### Error: "Invalid credentials"

**Problem**: AWS CLI not configured or credentials expired.

**Solution**:
```powershell
aws configure
# Re-enter your AWS Access Key ID and Secret Access Key
```

Verify:
```powershell
aws sts get-caller-identity
```

---

### Error: "Resource already exists"

**Problem**: Terraform trying to create a resource that already exists.

**Solution**: Import the existing resource before applying:
```powershell
# Example for EC2 instance
terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7
```

---

### Error: "Insufficient permissions"

**Problem**: Your IAM user lacks required permissions.

**Solution**: Your AWS user needs these IAM policies:
- `AmazonEC2FullAccess`
- `AmazonVPCReadOnlyAccess`
- `CloudWatchFullAccess`
- `AWSBackupFullAccess`
- `AWSBudgetsActionsWithAWSResourceControlAccess`
- `AmazonSNSFullAccess`

Ask your AWS account administrator to attach these policies.

---

### Error: "Timeout waiting for SSH"

**Problem**: Can't connect to instance during provisioning.

**Solution**: Check security group allows SSH from your IP:
```powershell
aws ec2 describe-security-groups `
  --group-ids sg-0eccb27134bcc167a `
  --region ap-southeast-1
```

---

### Terraform State is Out of Sync

**Problem**: Terraform state doesn't match actual AWS resources.

**Solution**: Refresh state from AWS:
```powershell
terraform refresh
```

Or re-import the resource:
```powershell
terraform state rm aws_instance.cloudinvoice
terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7
```

---

### Can't Receive CloudWatch Alarms

**Problem**: Email notifications not arriving.

**Checklist**:
1. ✅ Did you confirm the SNS subscription? (Check email)
2. ✅ Is the email in spam folder?
3. ✅ Is the alarm actually triggered?

Check alarm state:
```powershell
aws cloudwatch describe-alarms `
  --alarm-names cloudinvoice-high-cpu `
  --region ap-southeast-1
```

Manually trigger test alarm:
```powershell
aws cloudwatch set-alarm-state `
  --alarm-name cloudinvoice-high-cpu `
  --state-value ALARM `
  --state-reason "Testing notifications" `
  --region ap-southeast-1
```

---

### Terraform Plan Shows Unexpected Changes

**Problem**: `terraform plan` shows changes you didn't make.

**Common causes**:
1. AWS changed something automatically (e.g., security group rules)
2. Terraform configuration updated
3. State file out of sync

**Solution**: Review the diff carefully:
```powershell
terraform plan
```

If changes are expected, apply them:
```powershell
terraform apply
```

If changes are NOT expected, investigate before applying.

---

## 📚 Advanced Topics

### Remote State Storage (Recommended for Teams)

Store Terraform state in S3 instead of local file:

1. **Create S3 bucket**:
   ```powershell
   aws s3 mb s3://cloudinvoice-terraform-state --region ap-southeast-1
   ```

2. **Enable versioning**:
   ```powershell
   aws s3api put-bucket-versioning `
     --bucket cloudinvoice-terraform-state `
     --versioning-configuration Status=Enabled
   ```

3. **Create DynamoDB table for state locking**:
   ```powershell
   aws dynamodb create-table `
     --table-name terraform-state-lock `
     --attribute-definitions AttributeName=LockID,AttributeType=S `
     --key-schema AttributeName=LockID,KeyType=HASH `
     --billing-mode PAY_PER_REQUEST `
     --region ap-southeast-1
   ```

4. **Uncomment backend block in `main.tf`**:
   ```hcl
   backend "s3" {
     bucket = "cloudinvoice-terraform-state"
     key    = "production/terraform.tfstate"
     region = "ap-southeast-1"
     encrypt = true
     dynamodb_table = "terraform-state-lock"
   }
   ```

5. **Migrate state**:
   ```powershell
   terraform init -migrate-state
   ```

---

### Managing Multiple Environments

Create separate workspaces for dev/staging/production:

```powershell
# Create workspaces
terraform workspace new dev
terraform workspace new staging
terraform workspace new production

# Switch workspace
terraform workspace select production

# List workspaces
terraform workspace list
```

---

### CI/CD Integration

Automate Terraform with GitHub Actions:

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      
      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform
      
      - name: Terraform Plan
        run: terraform plan
        working-directory: ./terraform
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve
        working-directory: ./terraform
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## 🎓 Learning Resources

- **Terraform Docs**: https://developer.hashicorp.com/terraform/docs
- **AWS Provider Docs**: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
- **HashiCorp Learn**: https://learn.hashicorp.com/terraform
- **Terraform Best Practices**: https://www.terraform-best-practices.com/

---

## 🤝 Getting Help

1. **Check Terraform Docs**: Most errors are documented
2. **AWS CLI Debug**: Add `--debug` flag to AWS commands
3. **Terraform Debug**: Run with `TF_LOG=DEBUG terraform plan`
4. **Community Support**: https://discuss.hashicorp.com/c/terraform-core/27

---

## 📝 Maintenance Checklist

### Weekly
- [ ] Check CloudWatch alarms (any triggered?)
- [ ] Review backup success/failure
- [ ] Monitor cost budgets

### Monthly
- [ ] Review AWS bill
- [ ] Update Terraform to latest version
- [ ] Review security group rules
- [ ] Test backup restore process

### Quarterly
- [ ] Review instance size (is t3.small still enough?)
- [ ] Update AMI to latest Ubuntu LTS
- [ ] Review IAM permissions
- [ ] Test disaster recovery plan

---

**🎉 Congratulations!** Your infrastructure is now documented and managed with Terraform.

For questions or issues, contact: account@cloudinvoice.co.in
