.PHONY: help dev build start stop clean logs shell test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Start development server with Docker Compose
	docker-compose up

dev-build: ## Build and start development server
	docker-compose up --build

dev-detached: ## Start development server in background
	docker-compose up -d

prod: ## Start production server
	docker-compose -f docker-compose.prod.yml up -d --build

prod-build: ## Build production image
	docker build -t bearops-rev-growth-platform:latest .

stop: ## Stop all containers
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

clean: ## Remove all containers, volumes, and images
	docker-compose down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker rmi bearops-rev-growth-platform:latest || true

logs: ## View container logs
	docker-compose logs -f

logs-prod: ## View production container logs
	docker-compose -f docker-compose.prod.yml logs -f

shell: ## Open shell in development container
	docker-compose exec app sh

test: ## Run tests
	docker-compose exec app npm test

test-coverage: ## Run tests with coverage
	docker-compose exec app npm run test:coverage

test-local: ## Test Docker deployment locally
	./scripts/test-deployment.sh

test-quick: ## Quick local Docker test
	./scripts/quick-test.sh

install: ## Install dependencies locally (without Docker)
	npm install

run-local: ## Run locally without Docker
	npm run dev

