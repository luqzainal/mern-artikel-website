#!/bin/bash

# Database Backup Script for Islamic Articles Platform
# This script creates a compressed backup of the PostgreSQL database

# Environment variables
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-islamic_articles}"
DB_USER="${POSTGRES_USER:-islamic_user}"
DB_PASSWORD="${POSTGRES_PASSWORD:-islamic_pass_2024}"

# Backup directory
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/islamic_articles_$DATE.sql.gz"

# Retention period (days)
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Export password for pg_dump
export PGPASSWORD="$DB_PASSWORD"

# Create backup
echo "Starting database backup at $(date)"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_FILE"

    # Get file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup size: $SIZE"

    # Remove old backups
    echo "Removing backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -name "islamic_articles_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

    echo "Backup completed at $(date)"
else
    echo "ERROR: Backup failed at $(date)"
    exit 1
fi

# Unset password
unset PGPASSWORD
