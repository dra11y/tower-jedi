################## ECS role ###################

resource "aws_iam_role" "ecs_role" {
  name               = "${var.app_name}_ecs_role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.ecs_role_policy.json

  tags = {
    Name = "${var.app_name}_ecs_role"
  }
}

data "aws_iam_policy_document" "ecs_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecs_role_attachment" {
  role       = aws_iam_role.ecs_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

################### instance role ###################

resource "aws_iam_role" "instance_role" {
  name               = "${var.app_name}_instance_role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.instance_role_policy.json
}

data "aws_iam_policy_document" "instance_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "instance_role_ec2" {
  role       = aws_iam_role.instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "instance_role_logs" {
  role       = aws_iam_role.instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSOpsWorksCloudWatchLogs"
}

resource "aws_iam_instance_profile" "instance_role_profile" {
  name = "${var.app_name}_instance_role_profile"
  path = "/"
  role = aws_iam_role.instance_role.id
}
