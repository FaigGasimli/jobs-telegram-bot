# 🚀 START HERE

**Welcome to the Azerbaijan Jobs Telegram Bot!**

This document will guide you from zero to a fully working bot in **5 minutes**.

---

## 📖 What Is This?

A Telegram bot that searches for job vacancies across **5 Azerbaijani job sites** and returns results posted in the **last 30 days**.

**Sites searched:**
- boss.az
- joblist.az  
- jobsearch.az
- LinkedIn (Azerbaijan)
- Indeed (Azerbaijan)

---

## ⚡ Quick Start (Choose Your Path)

### 🟢 Path A: I Want to Run It NOW (5 minutes)

1. **Install Node.js** (if not installed)
   - Download from [nodejs.org](https://nodejs.org)
   - Choose LTS version
   - Run installer

2. **Get Bot Token**
   - Open Telegram → Search `@BotFather`
   - Send `/newbot`
   - Follow instructions
   - Copy the token (looks like `123456:ABCdef...`)

3. **Setup & Run**
   ```bash
   # Windows (PowerShell)
   npm install
   copy env.example .env
   notepad .env
   # Paste token, save, close
   npm start
   
   # Mac/Linux
   npm install
   cp env.example .env
   nano .env
   # Paste token, Ctrl+X, Y, Enter
   npm start
   ```

4. **Test**
   - Open Telegram
   - Find your bot
   - Send `/start`
   - Send `Frontend Developer`
   - Get results! 🎉

**✅ Done!** Your bot is working locally.

---

### 🟡 Path B: I Want to Deploy It Online (15 minutes)

**After completing Path A:**

1. Push code to GitHub (if not already)
2. Go to [railway.app](https://railway.app)
3. Sign up with GitHub
4. Create "New Project" → "Deploy from GitHub repo"
5. Select your repository
6. Add environment variable:
   - Key: `TELEGRAM_BOT_TOKEN`
   - Value: Your bot token
7. Deploy!

**✅ Done!** Your bot is now online 24/7.

---

### 🔵 Path C: I Want to Understand Everything (30+ minutes)

Read in this order:

1. **This file** (you are here) ← Overview
2. **[README.md](README.md)** ← Complete documentation
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** ← Technical details
4. **[CONTRIBUTING.md](CONTRIBUTING.md)** ← Customization guide

Then deploy using **[DEPLOYMENT.md](DEPLOYMENT.md)**.

---

## 📁 Project Files Explained

### 🔴 Critical Files (Don't Delete!)

| File | Purpose |
|------|---------|
| `index.js` | Main bot code |
| `utils.js` | Helper functions |
| `scrapers/*.js` | Site scrapers |
| `package.json` | Dependencies list |

### 🟡 Configuration Files

| File | Purpose |
|------|---------|
| `env.example` | Template for `.env` |
| `.env` | Your bot token (create this) |
| `.gitignore` | Files to ignore in Git |

### 🟢 Documentation (For You!)

| File | What It Covers |
|------|----------------|
| `README.md` | Everything about the project |
| `QUICKSTART.md` | 5-minute setup |
| `INSTALLATION.md` | Detailed setup guide |
| `DEPLOYMENT.md` | How to deploy online |
| `ARCHITECTURE.md` | Technical architecture |
| `CONTRIBUTING.md` | How to customize |
| `SETUP_CHECKLIST.md` | Step-by-step checklist |
| `PROJECT_SUMMARY.md` | Executive summary |
| `CHANGELOG.md` | Version history |

### 🔵 Helper Files

| File | Purpose |
|------|---------|
| `start.sh` | Startup script (Mac/Linux) |
| `start.bat` | Startup script (Windows) |
| `test-scraper.js` | Test scrapers |
| `Procfile` | Heroku config |
| `LICENSE` | MIT License |

---

## 🎯 What Can I Do?

### As a User

```
Send to bot:
- /start → Welcome message
- /help → Help text
- /stats → Statistics
- "Frontend Developer" → Search results
```

### As a Developer

```bash
# Test scrapers
node test-scraper.js

# Start bot
npm start

# Deploy (after git push)
# Railway/Render auto-deploys
```

---

## 🔧 Common Tasks

### Change Bot Messages

Edit `index.js`, find these sections:
```javascript
const welcomeMessage = `...`    // /start message
const helpMessage = `...`        // /help message
bot.sendMessage(chatId, '...')  // Other messages
```

### Add New Job Site

1. Create `scrapers/newsite.js` (copy from `bossaz.js`)
2. Update URL and CSS selectors
3. Add to `scrapers/index.js`
4. Test with `node test-scraper.js`

### Change Cache Duration

In `index.js`:
```javascript
const cache = new NodeCache({ 
  stdTTL: 600  // ← Change this (seconds)
});
```

### Change Results Per Page

In `index.js`:
```javascript
const pageSize = 10;  // ← Change this
```

---

## 🐛 Troubleshooting

### Bot doesn't start
```
❌ Error: TELEGRAM_BOT_TOKEN is not set
✅ Solution: Create .env file with your token
```

### Bot doesn't respond on Telegram
```
❌ Bot shows offline
✅ Solutions:
  1. Check bot is running (terminal shows "Bot is running")
  2. Send /start to bot first
  3. Check token is correct
```

### No jobs found
```
❌ "No jobs found" message
✅ This is normal sometimes:
  - Try different search terms
  - Some sites may be down
  - Check console for errors
```

### npm: command not found
```
❌ "npm: command not found"
✅ Solution: Install Node.js from nodejs.org
```

---

## 📚 Learning Resources

### New to Node.js?
- [Node.js Getting Started](https://nodejs.org/en/docs/guides/getting-started-guide/)
- [JavaScript Tutorial](https://javascript.info/)

### New to Telegram Bots?
- [Telegram Bot Tutorial](https://core.telegram.org/bots/tutorial)
- [Bot API Documentation](https://core.telegram.org/bots/api)

### New to Web Scraping?
- [Cheerio Tutorial](https://zetcode.com/javascript/cheerio/)
- [Web Scraping Best Practices](https://www.scrapingbee.com/blog/web-scraping-best-practices/)

### New to Git/GitHub?
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Basics](https://guides.github.com/activities/hello-world/)

---

## 🎓 Next Steps

### For Beginners
1. ✅ Get bot running locally (Path A)
2. ✅ Understand what each file does
3. ✅ Deploy online (Path B)
4. ✅ Share with friends
5. ✅ Read README.md for details

### For Developers
1. ✅ Review architecture (ARCHITECTURE.md)
2. ✅ Customize messages
3. ✅ Add new features
4. ✅ Contribute improvements
5. ✅ Deploy to production

### For Everyone
1. ✅ Use the bot to find jobs!
2. ✅ Share feedback
3. ✅ Report bugs
4. ✅ Suggest features
5. ✅ Star on GitHub ⭐

---

## 💡 Pro Tips

1. **Test locally first** before deploying
2. **Keep token secret** - never commit .env
3. **Check logs** when something breaks
4. **Read error messages** - they help!
5. **Start simple** - customize later

---

## ❓ FAQ

**Q: Do I need to pay for hosting?**  
A: No! Railway and Render have free tiers.

**Q: Can I customize the bot?**  
A: Yes! Edit `index.js` for messages, add scrapers for sites.

**Q: Will scrapers break when sites update?**  
A: Possibly. Update CSS selectors when needed.

**Q: Can I use this for commercial purposes?**  
A: Yes! MIT License allows it.

**Q: How do I update the bot?**  
A: `git pull`, `npm install`, restart bot.

**Q: Can I add more job sites?**  
A: Yes! See CONTRIBUTING.md for guide.

**Q: Is my data collected?**  
A: Only chat.id for stats (optional). No personal data.

**Q: Why did my bot stop working?**  
A: Check logs. Usually site structure changes or network issues.

---

## 🆘 Getting Help

**Stuck? Try this order:**

1. ✅ Check troubleshooting section above
2. ✅ Read relevant documentation file
3. ✅ Look at console logs/errors
4. ✅ Search GitHub issues
5. ✅ Open new GitHub issue
6. ✅ Ask in discussions

**When asking for help, include:**
- What you're trying to do
- What happened instead
- Error messages (if any)
- Your OS and Node.js version

---

## ✅ Success Checklist

Your bot is ready when:

- [ ] `npm start` runs without errors
- [ ] Bot responds to `/start` on Telegram
- [ ] Search returns job results
- [ ] Inline buttons open job pages
- [ ] No errors in console

**All checked? Congratulations! 🎉**

---

## 🎊 You're Ready!

Pick your path above and get started:

- **Want it working now?** → Path A (5 min)
- **Want it online 24/7?** → Path B (15 min)
- **Want to understand everything?** → Path C (30+ min)

**Questions?** Open an issue on GitHub.

**Success?** Star the repo! ⭐

---

**Made with ❤️ for the Azerbaijani job market**

**Happy coding! 🚀**

---

## 📞 Quick Links

- [📖 Full Documentation](README.md)
- [⚡ 5-Min Setup](QUICKSTART.md)
- [🚢 Deploy Online](DEPLOYMENT.md)
- [🏗️ Architecture](ARCHITECTURE.md)
- [🤝 Contribute](CONTRIBUTING.md)
- [✅ Checklist](SETUP_CHECKLIST.md)

**Now go build something awesome! 🎯**

