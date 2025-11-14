#!/bin/bash

# Script to create a new TypeORM migration

if [ -z "$1" ]; then
    echo "Error: Migration name is required"
    echo "Usage: ./scripts/create-migration.sh <MigrationName>"
    exit 1
fi

MIGRATION_NAME=$1
TIMESTAMP=$(date +%s)

cd "$(dirname "$0")/.." || exit

echo "Creating migration: $MIGRATION_NAME"

npx typeorm migration:create "./server/migrations/${TIMESTAMP}-${MIGRATION_NAME}"

echo "Migration created successfully!"
echo "File: server/migrations/${TIMESTAMP}-${MIGRATION_NAME}.ts"
