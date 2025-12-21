#!/bin/sh

echo "--- 1. Database Migration ---"
# We use 'yarn prisma' to ensure we use the local version in node_modules
yarn prisma migrate deploy

echo "--- 2. Launching API ---"
# We use 'exec' so Node becomes PID 1. 
# This is the standard for Docker production.
exec node dist/src/index.js