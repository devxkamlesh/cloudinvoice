# CloudInvoice AWS Infrastructure - Terraform

Infrastructure as Code (IaC) for managing CloudInvoice production environment on AWS.

## 📋 Overview

This Terraform configuration documents and manages:
- **EC2 Instance**: t3.small running Ubuntu 26.04 in ap-southeast-1
- **Security Groups**: SSH, HTTP, HTTPS access control
- **Backups**: Daily AWS Backup with 7-day retention
- **Monitoring**: CloudWatch alarms for CPU, memory, disk, status checks
- **Cost Management**: Monthly budgets with email alerts

## 🏗️ Infrastructure Details

| Resource | Value |
|----------|-------|
| **Region** | ap-southeast-1 (Singapore) |
| **Instance ID** | i-0dfce1d13140d6ac7 |
| **Instance Type** | t3.small (2 vCPU, 2GB RAM) |
| **AMI** | ami-0532913178263be11 (Ubuntu 26.04) |
| **VPC** | vpc-05ca98ea27243783f |
| **Subnet** | subnet-0faa463d0934dfbdf |
| **Storage** | 30GB gp3 EBS volume |
| **Public IP** | 54.151.245.180 |

## 🚀 Quick Start

### Prerequisites

1. **Install Terraform**:
   ```powershell
   # Windows (using Chocolatey)
   choco install terraform
   
   # Or download from: https://www.terraform.io/downloads
   ```

2. **Configure AWS CLI**:
   ```powershell
   # Install AWS CLI v2 (already installed on your system)
   aws --version
   
   # Configure credentials
   aws configure
   # AWS Access Key ID: [Your Access Key]
   # AWS Secret Access Key: [Your Secret Key]
   # Default region: ap-southeast-1
   # Default output format: json
   ```

3. **Verify AWS Access**:
   ```powershell
   aws sts get-caller-identity
   ```

### Initial Setup

1. **Navigate to Terraform directory**:
   ```powershell
   cd c:\Users\kamle\Desktop\startup\terraform
   ```

2. **Initialize Terraform**:
   ```powershell
   terraform init
   ```

3. **Review the plan** (see what Terraform will create):
   ```powershell
   terraform plan
   ```

4. **Import existing resources** (IMPORTANT - do this before apply):
   ```powershell
   # Import the existing EC2 instance
   terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7
   
   # Import existing VPC (already using data source, no import needed)
   # Import existing subnet (already using data source, no import needed)
   # Import existing security group (already using data source, no import needed)
   ```

5. **Apply the configuration** (create new resources):
   ```powershell
   terraform apply
   ```
   - Review the changes carefully
   - Type `yes` to confirm
   - This will NOT recreate your existing EC2 instance
   - It WILL create: security groups, backups, monitoring, budgets

## ⚠️ Important Notes

### What Will Change

After running `terraform apply`, these NEW resources will be created:
- ✅ New security group (you'll need to attach it to the instance manually)
- ✅ Elastic IP (optional - provides stable public IP)
- ✅ AWS Backup plan (daily snapshots)
- ✅ CloudWatch alarms (CPU, disk, memory, status checks)
- ✅ SNS topic for email alerts
- ✅ Cost budgets ($50/month total, $30/month EC2)

### What Will NOT Change

These existing resources are safe:
- ✅ Your EC2 instance keeps running (no downtime)
- ✅ Your data stays intact
- ✅ Your current security group remains active
- ✅ Your SSH access continues working

### Security Group Migration

After creating the new security group:

1. **Check current security group rules**:
   ```powershell
   aws ec2 describe-security-groups --group-ids sg-0eccb27134bcc167a --region ap-southeast-1
   ```

2. **Attach new security group to instance**:
   ```powershell
   aws ec2 modify-instance-attribute \
     --instance-id i-0dfce1d13140d6ac7 \
     --groups sg-xxxxx \
     --region ap-southeast-1
   ```
   Replace `sg-xxxxx` with the new security group ID from `terraform apply` output.

3. **Test SSH access** before removing old security group:
   ```powershell
   ssh vps-3 "echo 'Connection successful'"
   ```

## 📊 Managing Infrastructure

### View Current State

```powershell
# Show all resources managed by Terraform
terraform state list

# Show details of specific resource
terraform state show aws_instance.cloudinvoice

# View outputs
terraform output
```

### Make Changes

1. Edit the `.tf` files
2. Preview changes: `terraform plan`
3. Apply changes: `terraform apply`

### Common Operations

```powershell
# Format Terraform files
terraform fmt

# Validate configuration
terraform validate

# Show current state
terraform show

# Refresh state (sync with AWS)
terraform refresh
```

## 💰 Cost Estimates

| Resource | Monthly Cost (USD) |
|----------|-------------------|
| t3.small instance | ~$15.20 |
| 30GB gp3 EBS | ~$2.40 |
| Data transfer (5GB/month) | ~$0.45 |
| Elastic IP (attached) | $0.00 |
| AWS Backup (daily) | ~$1.50 |
| CloudWatch (basic) | ~$1.00 |
| **Total** | **~$20.55/month** |

*Actual costs may vary based on usage, data transfer, and backup size.*

## 🔐 Security Best Practices

1. **Restrict SSH access** (update `variables.tf`):
   ```hcl
   variable "allowed_ssh_cidrs" {
     default = ["YOUR_IP/32"] # Replace with your actual IP
   }
   ```

2. **Enable IMDSv2** (already configured):
   - Metadata service requires session tokens
   - Prevents SSRF attacks

3. **Enable termination protection** (already configured):
   - Instance cannot be accidentally terminated via API/console

4. **Encrypted EBS volumes** (already configured):
   - Root volume encrypted at rest

## 📧 Email Notifications

After `terraform apply`, confirm your email subscription:

1. Check inbox for: `account@cloudinvoice.co.in`
2. Click "Confirm subscription" in the AWS SNS email
3. You'll receive alerts for:
   - High CPU usage (>80%)
   - Low disk space (>85%)
   - High memory usage (>85%)
   - Status check failures
   - Budget alerts (80% actual, 100% forecast)

## 🔄 Backups

Automatic daily backups are configured:
- **Schedule**: 3:00 AM UTC (8:30 AM IST)
- **Retention**: 7 days
- **Vault**: `cloudinvoice-backup-vault`

### Restore from Backup

```powershell
# List available backups
aws backup list-recovery-points-by-backup-vault \
  --backup-vault-name cloudinvoice-backup-vault \
  --region ap-southeast-1

# Restore via AWS Console:
# AWS Backup > Backup vaults > cloudinvoice-backup-vault > Recovery points > Restore
```

## 🔍 Monitoring

CloudWatch dashboards (create manually or via Terraform):
- CPU utilization
- Memory usage (requires CloudWatch agent)
- Disk usage (requires CloudWatch agent)
- Network traffic
- Status checks

### Install CloudWatch Agent (Optional)

```bash
# SSH into instance
ssh vps-3

# Download CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure agent (interactive)
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Start agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
```

## 🚨 Troubleshooting

### "Error: Invalid credentials"

```powershell
# Reconfigure AWS CLI
aws configure

# Verify credentials
aws sts get-caller-identity
```

### "Error: Resource already exists"

```powershell
# Import existing resource before apply
terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7
```

### "Error: Insufficient permissions"

Ensure your IAM user/role has these permissions:
- EC2 full access
- VPC read access
- CloudWatch full access
- AWS Backup full access
- Budgets full access
- SNS full access

### Terraform state issues

```powershell
# Remove resource from state (doesn't delete actual resource)
terraform state rm aws_instance.cloudinvoice

# Re-import
terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7
```

## 📚 Next Steps

1. **Enable remote state** (recommended for team collaboration):
   - Create S3 bucket for state storage
   - Enable state locking with DynamoDB
   - Uncomment `backend "s3"` block in `main.tf`

2. **Add SSL/TLS certificate**:
   - Request certificate via AWS Certificate Manager
   - Attach to Application Load Balancer

3. **Set up nginx reverse proxy** (already configured in deploy/nginx/):
   - Move app to 127.0.0.1:3002
   - Configure nginx to handle HTTPS
   - Remove port 3002 from security group

4. **Add RDS for PostgreSQL** (optional):
   - Migrate from containerized PostgreSQL
   - Better backups and scaling

5. **CI/CD pipeline**:
   - GitHub Actions to auto-deploy on push
   - Terraform Cloud for automated infrastructure changes

## 🤝 Contributing

When making infrastructure changes:
1. Create a new branch
2. Test with `terraform plan`
3. Submit PR with plan output
4. Apply after approval

## 📄 License

Internal use only - CloudInvoice Team

---

**Questions?** Contact: account@cloudinvoice.co.in
