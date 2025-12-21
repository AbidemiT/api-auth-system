#!/bin/sh
set -e

echo "Checking migrations..."
npx prisma migrate deploy

echo "Starting application with yarn..."
# 'exec' ensures the Node process replaces the shell process
exec yarn start