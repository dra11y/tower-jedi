variable "app_name" {
  description = "Name of the project/application"
  default     = "death_star"
}

variable "key_name" {
  description = "Name of AWS key pair"
  default     = "death_star_ssh_key"
}

variable "public_key_path" {
  description = "Path to public SSH key"
  default     = "~/.ssh/id_rsa.pub"
}

variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "us-west-2"
}

variable "aws_ami" {
  description = "ECS optimized AMI"
  default = {
    us-west-2 = "ami-088bb4cd2f62fc0e1"
  }
}

variable "availability_zones" {
  description = "availability zone based on region"
  default = {
    us-west-2 = ["us-west-2a", "us-west-2b"]
  }
}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 2
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "512"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "1024"
}

variable "app_port" {
  description = "Port in the Docker container that the app runs on"
  default     = "80"
}
