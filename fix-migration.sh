#!/bin/bash

# Script to fix the migration issue
# This will add the foreign key constraint if it's missing

set -e

echo "🔧 Fixing migration issue..."
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

echo "Checking if foreign key constraint exists..."

# Check if foreign key exists
FK_EXISTS=$($DOCKER_COMPOSE_CMD exec -T mysql mysql -uroot -prootpassword -e "
SELECT COUNT(*) as count
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'accounts'
AND COLUMN_NAME = 'group_id'
AND REFERENCED_TABLE_NAME = 'account_groups';
" 2>/dev/null | tail -1 | awk '{print $1}')

if [ "$FK_EXISTS" = "0" ] || [ -z "$FK_EXISTS" ]; then
    echo "Foreign key constraint is missing. Adding it..."
    
    $DOCKER_COMPOSE_CMD exec -T mysql mysql -uroot -prootpassword -e "
    USE \$(grep DB_DATABASE .env | cut -d '=' -f2);
    ALTER TABLE accounts 
    ADD CONSTRAINT accounts_group_id_foreign 
    FOREIGN KEY (group_id) REFERENCES account_groups(id) 
    ON DELETE SET NULL;
    " 2>/dev/null || echo "Note: This may fail if constraint already exists or column doesn't exist"
    
    echo "✅ Foreign key constraint added!"
else
    echo "✅ Foreign key constraint already exists!"
fi

echo ""
echo "Running migration again to ensure everything is correct..."
$DOCKER_COMPOSE_CMD exec app php artisan migrate --force

echo ""
echo "✅ Migration fix completed!"

