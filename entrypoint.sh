#!/bin/sh

echo "🚀 Starting Entrypoint Script..."

# Check if database is ready and run migrations
echo "🔄 Running database migrations..."
yarn prisma migrate deploy

# Hand off to the main application
echo "⭐ Starting API Server..."
exec node dist/src/index.js