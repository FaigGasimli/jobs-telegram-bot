#!/bin/bash

# Start script for Azerbaijan Jobs Bot
# Makes sure everything is set up before starting

echo "🤖 Azerbaijan Jobs Bot Startup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js v18+ from https://nodejs.org"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version must be 18 or higher"
    echo "Current version: $(node -v)"
    echo "Please upgrade from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from template..."
    
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env file"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env and add your TELEGRAM_BOT_TOKEN"
        echo "Get your token from @BotFather on Telegram"
        echo ""
        read -p "Press Enter after you've added your token to .env..."
    else
        echo "❌ Error: env.example not found"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    
    echo "✅ Dependencies installed"
fi

# Check if token is set
if grep -q "your_bot_token_here" .env; then
    echo ""
    echo "❌ Error: TELEGRAM_BOT_TOKEN is not set in .env"
    echo "Please edit .env and add your token from @BotFather"
    exit 1
fi

echo ""
echo "🚀 Starting bot..."
echo ""
echo "Press Ctrl+C to stop"
echo "======================================"
echo ""

# Start the bot
node index.js

