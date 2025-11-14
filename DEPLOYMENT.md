# Deployment Guide

Complete guide for deploying ESN Manager Pro to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Development Deployment](#development-deployment)
- [Production Deployment](#production-deployment)
  - [Docker Deployment](#docker-deployment)
  - [Manual Deployment](#manual-deployment)
  - [Cloud Deployment](#cloud-deployment)
- [Database Setup](#database-setup)
- [CI/CD](#cicd)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- Node.js >= 20.x
- npm >= 10.x
- PostgreSQL >= 14 (for production)
- Docker & Docker Compose (optional)
- Git

### Required Accounts (for cloud deployment)

- Domain name
- SSL certificate
- Cloud provider account (AWS, GCP, Azure, or similar)
- Email service (for notifications)

## Environment Configuration

### 1. Backend Environment Variables

Create `/home/user/ESN/.env` from `.env.example`:

```bash
# Production Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database (PostgreSQL for production)
DB_TYPE=postgres
DB_HOST=your-db-host.com
DB_PORT=5432
DB_USERNAME=esnuser
DB_PASSWORD=your-secure-password
DB_DATABASE=esn_production

# JWT Configuration (IMPORTANT: Change these!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# API
API_VERSION=v1
```

### 2. Frontend Environment Variables

Create `/home/user/ESN/.env.local`:

```bash
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_APP_NAME=ESN Manager Pro
VITE_APP_VERSION=1.0.0
```

### 3. Generate Secure Keys

```bash
# Generate JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate refresh secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Development Deployment

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your configuration

# 3. Setup database
npm run seed

# 4. Start development servers
npm run dev:full

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3001
# - API Docs: http://localhost:3001/api-docs
```

## Production Deployment

### Docker Deployment (Recommended)

#### 1. Build and Deploy with Docker Compose

```bash
# 1. Update docker-compose.yml with your configuration
# Edit environment variables in docker-compose.yml

# 2. Build and start services
docker-compose up -d

# 3. Check logs
docker-compose logs -f

# 4. Seed database (first time only)
docker-compose exec backend npm run seed
```

#### 2. Docker Compose Configuration

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: esn_db
      POSTGRES_USER: esnuser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - esn-network

  backend:
    build: .
    environment:
      NODE_ENV: production
      DB_TYPE: postgres
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: esnuser
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: esn_db
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: https://yourdomain.com
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    networks:
      - esn-network

volumes:
  postgres_data:

networks:
  esn-network:
```

#### 3. SSL/TLS with Nginx

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Manual Deployment

#### 1. Build Application

```bash
# Build frontend
npm run build

# Build backend
npm run build:server
```

#### 2. Setup Server

```bash
# Install Node.js on server
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Create application directory
mkdir -p /var/www/esn-manager
cd /var/www/esn-manager
```

#### 3. Deploy Files

```bash
# Copy built files to server
scp -r dist/ user@server:/var/www/esn-manager/
scp -r server/ user@server:/var/www/esn-manager/
scp package*.json user@server:/var/www/esn-manager/
scp .env user@server:/var/www/esn-manager/
```

#### 4. Start Application

```bash
# On server
cd /var/www/esn-manager

# Install production dependencies
npm ci --only=production

# Start with PM2
pm2 start server/index.js --name esn-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 5. Setup Nginx

```bash
# Install Nginx
sudo apt-get install nginx

# Copy nginx configuration
sudo nano /etc/nginx/sites-available/esn-manager

# Enable site
sudo ln -s /etc/nginx/sites-available/esn-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Cloud Deployment

#### AWS Deployment

**Using Elastic Beanstalk:**

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize EB:
```bash
eb init -p node.js esn-manager
```

3. Create environment:
```bash
eb create esn-production
```

4. Deploy:
```bash
eb deploy
```

**Using ECS (Docker):**

1. Build and push image:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t esn-manager .
docker tag esn-manager:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/esn-manager:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/esn-manager:latest
```

2. Create ECS task definition and service

#### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create esn-manager

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Seed database
heroku run npm run seed
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build:all`
   - Run command: `npm run server`
3. Add environment variables
4. Deploy

## Database Setup

### PostgreSQL Production Setup

#### 1. Install PostgreSQL

```bash
sudo apt-get install postgresql postgresql-contrib
```

#### 2. Create Database and User

```bash
sudo -u postgres psql

CREATE DATABASE esn_production;
CREATE USER esnuser WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE esn_production TO esnuser;
\q
```

#### 3. Run Migrations

```bash
npm run typeorm migration:run
```

#### 4. Seed Data

```bash
npm run seed
```

### Database Backup

```bash
# Backup
pg_dump -U esnuser -h localhost esn_production > backup.sql

# Restore
psql -U esnuser -h localhost esn_production < backup.sql
```

## CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run typecheck

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          # Your deployment script
          ./scripts/deploy.sh
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm test
    - npm run typecheck

build:
  stage: build
  script:
    - npm run build:all
  artifacts:
    paths:
      - dist/
      - server/dist/

deploy:
  stage: deploy
  script:
    - ./scripts/deploy.sh
  only:
    - main
```

## Monitoring

### Health Checks

```bash
# Check API health
curl https://api.yourdomain.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-01-14T12:00:00.000Z",
  "uptime": 12345,
  "environment": "production"
}
```

### Logging

```bash
# View logs with PM2
pm2 logs esn-backend

# View specific log file
tail -f logs/app.log
tail -f logs/error.log

# View Docker logs
docker-compose logs -f backend
```

### Monitoring Tools

**Recommended:**
- Application monitoring: New Relic, Datadog
- Error tracking: Sentry
- Uptime monitoring: UptimeRobot, Pingdom
- Log management: Loggly, Papertrail

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Database Connection Failed

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database credentials
psql -U esnuser -h localhost -d esn_production

# Check firewall
sudo ufw status
sudo ufw allow 5432/tcp
```

#### Application Crashes

```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs esn-backend --err

# Restart application
pm2 restart esn-backend
```

#### Memory Issues

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run server

# Update PM2 configuration
pm2 start server/index.js --max-memory-restart 1G
```

### Performance Optimization

1. **Enable compression:**
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Configure caching:**
   - Use Redis for session storage
   - Implement HTTP caching headers
   - Use CDN for static assets

3. **Database optimization:**
   - Add indexes to frequently queried columns
   - Use connection pooling
   - Implement query caching

## Security Checklist

- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Configure firewall
- [ ] Enable database backups
- [ ] Implement logging and monitoring
- [ ] Use secure headers (Helmet.js)
- [ ] Enable CSRF protection
- [ ] Implement input validation
- [ ] Use parameterized queries (TypeORM handles this)

## Rollback Procedure

```bash
# With Docker
docker-compose down
docker-compose pull # Pull previous version
docker-compose up -d

# With PM2
pm2 stop esn-backend
# Restore previous version files
pm2 start esn-backend

# Database rollback
psql -U esnuser esn_production < backup_before_deploy.sql
```

## Support

For deployment issues:
- Check logs first
- Review this guide
- Check GitHub issues
- Contact support@esn-manager.com

---

**Last Updated:** January 2025
**Version:** 1.0.0
