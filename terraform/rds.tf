resource "aws_rds_cluster" "rds_cluster" {
  cluster_identifier     = "${var.app_name}-rds-cluster"
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  database_name          = replace(var.app_name, "/[^a-zA-Z\\d]/", "") # alphanumeric only
  engine                 = "aurora-postgresql"
  engine_mode            = "serverless"
  engine_version         = "10.7"
  master_username        = var.POSTGRES_USER
  master_password        = var.POSTGRES_PASSWORD
  skip_final_snapshot    = true
  enable_http_endpoint   = true

  scaling_configuration {
    auto_pause               = true
    min_capacity             = 2
    max_capacity             = 8
    seconds_until_auto_pause = 300
    timeout_action           = "ForceApplyCapacityChange"
  }
}

resource "aws_db_subnet_group" "db_subnet" {
  subnet_ids = aws_subnet.private.*.id
}
