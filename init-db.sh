#!/bin/sh
# Database initialization script - runs migrations on container startup

echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "Running Prisma migrations..."
cd /app
# Prisma is installed by `npm ci` in the builder and carried into the standalone
# image. Use that local binary instead of an npx cache, which can race during restarts.
./node_modules/.bin/prisma migrate deploy

echo "Starting Next.js application..."
exec node server.js
