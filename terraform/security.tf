# RDS/DB access
resource "aws_security_group" "db" {
  name        = "${var.app_name}-sec-db"
  description = "Allow incoming database connections."
  vpc_id      = aws_vpc.vpc.id

  ingress {
    protocol    = "tcp"
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = aws_subnet.private.*.cidr_block
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# A security group for ALB access from the web
resource "aws_security_group" "alb" {
  name        = "${var.app_name}-sec-alb"
  description = "controls access to the ALB from the web"
  vpc_id      = aws_vpc.vpc.id

  # HTTP access from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # outbound access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}_security_alb"
  }
}

# access to ECS tasks from the ALB
resource "aws_security_group" "ecs" {
  name        = "${var.app_name}-sec-ecs"
  description = "allow inbound access from the ALB only"
  vpc_id      = aws_vpc.vpc.id

  # HTTP access from private subnet
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}_security_ecs"
  }
}
