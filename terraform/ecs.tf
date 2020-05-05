# Create an ECR repository for our Docker image
resource "aws_ecr_repository" "repo" {
  name                 = "${var.app_name}_repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  provisioner "local-exec" {
    command = <<COMMAND
        (cd ../client && ng build)
        docker build .. -t ${aws_ecr_repository.repo.repository_url}:latest
        aws ecr get-login-password | docker login -u AWS --password-stdin ${aws_ecr_repository.repo.repository_url}
        docker push ${aws_ecr_repository.repo.repository_url}:latest
COMMAND
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

  container_definitions = <<DEFINITION
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
        ]
      }
    ]
DEFINITION
}

#
# # # Template for ECS task definition
# # data "template_file" "ecs_task" {
# #   template = file("task.json.tpl")
# #   vars = {
# #     app_name       = var.app_name
# #     image_name     = "${aws_ecr_repository.repo.name}/latest"
# #     aws_region     = var.aws_region
# #     fargate_cpu    = var.fargate_cpu
# #     fargate_memory = var.fargate_memory
# #     app_port       = var.app_port
# #   }
# # }
#
# # resource "aws_ecs_task_definition" "task" {
# #   family                   = "${var.app_name}_ecs_service"
# #   execution_role_arn       = aws_iam_role.ecs_role.arn
# #   network_mode             = "awsvpc"
# #   container_definitions    = data.template_file.ecs_task.rendered
# #   requires_compatibilities = ["FARGATE"]
# #   cpu                      = var.fargate_cpu
# #   memory                   = var.fargate_memory
# # }
#

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
    aws_lb_listener.alb_listener #,
    #aws_iam_role_policy_attachment.ecs_role_attachment
  ]
}

#
# #
# # resource "aws_launch_configuration" "launch_config" {
# #   name_prefix          = "${var.app_name}_launch_config"
# #   image_id             = var.aws_ami[var.aws_region]
# #   instance_type        = "t2.micro"
# #   key_name             = var.key_name
# #   iam_instance_profile = aws_iam_instance_profile.instance_profile.id
# #   security_groups      = [aws_security_group.ecs.id]
# #   lifecycle {
# #     create_before_destroy = true
# #   }
# # }
# #
# # resource "aws_autoscaling_group" "default" {
# #   name                      = "${var.app_name}_autoscaling_group"
# #   vpc_zone_identifier       = [aws_subnet.private.id]
# #   launch_configuration      = aws_launch_configuration.launch_config.id
# #   min_size                  = 2
# #   max_size                  = 2
# #   desired_capacity          = 2
# #   health_check_grace_period = 300
# #   health_check_type         = "ELB"
# #   force_delete              = true
# # }
