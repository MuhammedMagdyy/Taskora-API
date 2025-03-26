#!/bin/bash

echo "🔄 Pulling latest code..."
git pull origin main

echo "📦 Installing production dependencies..."
npm ci --only=production

echo "🔨 Applying database migrations..."
npx prisma migrate deploy

echo "⚙️ Generating Prisma Client..."
npx prisma generate

echo "🏗 Building the app..."
npm run build

echo "🚀 Restarting app with PM2..."
pm2 restart index

echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment completed successfully!"
