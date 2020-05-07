# Specify the provider and access details
provider "aws" {
  region = var.aws_region
}

# get account id
data "aws_caller_identity" "current" {}

# Fetch AZs in the current region
data "aws_availability_zones" "available" {}

resource "aws_key_pair" "auth" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}
