#!/bin/sh
set -e

echo "🔍 Checking working directory..."
pwd
echo "🔎 Node version: $(node -v || echo 'node not found')"
echo "🔎 Listing dist/src to verify compiled files:"
ls -la dist/src || echo "❌ dist/src not found"
ls -la dist/src/index.js || echo "❌ ERROR: index.js NOT FOUND at dist/src/index.js"

echo "🛠️ Step 1: Migrations..."
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
	echo "Running: yarn prisma migrate deploy (with retries)"
	MAX_RETRIES=${MIGRATE_MAX_RETRIES:-12}
	RETRY_DELAY=${MIGRATE_RETRY_DELAY:-5}
	i=0
	until yarn prisma migrate deploy; do
		i=$((i+1))
		echo "Attempt ${i}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY}s..."
		if [ "$i" -ge "$MAX_RETRIES" ]; then
			echo "❌ Migrations failed after ${MAX_RETRIES} attempts"
			ls -la prisma || true
			cat prisma/schema.prisma || true
			exit 1
		fi
		sleep ${RETRY_DELAY}
	done
	echo "✅ Migrations applied (or none pending)"
else
	echo "Skipping migrations because RUN_MIGRATIONS != true"
fi

echo "🌱 Step 1.5: Database Seeding..."
if [ "${RUN_SEED:-false}" = "true" ]; then
	echo "Running Prisma seed: yarn prisma db seed"
	yarn prisma db seed || echo "⚠️ Seed failed or already seeded"
	echo "✅ Seed step completed"
else
	echo "Skipping seed because RUN_SEED != true"
fi

echo "🚀 Step 2: Starting Server..."
echo "Starting: node dist/src/index.js"
node dist/src/index.js
EXIT_CODE=$?
echo "node exited with code ${EXIT_CODE}"
exit ${EXIT_CODE}