# AWS Budget alerts for cost management
# Monitor your AWS spending and get alerted before costs exceed limits

resource "aws_budgets_budget" "monthly" {
  name              = "${var.project_name}-monthly-budget"
  budget_type       = "COST"
  limit_amount      = "50" # $50 USD per month
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = "2026-08-01_00:00"

  # Alert at 80% of budget (actual spend)
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["account@cloudinvoice.co.in"]
  }

  # Alert at 100% of forecasted spend
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = ["account@cloudinvoice.co.in"]
  }

  # Cost filters (optional: track only this project)
  cost_filter {
    name = "TagKeyValue"
    values = [
      "Project$CloudInvoice"
    ]
  }
}

# Additional budget for EC2 costs specifically
resource "aws_budgets_budget" "ec2_monthly" {
  name              = "${var.project_name}-ec2-budget"
  budget_type       = "COST"
  limit_amount      = "30" # $30 USD per month for EC2
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = "2026-08-01_00:00"

  # Filter for EC2 service only
  cost_filter {
    name = "Service"
    values = [
      "Amazon Elastic Compute Cloud - Compute"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 90
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["account@cloudinvoice.co.in"]
  }
}
