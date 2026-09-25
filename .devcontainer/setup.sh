#!/bin/bash
set -e

echo "🚀 Setting up Affiliate Store development environment..."

# Install PostgreSQL client tools
sudo apt-get update -qq && sudo apt-get install -y -qq postgresql-client

# Backend setup
echo "📦 Installing backend dependencies..."
cd /workspaces/affiliate-store/backend
npm install

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd /workspaces/affiliate-store/frontend
npm install

echo "✅ Setup complete! Run 'npm run dev' in backend/ and frontend/ directories."
