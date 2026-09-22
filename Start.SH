#!/bin/bash
set -e

echo "==> Checking environment file..."
if [ ! -f .env ]; then
  echo "    ERROR: .env not found. Copy .env.example to .env and set a real DATABASE_URL first."
  exit 1
fi

if ! grep -q '^DATABASE_URL=' .env; then
  echo "    ERROR: DATABASE_URL is missing from .env."
  exit 1
fi

echo "==> Installing dependencies..."
npm install

echo "==> Generating Prisma client..."
npm run db:generate

echo "==> Applying database migrations..."
npm run db:migrate

echo "==> Building TypeScript..."
npm run build

echo "==> Starting server..."
node dist/server.js