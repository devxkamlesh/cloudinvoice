# EC2 Instance for CloudInvoice
# This resource represents the existing EC2 instance
# Import it first using: terraform import aws_instance.cloudinvoice i-0dfce1d13140d6ac7

resource "aws_instance" "cloudinvoice" {
  ami           = "ami-0532913178263be11" # Ubuntu 26.04 LTS
  instance_type = var.instance_type
  
  # Network configuration
  subnet_id                   = data.aws_subnet.existing.id
  vpc_security_group_ids      = [aws_security_group.cloudinvoice_app.id]
  associate_public_ip_address = true
  
  # SSH key for access
  key_name = var.ssh_key_name
  
  # Root volume configuration
  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.root_volume_size
    encrypted             = true
    delete_on_termination = false # Protect data on instance termination
    
    tags = {
      Name = "${var.project_name}-root-volume"
    }
  }

  # Enable detailed monitoring for better insights
  monitoring = var.enable_monitoring

  # Metadata service configuration (IMDSv2 required for security)
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required" # IMDSv2
    http_put_response_hop_limit = 1
    instance_metadata_tags      = "enabled"
  }

  # User data for initialization (optional, for future rebuilds)
  user_data = <<-EOF
              #!/bin/bash
              set -e
              
              # Update system
              apt-get update
              apt-get upgrade -y
              
              # Install Docker
              curl -fsSL https://get.docker.com -o get-docker.sh
              sh get-docker.sh
              usermod -aG docker ubuntu
              
              # Install Docker Compose
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              
              # Create app directory
              mkdir -p /home/ubuntu/cloudinvoice
              chown ubuntu:ubuntu /home/ubuntu/cloudinvoice
              
              echo "CloudInvoice infrastructure initialized at $(date)" > /var/log/cloudinvoice-init.log
              EOF

  # Prevent accidental termination
  disable_api_termination = true

  # Enable auto-recovery on system status check failures
  maintenance_options {
    auto_recovery = var.enable_auto_recovery ? "default" : "disabled"
  }

  tags = {
    Name        = "${var.project_name}-app-server"
    Application = "CloudInvoice"
    LaunchDate  = "2026-08-07"
  }

  lifecycle {
    # Prevent replacement of the instance unless absolutely necessary
    create_before_destroy = false
    
    # Ignore changes to user_data and ami after creation
    # (changing these would recreate the instance)
    ignore_changes = [
      user_data,
      ami
    ]
  }
}

# Elastic IP for stable public IP (optional but recommended)
resource "aws_eip" "cloudinvoice" {
  domain = "vpc"
  
  tags = {
    Name = "${var.project_name}-eip"
  }
}

# Associate Elastic IP with instance
resource "aws_eip_association" "cloudinvoice" {
  instance_id   = aws_instance.cloudinvoice.id
  allocation_id = aws_eip.cloudinvoice.id
}

# CloudWatch alarm for instance status checks
resource "aws_cloudwatch_metric_alarm" "instance_health" {
  alarm_name          = "${var.project_name}-instance-health"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "StatusCheckFailed_System"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Trigger auto-recovery when system status check fails"
  alarm_actions       = ["arn:aws:automate:${var.aws_region}:ec2:recover"]

  dimensions = {
    InstanceId = aws_instance.cloudinvoice.id
  }
}
