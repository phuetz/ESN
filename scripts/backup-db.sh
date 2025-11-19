#!/bin/bash
# ESN Manager Pro - Database Backup Script
# Creates a timestamped backup of the database

set -e

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/esn_backup_$TIMESTAMP"

echo "🗄️  ESN Manager Pro - Database Backup"
echo "===================================="

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup based on database type
if [ "$DB_TYPE" == "postgres" ]; then
    echo "📦 Backing up PostgreSQL database..."
    BACKUP_FILE="$BACKUP_FILE.sql"

    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "${DB_HOST:-localhost}" \
        -p "${DB_PORT:-5432}" \
        -U "${DB_USERNAME:-esnuser}" \
        -d "${DB_DATABASE:-esn_db}" \
        -F p \
        -f "$BACKUP_FILE"

    # Compress backup
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"

elif [ "$DB_TYPE" == "sqlite" ] || [ -z "$DB_TYPE" ]; then
    echo "📦 Backing up SQLite database..."
    BACKUP_FILE="$BACKUP_FILE.sqlite"

    DB_FILE="${DB_DATABASE:-./server/db.sqlite}"
    if [ -f "$DB_FILE" ]; then
        cp "$DB_FILE" "$BACKUP_FILE"
        gzip "$BACKUP_FILE"
        BACKUP_FILE="$BACKUP_FILE.gz"
    else
        echo "❌ Database file not found: $DB_FILE"
        exit 1
    fi
else
    echo "❌ Unsupported database type: $DB_TYPE"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "✅ Backup created successfully!"
echo "   File: $BACKUP_FILE"
echo "   Size: $BACKUP_SIZE"

# Delete old backups (keep last 10)
echo ""
echo "🧹 Cleaning old backups (keeping last 10)..."
ls -t "$BACKUP_DIR"/esn_backup_*.gz 2>/dev/null | tail -n +11 | xargs -r rm
echo "✅ Cleanup complete"
