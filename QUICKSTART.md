# ⚡ Quick Start Guide

Get your bot running in **5 minutes**!

## For Windows Users

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org) (get LTS version)
   - Run installer, click Next → Next → Install
   - Verify: Open PowerShell and type `node --version`

2. **Get Bot Token**
   - Open Telegram
   - Search for `@BotFather`
   - Send `/newbot`
   - Follow instructions
   - **Copy the token** (looks like: `123456:ABCdef...`)

3. **Setup Project**
   ```powershell
   # In the project folder
   copy env.example .env
   notepad .env
   # Paste your token, save and close
   ```

4. **Start Bot**
   ```powershell
   npm install
   npm start
   ```
   
   **OR double-click** `start.bat`

## For Mac/Linux Users

1. **Install Node.js**
   ```bash
   # Mac (with Homebrew)
   brew install node
   
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify
   node --version
   ```

2. **Get Bot Token**
   - Open Telegram
   - Search for `@BotFather`
   - Send `/newbot`
   - Follow instructions
   - **Copy the token**

3. **Setup Project**
   ```bash
   # In the project folder
   cp env.example .env
   nano .env
   # Paste your token, save (Ctrl+X, Y, Enter)
   ```

4. **Start Bot**
   ```bash
   chmod +x start.sh  # Make script executable
   ./start.sh
   ```
   
   **OR**
   
   ```bash
   npm install
   npm start
   ```

## Verify It Works

1. Open Telegram
2. Search for your bot (by username you created)
3. Click **Start** or send `/start`
4. Send: `Frontend Developer`
5. Wait for job listings! 🎉

## What if it doesn't work?

### "TELEGRAM_BOT_TOKEN is not set"
→ Edit `.env` file and add your token from BotFather

### "npm: command not found"
→ Install Node.js from [nodejs.org](https://nodejs.org)

### Bot doesn't respond in Telegram
→ Check the terminal - is it showing "Bot is running"?
→ Is your token correct in `.env`?

### "No jobs found"
→ Try different search terms
→ This is normal - websites might be temporarily down

## Next Steps

Once it works locally:

1. **Deploy online** (see [DEPLOYMENT.md](DEPLOYMENT.md))
   - Railway (easiest)
   - Render
   - Your own server

2. **Customize**
   - Edit messages in `index.js`
   - Add more job sites in `scrapers/`

3. **Share**
   - Give bot username to friends
   - Post on social media

## Commands Reference

```bash
# Install dependencies
npm install

# Start bot
npm start

# Test scrapers only
node test-scraper.js

# Check for updates
npm outdated

# Update packages
npm update
```

## Files You Should Edit

| File | What to Change |
|------|----------------|
| `.env` | Add your bot token |
| `index.js` | Customize messages, add features |
| `scrapers/*.js` | Fix selectors if sites change |

## Files You Should NOT Edit

- `node_modules/` - Auto-generated
- `package-lock.json` - Auto-generated

## Getting Help

1. Read [README.md](README.md) for full documentation
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for hosting
3. See [CONTRIBUTING.md](CONTRIBUTING.md) to add features
4. Open an issue on GitHub

---

## 🎯 TL;DR - Absolute Minimum

**Windows:**
```powershell
npm install
copy env.example .env
notepad .env  # Add token
npm start
```

**Mac/Linux:**
```bash
npm install
cp env.example .env
nano .env  # Add token
npm start
```

**That's it! Your bot is running! 🚀**

