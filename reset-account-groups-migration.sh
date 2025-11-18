#!/bin/bash

# Script to reset and re-run the account_groups migration
# This marks the migration as not run so it can execute with the fixed code

set -e

echo "🔄 Resetting account_groups migration..."
echo ""

# Detect Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif docker-compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose not found!"
    exit 1
fi

cd /var/www/budgora

# Get database name from .env
DB_NAME=$(grep DB_DATABASE .env | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)

if [ -z "$DB_NAME" ]; then
    echo "❌ Could not find DB_DATABASE in .env file"
    exit 1
fi

echo "Database: $DB_NAME"
echo ""

# Remove the migration entry from migrations table so it can be re-run
echo "Removing migration entry from migrations table..."
$DOCKER_COMPOSE_CMD exec -T mysql mysql -uroot -prootpassword "$DB_NAME" -e "
DELETE FROM migrations 
WHERE migration = '2025_11_04_155139_create_account_groups_table';
" 2>/dev/null

echo "✅ Migration entry removed!"
echo ""

# Now re-run the migration with the fixed code
echo "Re-running migration with fixed code..."
$DOCKER_COMPOSE_CMD exec app php artisan migrate --force

echo ""
echo "✅ Migration reset and re-run completed!"

