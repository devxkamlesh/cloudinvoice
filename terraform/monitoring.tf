# CloudWatch monitoring and alarms for CloudInvoice

# SNS topic for CloudWatch alarms (add your email to receive notifications)
resource "aws_sns_topic" "cloudwatch_alarms" {
  name = "${var.project_name}-cloudwatch-alarms"

  tags = {
    Name = "${var.project_name}-alerts"
  }
}

# SNS topic subscription (you'll need to confirm via email)
resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.cloudwatch_alarms.arn
  protocol  = "email"
  endpoint  = "account@cloudinvoice.co.in" # TODO: Update with your email
}

# CPU utilization alarm
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300 # 5 minutes
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Alert when CPU exceeds 80% for 10 minutes"
  alarm_actions       = [aws_sns_topic.cloudwatch_alarms.arn]

  dimensions = {
    InstanceId = aws_instance.cloudinvoice.id
  }
}

# Disk space alarm (requires CloudWatch agent)
resource "aws_cloudwatch_metric_alarm" "disk_space" {
  alarm_name          = "${var.project_name}-low-disk-space"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "disk_used_percent"
  namespace           = "CWAgent"
  period              = 300
  statistic           = "Average"
  threshold           = 85
  alarm_description   = "Alert when disk usage exceeds 85%"
  alarm_actions       = [aws_sns_topic.cloudwatch_alarms.arn]

  dimensions = {
    InstanceId = aws_instance.cloudinvoice.id
    path       = "/"
    device     = "nvme0n1p1"
    fstype     = "ext4"
  }

  # This alarm requires CloudWatch agent to be installed
  treat_missing_data = "notBreaching"
}

# Memory utilization alarm (requires CloudWatch agent)
resource "aws_cloudwatch_metric_alarm" "memory_high" {
  alarm_name          = "${var.project_name}-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "mem_used_percent"
  namespace           = "CWAgent"
  period              = 300
  statistic           = "Average"
  threshold           = 85
  alarm_description   = "Alert when memory usage exceeds 85%"
  alarm_actions       = [aws_sns_topic.cloudwatch_alarms.arn]

  dimensions = {
    InstanceId = aws_instance.cloudinvoice.id
  }

  treat_missing_data = "notBreaching"
}

# Status check alarm (system-level issues)
resource "aws_cloudwatch_metric_alarm" "status_check" {
  alarm_name          = "${var.project_name}-status-check-failed"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "StatusCheckFailed"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Maximum"
  threshold           = 0
  alarm_description   = "Alert when EC2 status checks fail"
  alarm_actions       = [aws_sns_topic.cloudwatch_alarms.arn]

  dimensions = {
    InstanceId = aws_instance.cloudinvoice.id
  }
}

# Network in alarm (detect unusual traffic)
resource "aws_cloudwatch_metric_alarm" "network_in_high" {
  alarm_name          = "${var.project_name}-high-network-in"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "NetworkIn"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 100000000 # 100 MB in 5 minutes
  alarm_description   = "Alert on unusually high inbound network traffic"
  alarm_actions       = [aws_sns_topic.cloudwatch_alarms.arn]

  dimensions = {
    InstanceId = aws_instance.cloudinvoice.id
  }
}

# CloudWatch Log Group for application logs (optional)
resource "aws_cloudwatch_log_group" "cloudinvoice" {
  name              = "/aws/ec2/${var.project_name}"
  retention_in_days = 30 # Keep logs for 30 days

  tags = {
    Name        = "${var.project_name}-logs"
    Application = "CloudInvoice"
  }
}
