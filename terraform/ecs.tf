# Create an ECR repository for our Docker image
resource "aws_ecr_repository" "repo" {
  name                 = "${var.app_name}_repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  provisioner "local-exec" {
    command = <<END_OF_COMMAND
        (cd ../client && ng build)
        (cd .. && docker build . -t ${aws_ecr_repository.repo.repository_url}:latest)
        aws ecr get-login-password | docker login -u AWS --password-stdin ${aws_ecr_repository.repo.repository_url}
        docker push ${aws_ecr_repository.repo.repository_url}:latest
END_OF_COMMAND
  }
}

# Define an ECS cluster
resource "aws_ecs_cluster" "cluster" {
  name = "${var.app_name}_ecs_cluster"
}

resource "aws_ecs_task_definition" "task" {
  family                   = "${var.app_name}_task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  # task_role_arn =
  execution_role_arn = aws_iam_role.ecs_role.arn

  container_definitions = <<END_OF_DEFINITION
    [
      {
        "name": "${var.app_name}",
        "image": "${aws_ecr_repository.repo.repository_url}:latest",
        "cpu": ${var.fargate_cpu},
        "memory": ${var.fargate_memory},
        "networkMode": "awsvpc",
        "portMappings": [
          {
            "containerPort": ${var.app_port},
            "hostPort": ${var.app_port}
          }
      ],
      "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "${aws_cloudwatch_log_group.log_group.name}",
            "awslogs-region": "${var.aws_region}",
            "awslogs-stream-prefix": "${var.app_name}_logs"
          }
        }
      }
    ]
END_OF_DEFINITION
}

resource "aws_ecs_service" "service" {
  name            = "${var.app_name}_ecs_service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = [aws_security_group.ecs.id]
    subnets         = aws_subnet.private.*.id
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.target.arn
    container_name   = var.app_name
    container_port   = var.app_port
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  depends_on = [
    aws_lb_listener.alb_listener,
    aws_iam_role_policy_attachment.ecs_role_attachment
  ]
}
