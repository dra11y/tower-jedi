# ALB Hostname
output "alb_hostname" {
  value = aws_lb.alb.dns_name
}

# ECS repo URL
output "repo-url" {
  value = aws_ecr_repository.repo.repository_url
}
