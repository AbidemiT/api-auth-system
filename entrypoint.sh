#!/bin/sh
set -e

echo "--- Running Migrations ---"
yarn prisma migrate deploy

echo "--- Starting Node Server ---"
# This ensures the app is PID 1 and stays running
exec node dist/src/index.js