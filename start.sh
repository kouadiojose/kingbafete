#!/bin/sh
echo "=== Starting King Bafete ==="
echo "Running prisma db push..."
npx prisma db push || echo "DB push failed"
echo "Running seed..."
node server/seed.js || echo "Seed failed"
echo "Starting server..."
node server/index.js
