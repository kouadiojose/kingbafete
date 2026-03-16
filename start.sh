#!/bin/sh
npx prisma db push || echo "DB push skipped"
node server/seed.js || echo "Seed skipped"
node server/index.js
