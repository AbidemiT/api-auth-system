#!/bin/sh

echo "🛠️ Step 1: Checking Database Migrations..."
# Run migrations
yarn prisma migrate deploy

echo "✅ Step 2: Migrations finished. Attempting to start Node..."

# Use 'exec' to replace the shell with the Node process. 
# This ensures the container stays running.
exec node dist/src/index.js