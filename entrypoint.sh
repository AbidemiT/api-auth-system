#!/bin/sh

echo "--- 1. Database Migration Check ---"
# We don't use 'set -e' here so that if migrations are already 
# done, the script definitely moves to the next line.
yarn prisma migrate deploy

echo "--- 2. Starting Node Application ---"
# Check if the file exists before running to avoid silent crashes
if [ -f "./dist/src/index.js" ]; then
    echo "Found dist/src/index.js, launching..."
    exec node dist/src/index.js
else
    echo "ERROR: dist/src/index.js not found!"
    ls -R dist
    exit 1
fi