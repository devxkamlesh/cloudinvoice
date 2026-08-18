#!/bin/sh
# Database initialization script - runs migrations on container startup

echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "Running Prisma migrations..."
cd /app
# The runtime image pins this CLI globally so startup never downloads packages or
# races an npx cache.
prisma migrate deploy

echo "Starting Next.js application..."
exec node server.js
