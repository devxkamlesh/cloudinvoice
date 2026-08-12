# Terraform Quick Reference

## 🚀 Getting Started

```powershell
# Navigate to terraform directory
cd c:\Users\kamle\Desktop\startup\terraform

# Initialize (first time only)
terraform init

# Import existing EC2 instance (IMPORTANT - do this first!)
terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7

# See what will change
terraform plan

# Apply changes
terraform apply
```

## 📋 Daily Commands

```powershell
# Show current infrastructure
terraform show

# List all resources
terraform state list

# View outputs (IPs, IDs, etc.)
terraform output

# View specific output
terraform output instance_public_ip

# Refresh state from AWS
terraform refresh

# Format code
terraform fmt

# Validate configuration
terraform validate
```

## 🔍 Inspection Commands

```powershell
# Show details of a resource
terraform state show aws_instance.cloudinvoice

# Show dependency graph
terraform graph | dot -Tpng > graph.png

# Show all outputs in JSON
terraform output -json
```

## 🔧 Making Changes

```powershell
# Preview changes
terraform plan -out=tfplan

# Apply saved plan
terraform apply tfplan

# Apply with auto-approve (careful!)
terraform apply -auto-approve

# Target specific resource
terraform apply -target=aws_security_group.cloudinvoice_app

# Destroy specific resource
terraform destroy -target=aws_eip.cloudinvoice
```

## 🗑️ Removing Resources

```powershell
# Remove from Terraform management (doesn't delete in AWS)
terraform state rm aws_instance.cloudinvoice

# Destroy everything (DANGEROUS!)
terraform destroy

# Destroy specific resource
terraform destroy -target=aws_backup_plan.cloudinvoice
```

## 🔐 State Management

```powershell
# Backup state
cp terraform.tfstate terraform.tfstate.backup

# List resources in state
terraform state list

# Move resource in state
terraform state mv aws_instance.old aws_instance.new

# Remove resource from state
terraform state rm aws_eip.cloudinvoice

# Import existing resource
terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7
```

## 🐛 Debugging

```powershell
# Enable debug logging
$env:TF_LOG="DEBUG"
terraform plan

# Disable debug logging
$env:TF_LOG=""

# Show version
terraform version

# Check provider plugins
terraform providers

# Force unlock state (if locked)
terraform force-unlock <LOCK_ID>
```

## 📊 AWS-Specific Commands

```powershell
# Verify AWS credentials
aws sts get-caller-identity

# Check EC2 instance status
aws ec2 describe-instances `
  --instance-ids i-0dfce1d13140d6ac7 `
  --region ap-southeast-1

# List security groups
aws ec2 describe-security-groups --region ap-southeast-1

# Check CloudWatch alarms
aws cloudwatch describe-alarms --region ap-southeast-1

# List backups
aws backup list-recovery-points-by-backup-vault `
  --backup-vault-name cloudinvoice-backup-vault `
  --region ap-southeast-1
```

## 🔔 Monitoring

```powershell
# Test CloudWatch alarm
aws cloudwatch set-alarm-state `
  --alarm-name cloudinvoice-high-cpu `
  --state-value ALARM `
  --state-reason "Testing" `
  --region ap-southeast-1

# View alarm history
aws cloudwatch describe-alarm-history `
  --alarm-name cloudinvoice-high-cpu `
  --region ap-southeast-1

# Check SNS subscriptions
aws sns list-subscriptions --region ap-southeast-1
```

## 🏗️ Workspace Management

```powershell
# List workspaces
terraform workspace list

# Create workspace
terraform workspace new staging

# Switch workspace
terraform workspace select production

# Show current workspace
terraform workspace show

# Delete workspace
terraform workspace delete staging
```

## 💾 Backup & Recovery

```powershell
# Manually trigger backup
aws backup start-backup-job `
  --backup-vault-name cloudinvoice-backup-vault `
  --resource-arn arn:aws:ec2:ap-southeast-1:123456789012:instance/i-0dfce1d13140d6ac7 `
  --iam-role-arn <IAM_ROLE_ARN> `
  --region ap-southeast-1

# List available backups
aws backup list-recovery-points-by-backup-vault `
  --backup-vault-name cloudinvoice-backup-vault `
  --region ap-southeast-1
```

## 📈 Cost Monitoring

```powershell
# Check current month's cost
aws ce get-cost-and-usage `
  --time-period Start=2026-08-01,End=2026-08-31 `
  --granularity MONTHLY `
  --metrics UnblendedCost `
  --region us-east-1

# List budgets
aws budgets describe-budgets `
  --account-id <ACCOUNT_ID> `
  --region us-east-1
```

## 🚨 Emergency Commands

```powershell
# Rollback to previous state
cp terraform.tfstate.backup terraform.tfstate
terraform refresh

# Revert last apply
terraform state pull > backup.tfstate
# Edit main.tf to remove changes
terraform apply

# Stop receiving alarms (temporary)
aws sns unsubscribe `
  --subscription-arn <SUBSCRIPTION_ARN> `
  --region ap-southeast-1

# Disable backup plan (temporary)
aws backup stop-backup-job `
  --backup-job-id <JOB_ID> `
  --region ap-southeast-1
```

## 🔄 Update Workflow

```powershell
# 1. Pull latest changes
git pull

# 2. Review what changed
git diff HEAD~1 terraform/

# 3. Preview Terraform changes
terraform plan

# 4. Apply if safe
terraform apply

# 5. Verify outputs
terraform output

# 6. Check AWS Console
# Manually verify resources were created correctly
```

## 📝 Common Variables

```hcl
# In terraform.tfvars (create this file)
aws_region          = "ap-southeast-1"
instance_type       = "t3.small"
root_volume_size    = 30
allowed_ssh_cidrs   = ["YOUR_IP/32"]
enable_monitoring   = true
backup_retention_days = 7
```

## 🎯 Best Practices

```powershell
# Always run plan before apply
terraform plan -out=tfplan
# Review output carefully
terraform apply tfplan

# Keep state backup
cp terraform.tfstate terraform.tfstate.$(date +%Y%m%d)

# Use version control
git add terraform/
git commit -m "Update infrastructure"
git push

# Document changes
# Update README.md with any manual steps
```

## 🆘 Help Commands

```powershell
# Get help for any command
terraform -help
terraform plan -help
terraform apply -help

# Get help for AWS CLI
aws help
aws ec2 help
aws ec2 describe-instances help
```

---

## 📞 Quick Contacts

- **Terraform Docs**: https://www.terraform.io/docs
- **AWS CLI Docs**: https://docs.aws.amazon.com/cli/
- **Support**: account@cloudinvoice.co.in

---

## 🔗 Important Links

- Terraform State: `c:\Users\kamle\Desktop\startup\terraform\terraform.tfstate`
- AWS Console: https://ap-southeast-1.console.aws.amazon.com/
- CloudWatch Alarms: https://ap-southeast-1.console.aws.amazon.com/cloudwatch/
- AWS Backup: https://ap-southeast-1.console.aws.amazon.com/backup/
- EC2 Instances: https://ap-southeast-1.console.aws.amazon.com/ec2/

---

**💡 Pro Tip**: Bookmark this page for quick reference!
