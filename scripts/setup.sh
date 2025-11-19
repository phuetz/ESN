#!/bin/bash
# ESN Manager Pro - Setup Script
# This script sets up the development environment

set -e

echo "🚀 ESN Manager Pro - Setup Script"
echo "=================================="

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version must be 20 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# Copy environment files if they don't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Build TypeScript
echo ""
echo "🔨 Building backend..."
npm run build:server

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
echo "⚠️  Make sure your database is running"
read -p "Continue with migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run migration:run || echo "⚠️  Migrations failed or no migrations to run"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your configuration"
echo "  2. Run 'npm run dev:full' to start development server"
echo "  3. Run 'npm run seed' to populate database with sample data"
echo ""
