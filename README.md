# 🤖 Azerbaijan Jobs Telegram Bot

A fully functional Telegram bot that searches for job vacancies across multiple Azerbaijani job sites and returns all results posted in the last 30 days.

## 🌟 Features

- **Multi-site Search**: Scrapes from boss.az, joblist.az, jobsearch.az, LinkedIn, and Indeed
- **Smart Date Filtering**: Returns only jobs posted in the last 30 days
- **Parallel Scraping**: Searches all sites simultaneously for fast results
- **Caching**: Caches results for 10 minutes to reduce load and improve performance
- **Inline Buttons**: Each job has a "View Job" button for easy access
- **Pagination**: Handles large result sets gracefully
- **Error Resilient**: Continues working even if some sites fail
- **Statistics**: Track usage with the `/stats` command
- **Azerbaijani Language**: User-friendly messages in Azerbaijani

## 📋 Requirements

- Node.js v18 or higher
- npm or yarn
- A Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

## 🚀 Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` and add your Telegram bot token:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
BOT_MODE=polling
```

**How to get a bot token:**
1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the token and paste it into your `.env` file

### 3. Run Locally

Start the bot:

```bash
npm start
```

You should see:
```
✅ Bot is running! Send it a message on Telegram.
📝 Press Ctrl+C to stop the bot.
```

### 4. Test the Bot

Open Telegram and:
1. Search for your bot by username
2. Send `/start` to begin
3. Send a job query like "Frontend Developer"
4. Wait for results!

## 📦 Project Structure

```
jobs-telegram-bot/
├── index.js                 # Main bot file
├── utils.js                 # Utility functions (date parsing, formatting)
├── package.json             # Dependencies
├── env.example              # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── scrapers/
    ├── index.js            # Central scraper aggregator
    ├── bossaz.js          # boss.az scraper
    ├── joblistaz.js       # joblist.az scraper
    ├── jobsearchaz.js     # jobsearch.az scraper
    ├── linkedin.js        # LinkedIn scraper
    └── indeed.js          # Indeed scraper
```

## 🎯 Usage

### Available Commands

- `/start` - Start the bot and see welcome message
- `/help` - Get help and usage instructions
- `/stats` - View bot statistics (admin feature)

### Searching for Jobs

Simply send a text message with the job title you're looking for:

**Examples:**
- "Frontend Developer"
- "React Developer"
- "Mühasib"
- "Marketing Manager"
- "Satış meneceri"

The bot will:
1. Search all configured job sites in parallel
2. Filter results to show only jobs from the last 30 days
3. Remove duplicates
4. Send all matching jobs with inline "View Job" buttons

## 🌐 Supported Job Sites

| Site | Status | Notes |
|------|--------|-------|
| boss.az | ✅ Active | Primary Azerbaijani job site |
| joblist.az | ✅ Active | Popular job listing site |
| jobsearch.az | ✅ Active | Job search aggregator |
| LinkedIn | ⚠️ Limited | Has anti-scraping measures, may have limited results |
| Indeed | ✅ Active | Indeed Azerbaijan region |

## 🚢 Deployment Options

### Option 1: Railway (Recommended)

1. Create account on [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Add environment variable:
   - `TELEGRAM_BOT_TOKEN`: Your bot token
5. Deploy!

Railway will automatically detect Node.js and run `npm start`.

### Option 2: Render

1. Create account on [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variable:
   - `TELEGRAM_BOT_TOKEN`: Your bot token
6. Deploy!

### Option 3: Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set config: `heroku config:set TELEGRAM_BOT_TOKEN=your_token_here`
5. Deploy:
   ```bash
   git push heroku main
   ```

### Option 4: VPS (DigitalOcean, AWS, etc.)

1. SSH into your server
2. Install Node.js v18+:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Clone repository:
   ```bash
   git clone <your-repo-url>
   cd jobs-telegram-bot
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create `.env` file with your token
6. Install PM2 for process management:
   ```bash
   sudo npm install -g pm2
   pm2 start index.js --name "jobs-bot"
   pm2 save
   pm2 startup
   ```

## 🔧 Configuration

### Cache Settings

Modify cache duration in `index.js`:

```javascript
const cache = new NodeCache({ 
  stdTTL: 600,      // 10 minutes
  checkperiod: 120   // Check for expired keys every 2 minutes
});
```

### Pagination

Adjust results per page in `index.js`:

```javascript
const pageSize = 10; // Number of jobs to show before pagination
```

### Adding New Job Sites

To add a new job site:

1. Create a new scraper in `scrapers/` folder (e.g., `scrapers/newsite.js`)
2. Follow the pattern from existing scrapers
3. Export a function that returns an array of job objects
4. Import and add to `scrapers/index.js`
5. Add to `Promise.allSettled` array in `searchAllJobs` function

**Job object format:**
```javascript
{
  title: "Job Title",
  company: "Company Name",
  location: "City, Azerbaijan",
  datePosted: "2024-01-08T12:00:00.000Z", // ISO format
  link: "https://example.com/job/123",
  source: "website.com"
}
```

## 🛡️ Error Handling

The bot is designed to be resilient:

- **Site Failures**: If one site fails, others continue working
- **Network Errors**: Timeout set to 10-15 seconds per site
- **Rate Limiting**: Small delays between messages to avoid Telegram rate limits
- **Parsing Errors**: Individual job parsing errors don't stop the entire scrape
- **Cache**: Reduces load on job sites and improves response time

## 📊 Statistics

Track bot usage with the `/stats` command. Statistics include:

- Total searches performed
- Number of unique users
- Searches per user
- Cache statistics

**Note**: Statistics are stored in memory and reset on bot restart. For persistent stats, integrate a database.

## ⚠️ Important Notes

### Web Scraping Considerations

- **Legal**: Ensure you comply with each website's Terms of Service
- **Rate Limiting**: The bot includes delays to be respectful to servers
- **Selectors**: Website structures change; you may need to update CSS selectors
- **LinkedIn/Indeed**: These sites have strong anti-scraping measures; results may be limited

### Privacy

- The bot stores `chat.id` for statistics (optional)
- No personal data is collected or stored
- Query results are cached temporarily (10 minutes)

### Maintenance

Websites frequently update their HTML structure. If a scraper stops working:

1. Check the website's HTML structure
2. Update CSS selectors in the respective scraper file
3. Test the scraper individually

## 🐛 Troubleshooting

### Bot doesn't respond

1. Check if bot token is correct in `.env`
2. Verify bot is running: `npm start`
3. Check console for error messages
4. Ensure you've started the bot with `/start` command

### No jobs found

1. Try different search terms
2. Check if websites are accessible
3. Some sites may require VPN in certain regions
4. Check console logs for scraper errors

### Rate limiting errors

1. Increase delays between messages in `index.js`
2. Reduce `pageSize` to send fewer messages at once
3. Consider using webhook mode instead of polling

## 📝 Dependencies

- `node-telegram-bot-api` - Telegram Bot API wrapper
- `axios` - HTTP client for web requests
- `cheerio` - HTML parsing (jQuery-like)
- `dotenv` - Environment variable management
- `node-cache` - In-memory caching

## 🤝 Contributing

Contributions are welcome! To add features or fix bugs:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this bot for personal or commercial projects.

## 💡 Future Enhancements

Potential features to add:

- [ ] Database integration for persistent statistics
- [ ] User preferences (save favorite searches)
- [ ] Job alerts (notify users of new matching jobs)
- [ ] Salary filtering
- [ ] Remote job filtering
- [ ] Export results to PDF/CSV
- [ ] Multi-language support (English/Azerbaijani toggle)
- [ ] Admin panel for managing scrapers
- [ ] Job application tracking

## 📧 Support

If you encounter issues:

1. Check this README
2. Review console logs for errors
3. Verify website structure hasn't changed
4. Open an issue on GitHub

---

Made with ❤️ for the Azerbaijani job market

**Happy job hunting! 🎉**

