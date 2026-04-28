# 🚀 Guide de Déploiement — Smart Parking System

## Table des matières
1. [Environnement local](#environnement-local)
2. [Docker & Docker Compose](#docker)
3. [CI/CD avec GitHub Actions](#cicd)
4. [Production](#production)
5. [Monitoring et maintenance](#monitoring)

---

## 🏠 Environnement local

### Prérequis
- **PHP:** 8.2 ou supérieur
- **Composer:** 2.x
- **Node.js:** 20.x ou supérieur
- **MySQL:** 8.0 ou supérieur
- **Redis:** 7.x (optionnel en local)

### Installation Backend (Laravel)

```bash
# 1. Cloner le repository
git clone <repo-url>
cd laravel_12_react_19_parking_app-main

# 2. Installer dépendances PHP
cd backend
composer install

# 3. Configuration environnement
cp .env.example .env

# 4. Générer clé application
php artisan key:generate

# 5. Configurer .env
# Éditer .env avec vos paramètres DB, Stripe, etc.

# 6. Créer base de données
mysql -u root -p
CREATE DATABASE parking_app;
exit;

# 7. Exécuter migrations et seeders
php artisan migrate:fresh --seed

# 8. Créer lien symbolique storage
php artisan storage:link

# 9. Démarrer serveur Laravel
php artisan serve
# Accessible sur http://localhost:8000
```

### Installation Frontend (React)

```bash
# 1. Aller dans dossier frontend
cd frontend

# 2. Installer dépendances npm
npm install

# 3. Configuration environnement
cp .env.example .env

# 4. Éditer .env pour pointer vers l'API
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8080

# 5. Démarrer serveur dev
npm run dev
# Accessible sur http://localhost:5173
```

### Démarrer WebSocket server (Reverb)

```bash
cd backend
php artisan reverb:start
# Écoute sur ws://localhost:8080
```

### Queue Worker (optionnel en local)

```bash
cd backend
php artisan queue:work
```

---

## 🐳 Docker & Docker Compose

### Fichier docker-compose.yml

Créez `docker-compose.yml` à la racine du projet :

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: parking_mysql
    environment:
      MYSQL_DATABASE: parking_app
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_USER: parking_user
      MYSQL_PASSWORD: parking_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - parking_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache & Queue
  redis:
    image: redis:7-alpine
    container_name: parking_redis
    ports:
      - "6379:6379"
    networks:
      - parking_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Laravel Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: parking_backend
    working_dir: /var/www
    environment:
      - DB_HOST=mysql
      - DB_DATABASE=parking_app
      - DB_USERNAME=parking_user
      - DB_PASSWORD=parking_password
      - REDIS_HOST=redis
      - CACHE_DRIVER=redis
      - QUEUE_CONNECTION=redis
    ports:
      - "8000:8000"
      - "8080:8080"
    volumes:
      - ./backend:/var/www
      - backend_storage:/var/www/storage
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - parking_network
    command: >
      sh -c "composer install &&
             php artisan migrate --force &&
             php artisan config:cache &&
             php artisan route:cache &&
             php artisan serve --host=0.0.0.0 --port=8000"

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: parking_frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000/api
      - VITE_WS_URL=ws://localhost:8080
    depends_on:
      - backend
    networks:
      - parking_network
    command: npm run dev -- --host

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: parking_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - parking_network

networks:
  parking_network:
    driver: bridge

volumes:
  mysql_data:
  backend_storage:
```

### Dockerfile Backend (backend/Dockerfile)

```dockerfile
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage

EXPOSE 8000 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
```

### Dockerfile Frontend (frontend/Dockerfile)

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

### Commandes Docker

```bash
# Construire et démarrer tous les services
docker-compose up -d --build

# Voir logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer volumes
docker-compose down -v

# Exécuter commande dans container backend
docker-compose exec backend php artisan migrate

# Accéder au shell du container
docker-compose exec backend bash
```

---

## 🔄 CI/CD avec GitHub Actions

### Fichier .github/workflows/ci-cd.yml

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Tests Backend
  backend-tests:
    name: Backend Tests (Laravel)
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: testing
          MYSQL_ROOT_PASSWORD: secret
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.2
          extensions: mbstring, pdo, pdo_mysql
          coverage: xdebug

      - name: Install Composer dependencies
        working-directory: ./backend
        run: composer install --prefer-dist --no-progress

      - name: Copy .env.testing
        working-directory: ./backend
        run: cp .env.example .env

      - name: Generate application key
        working-directory: ./backend
        run: php artisan key:generate

      - name: Run migrations
        working-directory: ./backend
        run: php artisan migrate --force
        env:
          DB_CONNECTION: mysql
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_DATABASE: testing
          DB_USERNAME: root
          DB_PASSWORD: secret

      - name: Run tests
        working-directory: ./backend
        run: php artisan test --coverage --min=80

      - name: Run Pint (Code Style)
        working-directory: ./backend
        run: ./vendor/bin/pint --test

  # Job 2: Tests Frontend
  frontend-tests:
    name: Frontend Tests (React)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linter
        working-directory: ./frontend
        run: npm run lint

      - name: Run tests
        working-directory: ./frontend
        run: npm run test -- --coverage

      - name: Build production
        working-directory: ./frontend
        run: npm run build

  # Job 3: Build & Push Docker Images
  docker-build:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/parking-backend:latest
          cache-from: type=registry,ref=${{ secrets.DOCKERHUB_USERNAME }}/parking-backend:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKERHUB_USERNAME }}/parking-backend:buildcache,mode=max

      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/parking-frontend:latest

  # Job 4: Deploy to Production
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: docker-build
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/parking-app
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend php artisan migrate --force
            docker-compose exec -T backend php artisan config:cache
            docker-compose exec -T backend php artisan route:cache
```

### Secrets GitHub à configurer

Dans GitHub repo settings → Secrets and variables → Actions:

```
DOCKERHUB_USERNAME=your_username
DOCKERHUB_TOKEN=your_access_token
PRODUCTION_HOST=123.45.67.89
PRODUCTION_USER=deploy
SSH_PRIVATE_KEY=your_ssh_private_key
```

---

## 🌐 Production

### Checklist avant déploiement

#### Backend (.env production)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://parking.example.com

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=parking_prod
DB_USERNAME=secure_user
DB_PASSWORD=secure_strong_password

REDIS_HOST=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=...
MAIL_PASSWORD=...

REVERB_APP_ID=...
REVERB_APP_KEY=...
REVERB_APP_SECRET=...
```

#### Frontend (.env production)
```env
VITE_API_URL=https://api.parking.example.com/api
VITE_WS_URL=wss://api.parking.example.com:8080
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### Configuration Nginx

`/etc/nginx/sites-available/parking-app`

```nginx
# Frontend (React)
server {
    listen 80;
    listen [::]:80;
    server_name parking.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name parking.example.com;

    ssl_certificate /etc/letsencrypt/live/parking.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/parking.example.com/privkey.pem;

    root /var/www/parking-app/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend (Laravel API)
server {
    listen 80;
    server_name api.parking.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.parking.example.com;

    ssl_certificate /etc/letsencrypt/live/api.parking.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.parking.example.com/privkey.pem;

    root /var/www/parking-app/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir certificat
sudo certbot --nginx -d parking.example.com -d api.parking.example.com

# Renouvellement automatique (cron)
0 0 * * * certbot renew --quiet
```

---

## 📊 Monitoring et Maintenance

### Health Check Endpoint

Backend: `GET /api/health`

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'services' => [
            'database' => DB::connection()->getPdo() ? 'ok' : 'error',
            'redis' => Redis::connection()->ping() ? 'ok' : 'error',
        ]
    ]);
});
```

### Log Monitoring

```bash
# Laravel logs
tail -f backend/storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Docker logs
docker-compose logs -f backend
```

### Backup automatique (cron)

```bash
# Backup MySQL database
0 2 * * * docker exec parking_mysql mysqldump -u root -psecret parking_prod | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Backup uploads
0 3 * * * tar -czf /backups/storage-$(date +\%Y\%m\%d).tar.gz /var/www/parking-app/backend/storage/app/public

# Nettoyer backups > 30 jours
0 4 * * * find /backups -name "*.gz" -mtime +30 -delete
```

### Monitoring avec Supervisor (Queue Worker)

`/etc/supervisor/conf.d/parking-worker.conf`

```ini
[program:parking-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/parking-app/backend/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/parking-app/backend/storage/logs/worker.log
```

```bash
# Recharger Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start parking-worker:*
```

---

## 🔧 Commandes de Maintenance

### Laravel

```bash
# Clear tous les caches
php artisan optimize:clear

# Reconstruire caches
php artisan optimize

# Mettre en maintenance
php artisan down --secret="token-secret"
# Accès via: https://parking.example.com/token-secret

# Sortir de maintenance
php artisan up

# Voir files d'attente
php artisan queue:monitor

# Nettoyer files d'attente échouées
php artisan queue:flush
```

---

**Maintenu par:** [Votre nom]  
**Dernière mise à jour:** 17 Mars 2026
