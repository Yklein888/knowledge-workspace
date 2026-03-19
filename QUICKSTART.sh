#!/bin/bash

# Knowledge Workspace — Quick Start Script
# This script sets up the app after you've added Supabase credentials to .env.local

set -e

echo "🚀 Knowledge Workspace — Quick Start"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found"
    echo "Please create it with your Supabase credentials"
    echo "See SETUP.md for instructions"
    exit 1
fi

# Check if required env vars are set
if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Install dependencies (if node_modules doesn't exist)
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    echo ""
fi

# Push database schema
echo "🗄️  Pushing database schema..."
npx dotenv -e .env.local -- npx drizzle-kit push
echo ""

# Done!
echo "✅ Setup complete!"
echo ""
echo "🎉 Ready to start developing:"
echo ""
echo "   npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "Next steps:"
echo "  1. Sign up at /signup"
echo "  2. Create pages in /workspace"
echo "  3. Check Supabase dashboard to see your data"
echo ""
