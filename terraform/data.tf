# Data sources to import existing AWS resources

# Import existing VPC
data "aws_vpc" "existing" {
  id = "vpc-05ca98ea27243783f"
}

# Import existing subnet
data "aws_subnet" "existing" {
  id = "subnet-0faa463d0934dfbdf"
}

# Import existing security group
data "aws_security_group" "existing" {
  id = "sg-0eccb27134bcc167a"
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}

# Get latest Ubuntu 24.04 LTS AMI (for future reference)
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd*/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Get existing EC2 instance
data "aws_instance" "cloudinvoice" {
  instance_id = "i-0dfce1d13140d6ac7"
}
