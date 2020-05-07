locals {
  az_count = length(var.availability_zones[var.aws_region])
}

# Create a VPC to launch our instances into
resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "${var.app_name}-vpc"
  }
}

# Create private subnets to launch our ECS instances into
resource "aws_subnet" "private" {
  count                   = local.az_count
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 8, count.index)
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = var.availability_zones[var.aws_region][count.index]
  map_public_ip_on_launch = false
  tags = {
    Name = "${var.app_name}-private-subnet-${count.index}"
  }
}

# Create public subnets to launch our ALB into
resource "aws_subnet" "public" {
  count                   = local.az_count
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 8, local.az_count + count.index)
  availability_zone       = var.availability_zones[var.aws_region][count.index]
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.app_name}-public-subnet-${count.index}"
  }
}

# Create an internet gateway to give our subnet access to the outside world
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${var.app_name}-gateway"
  }
}

# Grant the VPC internet access on its main route table
resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

# Route internet-bound traffic from private subnets through NAT
resource "aws_eip" "gw" {
  count      = local.az_count
  vpc        = true
  depends_on = [aws_internet_gateway.gw]
  tags = {
    Name = "${var.app_name}-eip-${count.index}"
  }
}

resource "aws_nat_gateway" "gw" {
  count         = local.az_count
  subnet_id     = aws_subnet.public[count.index].id
  allocation_id = aws_eip.gw[count.index].id
  tags = {
    Name = "${var.app_name}-nat-gateway"
  }
}

# Route private subnet outbound traffic to the internet
resource "aws_route_table" "private" {
  count  = local.az_count
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.gw[count.index].id
  }
}

# Assign NAT route tables
resource "aws_route_table_association" "private" {
  count          = local.az_count
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
