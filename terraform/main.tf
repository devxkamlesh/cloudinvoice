# CloudInvoice AWS Infrastructure
# This Terraform configuration documents and manages the existing CloudInvoice production infrastructure
# Running in ap-southeast-1 (Singapore) on AWS EC2

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional: Enable after initial setup for state management
  # backend "s3" {
  #   bucket = "cloudinvoice-terraform-state"
  #   key    = "production/terraform.tfstate"
  #   region = "ap-southeast-1"
  #   encrypt = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CloudInvoice"
      Environment = "Production"
      ManagedBy   = "Terraform"
      Owner       = "CloudInvoice Team"
    }
  }
}
