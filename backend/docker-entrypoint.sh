#!/bin/sh
set -e

# Wait for database
echo "Waiting for database..."
sleep 5

# Run migrations
php artisan migrate --force

# Cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM
exec "$@"
