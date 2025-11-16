# Docker Setup for Budgora

This guide will help you set up and run the Budgora Laravel application using Docker.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Git

## Quick Start

### Option 1: Using Makefile (Recommended)

The easiest way to get started:

```bash
make setup
```

This will:
1. Create `.env` file if it doesn't exist
2. Build Docker images
3. Start all containers
4. Generate application key
5. Run migrations

Then access the app at http://localhost

### Option 2: Manual Setup

#### 1. Clone and Navigate to Project

```bash
cd /path/to/budgora
```

#### 2. Create Environment File

```bash
# If .env.docker.example exists
cp .env.docker.example .env

# Or copy from existing .env.example
cp .env.example .env
```

Edit `.env` and update the following if needed:
- `APP_KEY` - Will be generated automatically
- `DB_PASSWORD` - Database password
- `DB_ROOT_PASSWORD` - MySQL root password
- `DB_CONNECTION=mysql` - Change from sqlite to mysql
- `DB_HOST=mysql` - Docker service name

#### 3. Build and Start Containers

```bash
docker-compose up -d --build
```

#### 4. Generate Application Key

```bash
docker-compose exec app php artisan key:generate
```

#### 5. Run Migrations

```bash
docker-compose exec app php artisan migrate
```

#### 6. (Optional) Seed Database

```bash
docker-compose exec app php artisan db:seed
```

#### 7. Build Frontend Assets

For production:
```bash
docker-compose exec app npm install
docker-compose exec app npm run build
```

For development (with hot reload):
```bash
docker-compose --profile dev up node
```

## Accessing the Application

- **Web Application**: http://localhost:8080 (or the port specified in `APP_PORT` in docker-compose.yml)
- **MySQL Database**: 
  - Host: `localhost`
  - Port: `3307` (or the port specified in `DB_PORT` in your .env file)
  - Database: `budgora` (or your `DB_DATABASE` value)
  - Username: `budgora` (or your `DB_USERNAME` value)
  - Password: `password` (or your `DB_PASSWORD` value)

## Using Makefile (Easier Commands)

The project includes a `Makefile` with convenient shortcuts:

```bash
make help          # Show all available commands
make setup         # Complete initial setup
make up            # Start containers
make down          # Stop containers
make logs          # View logs
make shell         # Open shell in app container
make artisan CMD="migrate"  # Run artisan commands
make composer CMD="install" # Run composer commands
make npm CMD="build"        # Run npm commands
make migrate       # Run migrations
make test          # Run tests
make cache-clear   # Clear all caches
```

See `make help` for all available commands.

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f mysql
```

### Execute Artisan Commands

```bash
docker-compose exec app php artisan <command>
```

Examples:
```bash
docker-compose exec app php artisan migrate
docker-compose exec app php artisan tinker
docker-compose exec app php artisan cache:clear
```

### Execute Composer Commands

```bash
docker-compose exec app composer install
docker-compose exec app composer update
```

### Execute NPM Commands

```bash
docker-compose exec app npm install
docker-compose exec app npm run build
docker-compose exec app npm run dev
```

### Access MySQL

```bash
docker-compose exec mysql mysql -u budgora -p budgora
```

### Stop Containers

```bash
docker-compose stop
```

### Start Containers

```bash
docker-compose start
```

### Remove Containers (keeps volumes)

```bash
docker-compose down
```

### Remove Containers and Volumes

```bash
docker-compose down -v
```

### Rebuild Containers

```bash
docker-compose up -d --build
```

## Development Workflow

### With Hot Reload (Recommended for Development)

1. Start services:
```bash
docker-compose up -d mysql app nginx
```

2. In a separate terminal, start the Node.js dev server:
```bash
docker-compose --profile dev up node
```

3. Access the app at http://localhost

The Vite dev server will watch for changes and hot-reload automatically.

### Without Hot Reload

1. Start all services:
```bash
docker-compose up -d
```

2. Build assets:
```bash
docker-compose exec app npm run build
```

## Production Deployment

For production, you should:

1. Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`
2. Use the production Dockerfile target:
   ```dockerfile
   docker build --target production -t budgora:latest .
   ```
3. Use environment-specific configuration
4. Set up proper SSL/TLS certificates
5. Configure proper database backups
6. Set up log rotation

## Troubleshooting

### Permission Issues

If you encounter permission issues with storage or cache:

```bash
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

### Database Connection Issues

1. Check if MySQL is healthy:
```bash
docker-compose ps mysql
```

2. Check MySQL logs:
```bash
docker-compose logs mysql
```

3. Verify environment variables in `.env` match docker-compose.yml

### Port Already in Use

If port 80 or 3306 is already in use, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 80 to 8080
```

### Clear All Caches

```bash
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

### Rebuild from Scratch

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Services Overview

- **app**: Laravel PHP-FPM application
- **nginx**: Web server (reverse proxy)
- **mysql**: MySQL 8.0 database
- **node**: Node.js service for building assets (development only)

## Volumes

- `mysql_data`: Persistent MySQL data storage
- `node_modules`: Node.js dependencies (to avoid conflicts with host)

## Networks

All services are connected via the `budgora_network` bridge network.

## Environment Variables

Key environment variables can be set in `.env` or directly in `docker-compose.yml`. The `.env.docker.example` file contains all available options.

