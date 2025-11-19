#!/bin/bash
# ESN Manager Pro - Docker Development Script
# Manages Docker containers for development

set -e

COMMAND=${1:-start}

case "$COMMAND" in
    start)
        echo "🐳 Starting Docker containers..."
        docker-compose up -d postgres redis
        echo "✅ Containers started"
        echo ""
        echo "PostgreSQL: localhost:5432"
        echo "Redis: localhost:6379"
        ;;

    stop)
        echo "🛑 Stopping Docker containers..."
        docker-compose down
        echo "✅ Containers stopped"
        ;;

    restart)
        echo "🔄 Restarting Docker containers..."
        docker-compose restart
        echo "✅ Containers restarted"
        ;;

    logs)
        echo "📜 Showing container logs..."
        docker-compose logs -f
        ;;

    clean)
        echo "🧹 Cleaning Docker resources..."
        read -p "This will remove all containers, volumes, and images. Continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            docker system prune -af
            echo "✅ Cleanup complete"
        else
            echo "❌ Cleanup cancelled"
        fi
        ;;

    build)
        echo "🔨 Building Docker images..."
        docker-compose build --no-cache
        echo "✅ Build complete"
        ;;

    *)
        echo "Usage: $0 {start|stop|restart|logs|clean|build}"
        echo ""
        echo "Commands:"
        echo "  start   - Start development containers (PostgreSQL, Redis)"
        echo "  stop    - Stop all containers"
        echo "  restart - Restart all containers"
        echo "  logs    - Show container logs"
        echo "  clean   - Remove all containers, volumes, and images"
        echo "  build   - Rebuild Docker images"
        exit 1
        ;;
esac
