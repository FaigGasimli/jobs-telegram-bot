# 🚀 Quick Installation Guide

Follow these steps to get your Azerbaijan Jobs Bot running in minutes!

## Step 1: Install Node.js

Make sure you have Node.js v18 or higher installed.

**Check your version:**
```bash
node --version
```

**Don't have Node.js?** Download from [nodejs.org](https://nodejs.org/)

## Step 2: Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

This will install:
- `node-telegram-bot-api` - For Telegram bot functionality
- `axios` - For making HTTP requests
- `cheerio` - For parsing HTML
- `dotenv` - For environment variables
- `node-cache` - For caching results

## Step 3: Get Your Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Azerbaijan Jobs")
4. Choose a username (must end with 'bot', e.g., "azerbaijan_jobs_bot")
5. Copy the token you receive (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 4: Configure Environment

Create a `.env` file in the project root:

```bash
# On Windows (PowerShell)
copy env.example .env

# On Mac/Linux
cp env.example .env
```

Open `.env` in any text editor and add your token:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
BOT_MODE=polling
```

## Step 5: Start the Bot

Run the bot:

```bash
npm start
```

You should see:
```
🤖 Azerbaijan Jobs Bot is starting...
✅ Bot is running! Send it a message on Telegram.
📝 Press Ctrl+C to stop the bot.
```

## Step 6: Test Your Bot

1. Open Telegram
2. Search for your bot by username
3. Click "Start" or send `/start`
4. Send a job query like "Frontend Developer"
5. Wait for results! 🎉

## Troubleshooting

### Problem: "TELEGRAM_BOT_TOKEN is not set"
**Solution:** Make sure you created `.env` file and added your token correctly.

### Problem: Bot doesn't respond
**Solutions:**
1. Check if bot is running (terminal should show "Bot is running")
2. Verify token is correct
3. Make sure you started conversation with `/start`

### Problem: "npm: command not found"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Problem: No jobs found
**Solutions:**
1. Try different search terms
2. Check your internet connection
3. Some sites may be temporarily down - the bot will continue with working sites

### Problem: Rate limiting errors
**Solution:** Reduce the number of messages sent at once by editing `pageSize` in `index.js`

## Next Steps

- **Deploy online**: See README.md for deployment options (Railway, Render, Heroku)
- **Customize messages**: Edit messages in `index.js`
- **Add more sites**: Create new scrapers in `scrapers/` folder
- **Track statistics**: Use `/stats` command

## Need Help?

Check the main README.md for detailed documentation and deployment guides.

---

**You're all set! Happy job hunting! 🎊**

