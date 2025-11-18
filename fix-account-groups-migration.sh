#!/bin/bash

# Script to fix the account_groups table migration issue
# This ensures the table structure is correct

set -e

echo "🔧 Fixing account_groups table migration..."
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

echo "Checking account_groups table structure..."

# Check if order column exists
ORDER_EXISTS=$($DOCKER_COMPOSE_CMD exec -T mysql mysql -uroot -prootpassword -e "
SELECT COUNT(*) as count
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'account_groups'
AND COLUMN_NAME = 'order';
" 2>/dev/null | tail -1 | awk '{print $1}')

if [ "$ORDER_EXISTS" = "0" ] || [ -z "$ORDER_EXISTS" ]; then
    echo "Adding 'order' column to account_groups table..."
    $DOCKER_COMPOSE_CMD exec -T mysql mysql -uroot -prootpassword -e "
    USE \$(grep DB_DATABASE .env | cut -d '=' -f2);
    ALTER TABLE account_groups ADD COLUMN \`order\` INT NOT NULL DEFAULT 0 AFTER color;
    " 2>/dev/null
    echo "✅ 'order' column added!"
else
    echo "✅ 'order' column already exists!"
fi

echo ""
echo "Verifying table structure..."
$DOCKER_COMPOSE_CMD exec -T mysql mysql -uroot -prootpassword -e "
USE \$(grep DB_DATABASE .env | cut -d '=' -f2);
DESCRIBE account_groups;
" 2>/dev/null

echo ""
echo "✅ account_groups table structure verified!"

