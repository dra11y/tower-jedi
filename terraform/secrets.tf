resource "aws_secretsmanager_secret" "manager" {
  name = "${var.app_name}-secrets"
}

resource "aws_secretsmanager_secret_version" "secrets" {
  secret_id = aws_secretsmanager_secret.manager.id
  secret_string = jsonencode({
    ENVIRONMENT               = "prod"
    POSTGRES_DB               = replace(var.app_name, "/[^a-zA-Z\\d]/", "")
    POSTGRES_USER             = var.POSTGRES_USER
    POSTGRES_PASSWORD         = var.POSTGRES_PASSWORD
    POSTGRES_HOST             = aws_rds_cluster.rds_cluster.endpoint
    POSTGRES_PORT             = aws_rds_cluster.rds_cluster.port
    DJANGO_SUPERUSER_USERNAME = var.DJANGO_SUPERUSER_USERNAME
    DJANGO_SUPERUSER_PASSWORD = var.DJANGO_SUPERUSER_PASSWORD
    DJANGO_SUPERUSER_EMAIL    = var.DJANGO_SUPERUSER_EMAIL
  })

  depends_on = [aws_rds_cluster.rds_cluster]
}
