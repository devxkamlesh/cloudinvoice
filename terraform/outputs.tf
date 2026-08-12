# Terraform outputs for CloudInvoice infrastructure

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.cloudinvoice.id
}

output "instance_public_ip" {
  description = "Public IP address of the instance"
  value       = aws_instance.cloudinvoice.public_ip
}

output "instance_private_ip" {
  description = "Private IP address of the instance"
  value       = aws_instance.cloudinvoice.private_ip
}

output "elastic_ip" {
  description = "Elastic IP address (if allocated)"
  value       = aws_eip.cloudinvoice.public_ip
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.cloudinvoice_app.id
}

output "vpc_id" {
  description = "VPC ID"
  value       = data.aws_vpc.existing.id
}

output "subnet_id" {
  description = "Subnet ID"
  value       = data.aws_subnet.existing.id
}

output "backup_vault_name" {
  description = "AWS Backup vault name"
  value       = aws_backup_vault.cloudinvoice.name
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.cloudinvoice.name
}

output "sns_topic_arn" {
  description = "SNS topic ARN for CloudWatch alarms"
  value       = aws_sns_topic.cloudwatch_alarms.arn
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/${var.ssh_key_name}.pem ubuntu@${aws_instance.cloudinvoice.public_ip}"
}

output "deployment_command" {
  description = "Command to deploy CloudInvoice"
  value       = "ssh vps-3 'cd /home/ubuntu/cloudinvoice && bash deploy.sh'"
}

output "instance_tags" {
  description = "Tags applied to the EC2 instance"
  value       = aws_instance.cloudinvoice.tags
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "availability_zone" {
  description = "Availability zone"
  value       = aws_instance.cloudinvoice.availability_zone
}
