################## ECS role ###################

resource "aws_iam_role" "ecs_role" {
  name               = "${var.app_name}-ecs-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.ecs_role_policy.json

  tags = {
    Name = "${var.app_name}-ecs-role"
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

data "aws_kms_alias" "secretsmanager" {
  name = "alias/aws/secretsmanager"
}

data "aws_iam_policy_document" "ecs_kms_policy_doc" {
  statement {
    actions = ["secretsmanager:GetSecretValue", "kms:Decrypt"]

    resources = [
      "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${aws_secretsmanager_secret.manager.name}",
      "arn:aws:kms:${var.aws_region}:${data.aws_caller_identity.current.account_id}:key/${data.aws_kms_alias.secretsmanager.target_key_id}"
    ]
  }
}

resource "aws_iam_policy" "ecs_kms_policy" {
  name   = "${var.app_name}-ecs-kms-policy"
  path   = "/"
  policy = data.aws_iam_policy_document.ecs_kms_policy_doc.json
}

resource "aws_iam_role_policy_attachment" "ecs_role_attachment" {
  role       = aws_iam_role.ecs_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_kms_attachment" {
  role       = aws_iam_role.ecs_role.name
  policy_arn = aws_iam_policy.ecs_kms_policy.arn
}

################### instance role ###################

resource "aws_iam_role" "instance_role" {
  name               = "${var.app_name}-instance-role"
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
  name = "${var.app_name}-instance-role-profile"
  path = "/"
  role = aws_iam_role.instance_role.id
}
