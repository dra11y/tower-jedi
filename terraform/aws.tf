# Specify the provider and access details
provider "aws" {
  region = var.aws_region
}

# Fetch AZs in the current region
data "aws_availability_zones" "available" {
}


resource "aws_key_pair" "auth" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}
