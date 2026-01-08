# 🤝 Contributing to Azerbaijan Jobs Bot

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug:

1. **Check existing issues** to see if it's already reported
2. **Create a new issue** with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node.js version)
   - Error messages/logs if any

### Suggesting Features

Have an idea for improvement?

1. **Open an issue** with:
   - Clear description of the feature
   - Use case (why is it needed?)
   - Possible implementation approach
2. **Wait for feedback** before starting implementation

### Adding New Job Sites

To add support for a new job site:

1. Create a new file in `scrapers/` folder:
   ```javascript
   // scrapers/newsite.js
   const axios = require('axios');
   const cheerio = require('cheerio');
   const { parseJobDate, isWithinDays } = require('../utils');

   async function searchNewSite(query) {
     const jobs = [];
     try {
       const url = `https://newsite.com/search?q=${encodeURIComponent(query)}`;
       const response = await axios.get(url, {
         headers: {
           'User-Agent': 'Mozilla/5.0...'
         },
         timeout: 10000
       });
       
       const $ = cheerio.load(response.data);
       
       $('.job-item').each((i, element) => {
         const $el = $(element);
         const title = $el.find('.title').text().trim();
         const link = $el.find('a').attr('href');
         const company = $el.find('.company').text().trim();
         const location = $el.find('.location').text().trim();
         const dateText = $el.find('.date').text().trim();
         
         if (title && link) {
           const datePosted = parseJobDate(dateText);
           if (!datePosted || isWithinDays(datePosted, 30)) {
             jobs.push({
               title,
               company: company || 'N/A',
               location: location || 'Azerbaijan',
               datePosted: datePosted ? datePosted.toISOString() : null,
               link: link.startsWith('http') ? link : `https://newsite.com${link}`,
               source: 'newsite.com'
             });
           }
         }
       });
     } catch (error) {
       console.error('Error scraping newsite.com:', error.message);
     }
     return jobs;
   }

   module.exports = searchNewSite;
   ```

2. Add to `scrapers/index.js`:
   ```javascript
   const searchNewSite = require('./newsite');
   
   // Add to Promise.allSettled array
   const results = await Promise.allSettled([
     // ... existing scrapers
     searchNewSite(query)
   ]);
   
   // Add to sources array
   const sources = [..., 'newsite.com'];
   ```

3. Test thoroughly before submitting PR

### Code Style Guidelines

- **Use ES6+ features**: async/await, arrow functions, template literals
- **Error handling**: Always wrap scraping code in try-catch
- **Comments**: Add comments for complex logic
- **Naming**: Use descriptive variable names
- **Formatting**: Follow existing code style
- **Console logs**: Use emoji prefixes for visibility (✅ ❌ 🔍 📊)

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/add-newsite-scraper
   ```
3. **Make your changes**
4. **Test thoroughly**:
   - Run the bot locally
   - Test with various search queries
   - Verify error handling
5. **Commit with clear messages**:
   ```bash
   git commit -m "Add scraper for newsite.com"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/add-newsite-scraper
   ```
7. **Create Pull Request** with:
   - Description of changes
   - Why the change is needed
   - Testing performed
   - Screenshots/logs if applicable

## Testing Scrapers

To test a single scraper:

```javascript
// test.js
const searchBossAZ = require('./scrapers/bossaz');

(async () => {
  const jobs = await searchBossAZ('developer');
  console.log(`Found ${jobs.length} jobs`);
  console.log(jobs);
})();
```

Run: `node test.js`

## Development Tips

### Debugging Scraping Issues

1. **Check HTML structure**:
   - Open the job site in browser
   - Right-click → Inspect
   - Find job listing elements
   - Note CSS selectors

2. **Test selectors in console**:
   ```javascript
   document.querySelectorAll('.job-item').length
   ```

3. **Handle multiple selectors**:
   ```javascript
   const title = $el.find('.title, .job-title, h2 a').first().text().trim();
   ```

4. **Log for debugging**:
   ```javascript
   console.log('Title:', title);
   console.log('Link:', link);
   ```

### Date Parsing

Use the `parseJobDate` utility function:

```javascript
const datePosted = parseJobDate(dateText);
```

It handles:
- "bugün" / "today"
- "dünən" / "yesterday"  
- "3 gün əvvəl" / "3 days ago"
- "2 saat əvvəl" / "2 hours ago"
- DD.MM.YYYY, DD/MM/YYYY
- ISO dates

### Handling Rate Limits

If a site rate limits:

1. Add delays between requests:
   ```javascript
   await sleep(1000); // 1 second
   ```

2. Reduce concurrent requests
3. Add retry logic with exponential backoff

## Project Structure

```
jobs-telegram-bot/
├── index.js              # Main bot logic
├── utils.js              # Utility functions
├── package.json          # Dependencies
├── README.md            # Documentation
├── INSTALLATION.md      # Setup guide
├── CONTRIBUTING.md      # This file
└── scrapers/
    ├── index.js         # Aggregator
    ├── bossaz.js       # Boss.az scraper
    ├── joblistaz.js    # JobList.az scraper
    ├── jobsearchaz.js  # JobSearch.az scraper
    ├── linkedin.js     # LinkedIn scraper
    └── indeed.js       # Indeed scraper
```

## Useful Resources

- [node-telegram-bot-api docs](https://github.com/yagop/node-telegram-bot-api)
- [Cheerio docs](https://cheerio.js.org/)
- [Axios docs](https://axios-http.com/)
- [CSS Selectors reference](https://www.w3schools.com/cssref/css_selectors.asp)

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Read the README.md thoroughly

## Code of Conduct

- Be respectful and constructive
- Help others learn
- Follow best practices
- Respect website Terms of Service
- Don't spam or abuse APIs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**

