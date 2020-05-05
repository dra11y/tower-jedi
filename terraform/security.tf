# A security group for ALB access from the web
resource "aws_security_group" "alb" {
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
