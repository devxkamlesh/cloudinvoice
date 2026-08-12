# Variables for CloudInvoice infrastructure

variable "aws_region" {
  description = "AWS region where CloudInvoice is deployed"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "cloudinvoice"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "root_volume_size" {
  description = "Size of root EBS volume in GB"
  type        = number
  default     = 30
}

variable "ssh_key_name" {
  description = "Name of the SSH key pair for EC2 access"
  type        = string
  default     = "cloudinvoice-prod"
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed to SSH into the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"] # TODO: Restrict to your IP for security
}

variable "allowed_http_cidrs" {
  description = "CIDR blocks allowed to access HTTP/HTTPS"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Public web traffic
}

variable "enable_monitoring" {
  description = "Enable detailed CloudWatch monitoring"
  type        = bool
  default     = true
}

variable "enable_auto_recovery" {
  description = "Enable EC2 auto-recovery on system status check failures"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Number of days to retain EBS snapshots"
  type        = number
  default     = 7
}
