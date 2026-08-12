# AWS Backup configuration for CloudInvoice
# Automated daily snapshots of EC2 instance and EBS volumes

# Backup vault for storing backups
resource "aws_backup_vault" "cloudinvoice" {
  name = "${var.project_name}-backup-vault"

  tags = {
    Name = "${var.project_name}-backups"
  }
}

# IAM role for AWS Backup service
resource "aws_iam_role" "backup" {
  name = "${var.project_name}-backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })
}

# Attach AWS managed backup policy
resource "aws_iam_role_policy_attachment" "backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_iam_role_policy_attachment" "restore" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
}

# Backup plan: Daily snapshots with 7-day retention
resource "aws_backup_plan" "cloudinvoice" {
  name = "${var.project_name}-daily-backup"

  rule {
    rule_name         = "daily_backup"
    target_vault_name = aws_backup_vault.cloudinvoice.name
    schedule          = "cron(0 3 * * ? *)" # 3 AM UTC daily (8:30 AM IST)

    lifecycle {
      delete_after = var.backup_retention_days
    }

    # Enable continuous backup (point-in-time restore)
    enable_continuous_backup = false # Keep false for cost savings
  }
}

# Backup selection: Include CloudInvoice EC2 instance
resource "aws_backup_selection" "cloudinvoice" {
  name         = "${var.project_name}-backup-selection"
  plan_id      = aws_backup_plan.cloudinvoice.id
  iam_role_arn = aws_iam_role.backup.arn

  resources = [
    aws_instance.cloudinvoice.arn
  ]
}
