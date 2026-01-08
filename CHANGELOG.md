# Changelog

All notable changes to the Azerbaijan Jobs Bot project will be documented in this file.

## [1.0.0] - 2024-01-08

### Initial Release 🎉

#### Features
- ✅ Multi-site job scraping
  - boss.az integration
  - joblist.az integration
  - jobsearch.az integration
  - LinkedIn jobs (Azerbaijan region)
  - Indeed jobs (Azerbaijan region)

- ✅ Telegram bot integration
  - `/start` command with welcome message
  - `/help` command for user guidance
  - `/stats` command for bot statistics
  - Free-text job search queries
  - Inline "View Job" buttons for each result

- ✅ Smart date filtering
  - Filters jobs posted within last 30 days
  - Parses multiple date formats (Azerbaijani and English)
  - Handles relative dates ("bugün", "today", "X gün əvvəl", etc.)

- ✅ Performance optimizations
  - Parallel scraping across all sites
  - 10-minute result caching
  - Deduplication of similar jobs
  - Graceful error handling per site

- ✅ User experience
  - Pagination for large result sets
  - Results sorted by date (newest first)
  - Azerbaijani language interface
  - Clear error messages
  - Typing indicators during search

- ✅ Developer experience
  - Modular scraper architecture
  - Easy to add new job sites
  - Comprehensive documentation
  - Multiple deployment options
  - Test script included

#### Documentation
- 📖 README.md - Complete project overview
- 📖 INSTALLATION.md - Detailed setup instructions
- 📖 DEPLOYMENT.md - Platform-specific deployment guides
- 📖 QUICKSTART.md - 5-minute getting started guide
- 📖 CONTRIBUTING.md - Guidelines for contributors
- 📖 CHANGELOG.md - This file

#### Scripts
- `start.sh` - Automated startup script (Mac/Linux)
- `start.bat` - Automated startup script (Windows)
- `test-scraper.js` - Test script for scrapers

#### Configuration
- `env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `Procfile` - Heroku deployment config

### Technical Details
- Node.js 18+ required
- Dependencies:
  - node-telegram-bot-api v0.64.0
  - axios v1.6.5
  - cheerio v1.0.0-rc.12
  - dotenv v16.3.1
  - node-cache v5.1.2

---

## Future Releases

### [1.1.0] - Planned
- [ ] Database integration for persistent stats
- [ ] User preferences system
- [ ] Job alert notifications
- [ ] Admin panel
- [ ] Webhook mode support

### [1.2.0] - Planned
- [ ] Advanced filtering (remote, salary, etc.)
- [ ] Multi-language support (EN/AZ toggle)
- [ ] Export results to PDF/CSV
- [ ] Job application tracking

---

## How to Update

### For Users
```bash
git pull origin main
npm install
pm2 restart jobs-bot  # if using PM2
```

### For Developers
Update your fork:
```bash
git remote add upstream https://github.com/original-repo/jobs-telegram-bot.git
git fetch upstream
git merge upstream/main
```

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new features (backwards-compatible)
- **PATCH** version for bug fixes (backwards-compatible)

---

## Release Notes Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing features

### Deprecated
- Features that will be removed

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

