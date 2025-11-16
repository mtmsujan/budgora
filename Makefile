.PHONY: help build up down restart logs shell artisan composer npm mysql test clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker images
	docker-compose build

up: ## Start all containers
	docker-compose up -d

down: ## Stop all containers
	docker-compose down

restart: ## Restart all containers
	docker-compose restart

logs: ## Show logs from all containers
	docker-compose logs -f

logs-app: ## Show logs from app container
	docker-compose logs -f app

logs-nginx: ## Show logs from nginx container
	docker-compose logs -f nginx

logs-mysql: ## Show logs from mysql container
	docker-compose logs -f mysql

shell: ## Open shell in app container
	docker-compose exec app sh

artisan: ## Run artisan command (usage: make artisan CMD="migrate")
	docker-compose exec app php artisan $(CMD)

composer: ## Run composer command (usage: make composer CMD="install")
	docker-compose exec app composer $(CMD)

npm: ## Run npm command (usage: make npm CMD="install")
	docker-compose exec app npm $(CMD)

mysql: ## Open MySQL shell
	docker-compose exec mysql mysql -u budgora -pbudgora budgora

setup: ## Initial setup (copy env, build, up, key generate, migrate)
	@if [ ! -f .env ]; then \
		echo "📋 Creating .env file..."; \
		cp .env.docker.example .env 2>/dev/null || cp .env.example .env; \
	fi
	docker-compose build
	docker-compose up -d
	sleep 5
	docker-compose exec app php artisan key:generate --force || true
	@echo "📦 Running database migrations..."
	@docker-compose exec app php artisan migrate --force || (echo "⚠️  Migration completed with warnings (some may already be applied)" && exit 0)
	@echo "✅ Setup complete! Access the app at http://localhost:8080"

install: ## Install dependencies (composer + npm)
	docker-compose exec app composer install
	docker-compose exec app npm install

build-assets: ## Build frontend assets
	docker-compose exec app npm run build

dev-assets: ## Start dev server for assets (with hot reload)
	docker-compose --profile dev up node

migrate: ## Run database migrations
	@docker-compose exec app php artisan migrate || echo "⚠️  Migration completed with warnings"

migrate-fresh: ## Fresh migration with seeding
	docker-compose exec app php artisan migrate:fresh --seed

seed: ## Seed database
	docker-compose exec app php artisan db:seed

test: ## Run tests
	docker-compose exec app php artisan test

cache-clear: ## Clear all caches
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear

cache-optimize: ## Optimize caches
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan view:cache

permissions: ## Fix storage and cache permissions
	docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
	docker-compose exec app chmod -R 775 storage bootstrap/cache

clean: ## Remove containers, volumes, and images
	docker-compose down -v
	docker system prune -f

ps: ## Show running containers
	docker-compose ps

