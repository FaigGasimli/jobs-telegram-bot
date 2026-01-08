@echo off
REM Start script for Azerbaijan Jobs Bot (Windows)
REM Makes sure everything is set up before starting

echo.
echo ========================================
echo    Azerbaijan Jobs Bot Startup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js v18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js version:
node -v

REM Check if .env exists
if not exist .env (
    echo.
    echo [WARNING] .env file not found
    echo Creating .env from template...
    
    if exist env.example (
        copy env.example .env >nul
        echo [OK] Created .env file
        echo.
        echo [IMPORTANT] Edit .env and add your TELEGRAM_BOT_TOKEN
        echo Get your token from @BotFather on Telegram
        echo.
        pause
    ) else (
        echo [ERROR] env.example not found
        pause
        exit /b 1
    )
)

REM Check if node_modules exists
if not exist node_modules (
    echo.
    echo [INFO] Installing dependencies...
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    
    echo [OK] Dependencies installed
)

REM Check if token is set
findstr /C:"your_bot_token_here" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [ERROR] TELEGRAM_BOT_TOKEN is not set in .env
    echo Please edit .env and add your token from @BotFather
    pause
    exit /b 1
)

echo.
echo [INFO] Starting bot...
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

REM Start the bot
node index.js

