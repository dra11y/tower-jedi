# ALB Hostname
output "alb_hostname" {
  value = aws_lb.alb.dns_name
}

# ECS task definition
output "task_definition" {
  value = aws_ecs_task_definition.task.arn
}

# ECS subnets
output "ecs_subnets" {
  value = aws_ecs_service.service.network_configuration[0].subnets
}

# ECS subnets
output "ecs_security_groups" {
  value = aws_ecs_service.service.network_configuration[0].security_groups.*
}

# ECS cluster
output "cluster" {
  value = aws_ecs_cluster.cluster.arn
}

# ECS repo URL
output "repo_url" {
  value = aws_ecr_repository.repo.repository_url
}
