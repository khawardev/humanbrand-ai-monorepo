terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "nextjs-app"
}

variable "github_url" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/Humanbrand-AI/website-audit.git"
}


variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "key_pair_name" {
  description = "Name of the AWS key pair for EC2 access"
  type        = string
  default     = "Brand Action Model"
}

variable "database_url" {
  description = "Database connection string"
  type        = string
}

variable "better_auth_secret" {
  description = "Better Auth secret"
  type        = string
}

variable "google_client_id" {
  description = "Google Client ID"
  type        = string
}

variable "google_client_secret" {
  description = "Google Client Secret"
  type        = string
}

variable "email_user" {
  description = "Email user"
  type        = string
}

variable "email_pass" {
  description = "Email password"
  type        = string
}

variable "spider_api_key" {
  description = "Spider API key"
  type        = string
}

variable "firecrawl_api_key" {
  description = "Firecrawl API key"
  type        = string
}

variable "google_generative_ai_api_key" {
  description = "Google Generative AI API key"
  type        = string
}

# Data sources
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-*-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}



# IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "${var.app_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.app_name}-ec2-role"
    Environment = var.environment
  }
}


# IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.app_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# Subnet in default VPC
resource "aws_subnet" "main" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = "172.31.96.0/20"  # Using default VPC CIDR range
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.app_name}-subnet"
    Environment = var.environment
  }
}



# User Data Script (conditional - only if user_data.sh exists)
locals {
  user_data = fileexists("${path.module}/user_data.sh") ? base64encode(templatefile("${path.module}/user_data.sh", {
    app_name                     = var.app_name
    aws_region                   = var.aws_region
    github_url                   = var.github_url
    database_url                 = var.database_url
    better_auth_secret           = var.better_auth_secret
    google_client_id             = var.google_client_id
    google_client_secret         = var.google_client_secret
    email_user                   = var.email_user
    email_pass                   = var.email_pass
    spider_api_key               = var.spider_api_key
    google_generative_ai_api_key = var.google_generative_ai_api_key
    firecrawl_api_key = var.firecrawl_api_key
  })) : base64encode(<<-EOF
    #!/bin/bash
    echo "No user_data.sh found"
    EOF
  )
}

# EC2 Instance
resource "aws_instance" "nextjs_app" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_pair_name
  subnet_id              = aws_subnet.main.id
  vpc_security_group_ids = ["sg-050bac2848680e465"]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  user_data              = local.user_data

  root_block_device {
    volume_type = "gp3"
    volume_size = 12
    encrypted   = true
  }

  tags = {
    Name        = "${var.app_name}-instance"
    Environment = var.environment
    website_audit_deploy = "true"
  }

}

# Elastic IP for EC2 Instance
resource "aws_eip" "nextjs_eip" {
  instance = aws_instance.nextjs_app.id

  tags = {
    Name        = "${var.app_name}-eip"
    Environment = var.environment
  }
}

# Outputs
output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.nextjs_app.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.nextjs_app.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i /path/to/your-key.pem ubuntu@${aws_instance.nextjs_app.public_ip}"
}

output "instance_elastic_ip" {
  description = "Elastic IP address attached to the EC2 instance"
  value       = aws_eip.nextjs_eip.public_ip
}