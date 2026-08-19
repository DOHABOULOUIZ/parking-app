#!/bin/sh
set -e

php artisan config:clear
php artisan migrate --force
php artisan db:seed --force --class=AdminUserSeeder
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
