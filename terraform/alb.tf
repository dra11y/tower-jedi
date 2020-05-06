resource "aws_lb" "alb" {
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public.*.id
  load_balancer_type = "application"
  name               = var.subdomain

  tags = {
    Name = "${var.app_name}_alb"
  }
}

resource "aws_lb_target_group" "target" {
  port        = "80"
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    unhealthy_threshold = "3"
    interval            = "30"
    matcher             = "200"
    path                = "/" # "/api/exhaust_port/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = "5"
  }

  tags = {
    Name = "${var.app_name}_alb_target_group"
  }

  depends_on = [aws_lb.alb]
}

resource "aws_lb_listener" "alb_listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.target.arn
    type             = "forward"
  }
}
