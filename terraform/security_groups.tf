# Security Groups for CloudInvoice
# Note: The existing security group (sg-0eccb27134bcc167a) is imported via data source
# This file defines the DESIRED security group configuration for future management

resource "aws_security_group" "cloudinvoice_app" {
  name_prefix = "${var.project_name}-app-"
  description = "Security group for CloudInvoice application server"
  vpc_id      = data.aws_vpc.existing.id

  tags = {
    Name = "${var.project_name}-app-sg"
  }
}

# SSH access
resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.cloudinvoice_app.id
  description       = "SSH access"
  
  from_port   = 22
  to_port     = 22
  ip_protocol = "tcp"
  cidr_ipv4   = var.allowed_ssh_cidrs[0]

  tags = {
    Name = "Allow SSH"
  }
}

# HTTP access (for nginx reverse proxy)
resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.cloudinvoice_app.id
  description       = "HTTP access"
  
  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow HTTP"
  }
}

# HTTPS access (for SSL/TLS)
resource "aws_vpc_security_group_ingress_rule" "https" {
  security_group_id = aws_security_group.cloudinvoice_app.id
  description       = "HTTPS access"
  
  from_port   = 443
  to_port     = 443
  ip_protocol = "tcp"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow HTTPS"
  }
}

# Temporary: Direct app access on port 3002 (remove after nginx setup)
resource "aws_vpc_security_group_ingress_rule" "app_direct" {
  security_group_id = aws_security_group.cloudinvoice_app.id
  description       = "Direct app access (temporary, remove after nginx)"
  
  from_port   = 3002
  to_port     = 3002
  ip_protocol = "tcp"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow App Direct (Temporary)"
  }
}

# Outbound: Allow all egress traffic
resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.cloudinvoice_app.id
  description       = "Allow all outbound traffic"
  
  ip_protocol = "-1"
  cidr_ipv4   = "0.0.0.0/0"

  tags = {
    Name = "Allow All Outbound"
  }
}
