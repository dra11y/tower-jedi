.ONESHELL:
.SHELL := /bin/bash
.PHONY: *
.DEFAULT_GOAL := build
REPO_URL := `cd terraform && terraform output "repo_url"`
ALB_HOSTNAME := `cd terraform && terraform output "alb_hostname"`

help: ## Print some help text
	@echo "This tool assumes you're already logged in via the AWS CLI."
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?(##.*)?$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

init: ## Install required tools for local environment
	brew install terraform || exit 0
	cd terraform && terraform init

install-client: ## Install Angular client
	cd client && yarn

build-client: install-client ## Build Angular client
	cd client && yarn build

dev-client: install-client ## Build Angular client in dev mode and watch
	cd client && yarn build-dev

build-docker: ## Build Docker image
	docker build . -t ${REPO_URL}:latest

build: build-client build-docker ## Build both Angular Client and Docker image

open: ## Open AWS ALB URL in browser
	open "http://${ALB_HOSTNAME}"

deploy: build ## Build, push to ECR and re-deploy to ECS
	aws ecr get-login-password | docker login -u AWS --password-stdin ${REPO_URL}
	docker push ${REPO_URL}:latest
	cd terraform && aws ecs update-service --force-new-deployment --cluster `terraform output cluster` --service `terraform output service`

plan: ## Run Terraform plan
	cd terraform && terraform init && terraform plan

output: ## Run Terraform output
	cd terraform && terraform output

apply: ## Run Terraform apply
	cd terraform && terraform apply

destroy: ## Run Terraform destroy
	cd terraform && terraform destroy
