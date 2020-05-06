.ONESHELL:
.SHELL := /bin/bash
.PHONY: *
.DEFAULT_GOAL := build
REPO_URL := `cd terraform && terraform output "repo_url"`

help: ## Print some help text
	@echo "This tool assumes you're already logged in via the AWS CLI."
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?(##.*)?$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

init: ## Install required tools for local environment
	brew install terraform || exit 0
	cd terraform && terraform init

build: ## Build Angular client & Docker image
	@echo "Building & pushing to ${REPO_URL}..."
	cd client && ng build --prod
	docker build . -t ${REPO_URL}:latest

deploy: ## Push to ECR and re-deploy to ECS
	aws ecr get-login-password | docker login -u AWS --password-stdin ${REPO_URL}
	docker push ${REPO_URL}:latest
	@cd terraform
	aws ecs update-service --force-new-deployment --cluster `terraform output cluster` --service `terraform output service`
	@cd ..

plan: ## Run Terraform plan
	cd terraform && terraform init && terraform plan

output: ## Run Terraform output
	cd terraform && terraform output

apply: ## Run Terraform apply
	cd terraform && terraform apply

destroy: ## Run Terraform destroy
	cd terraform && terraform destroy
