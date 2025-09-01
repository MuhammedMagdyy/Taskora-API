#!/bin/bash

echo "🔄 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Applying database migrations..."
npx prisma migrate deploy --schema=src/database/prisma/schema.prisma

echo "⚙️ Generating Prisma Client..."
npx prisma generate --schema=src/database/prisma/schema.prisma

echo "🏗 Building the app..."
npm run build

echo "🚀 Restarting apps with PM2..."
if pm2 describe taskora-api > /dev/null 2>&1; then
    echo "📍 Restarting taskora-api..."
    pm2 restart taskora-api
else
    echo "🆕 Starting taskora-api from ecosystem config..."
    pm2 start ecosystem.config.js --only taskora-api
fi

if pm2 describe taskora-email-worker > /dev/null 2>&1; then
    echo "📍 Restarting taskora-email-worker..."
    pm2 restart taskora-email-worker
else
    echo "🆕 Starting taskora-email-worker from ecosystem config..."
    pm2 start ecosystem.config.js --only taskora-email-worker
fi

echo "💾 Saving PM2 process list..."
pm2 save

echo "📊 Checking process status..."
pm2 describe taskora-api

echo "✅ Deployment completed successfully!"
