#!/bin/sh

echo "🔍 Checking working directory..."
pwd
ls -R dist/src/index.js || echo "❌ ERROR: index.js NOT FOUND at dist/src/index.js"

echo "🛠️ Step 1: Migrations..."
yarn prisma migrate deploy

echo "🚀 Step 2: Starting Server..."
# Using 'exec' is vital for the JSONArgsRecommended rule
exec node dist/src/index.js