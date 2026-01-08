# 🏗️ Architecture Documentation

Technical architecture and design decisions for the Azerbaijan Jobs Bot.

---

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         TELEGRAM USER                            │
│                     (Sends job search query)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TELEGRAM BOT API                            │
│                   (node-telegram-bot-api)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BOT CORE                                 │
│                        (index.js)                                │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Commands   │  │    Cache     │  │  Statistics  │          │
│  │  /start,etc  │  │ (node-cache) │  │  (in-memory) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SCRAPER AGGREGATOR                           │
│                   (scrapers/index.js)                            │
│                                                                   │
│              Parallel Execution (Promise.allSettled)             │
└─┬───────┬───────┬───────┬───────┬──────────────────────────────┘
  │       │       │       │       │
  ▼       ▼       ▼       ▼       ▼
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│Boss│ │Job │ │Job │ │Link│ │In- │
│.az │ │list│ │srch│ │edIn│ │deed│
└─┬──┘ └─┬──┘ └─┬──┘ └─┬──┘ └─┬──┘
  │      │      │      │      │
  │   (HTTP Requests - axios)   │
  │      │      │      │      │
  ▼      ▼      ▼      ▼      ▼
┌────────────────────────────────┐
│        JOB WEBSITES            │
│  (HTML Pages - Cheerio Parse)  │
└────────────────────────────────┘
```

---

## 📦 Component Breakdown

### 1. Bot Core (`index.js`)

**Responsibilities:**
- Initialize Telegram bot
- Handle user commands
- Manage message flow
- Cache management
- Statistics tracking
- Error handling

**Key Functions:**
```javascript
bot.onText(/\/start/)    // Welcome message
bot.onText(/\/help/)     // Help command
bot.onText(/\/stats/)    // Statistics
bot.on('message')        // Search handler
```

**Dependencies:**
- `node-telegram-bot-api` - Telegram integration
- `node-cache` - Result caching
- `dotenv` - Environment config

---

### 2. Scraper Aggregator (`scrapers/index.js`)

**Responsibilities:**
- Coordinate all scrapers
- Parallel execution
- Result aggregation
- Deduplication
- Sorting by date

**Flow:**
```javascript
searchAllJobs(query)
  → Promise.allSettled([...scrapers])
  → Collect results
  → Remove duplicates
  → Sort by date
  → Return unified array
```

**Performance:**
- Executes 5 scrapers in parallel
- Continues if individual scrapers fail
- Returns partial results on errors

---

### 3. Individual Scrapers (`scrapers/*.js`)

**Responsibilities:**
- Build search URL
- Make HTTP request
- Parse HTML response
- Extract job data
- Filter by date
- Return job objects

**Structure (all scrapers follow same pattern):**
```javascript
async function searchSite(query) {
  const jobs = [];
  try {
    // 1. Build URL
    const url = `${baseURL}?search=${encodeURIComponent(query)}`;
    
    // 2. HTTP Request
    const response = await axios.get(url, { headers, timeout });
    
    // 3. Parse HTML
    const $ = cheerio.load(response.data);
    
    // 4. Extract jobs
    $('.job-selector').each((i, el) => {
      // Extract: title, link, company, location, date
      // Filter by date
      jobs.push(jobObject);
    });
  } catch (error) {
    console.error('Scraper error:', error.message);
  }
  return jobs;
}
```

**Sites:**
- `bossaz.js` - boss.az scraper
- `joblistaz.js` - joblist.az scraper
- `jobsearchaz.js` - jobsearch.az scraper
- `linkedin.js` - LinkedIn scraper
- `indeed.js` - Indeed scraper

---

### 4. Utility Functions (`utils.js`)

**Responsibilities:**
- Date parsing (multiple formats)
- Date range validation
- Query normalization
- Message formatting
- Pagination helpers

**Key Functions:**

```javascript
parseJobDate(dateStr)
  → Handles: "bugün", "3 gün əvvəl", "DD.MM.YYYY", ISO dates
  → Returns: Date object or null

isWithinDays(date, days)
  → Check if date is within last N days
  → Returns: boolean

formatJobMessage(job)
  → Create formatted Telegram message
  → Returns: string with emoji

createJobButton(url)
  → Create inline button markup
  → Returns: Telegram keyboard object
```

---

## 🔄 Data Flow

### Complete Request Flow

```
1. USER SENDS MESSAGE
   "Frontend Developer"
   
2. BOT RECEIVES
   ↓
   Validate input (min 2 chars)
   ↓
   Normalize query ("frontend developer")
   ↓
   Check cache
   
3a. CACHE HIT                    3b. CACHE MISS
    ↓                                ↓
    Return cached results            Trigger scrapers
    ↓                                ↓
    Skip to step 5                   Parallel execution
                                     ↓
                                     Wait for all (or timeout)
                                     ↓
                                     Aggregate results
                                     ↓
                                     Deduplicate
                                     ↓
                                     Sort by date
                                     ↓
                                     Cache results (10 min)
                                     
4. FORMAT RESULTS
   ↓
   Create header message
   ↓
   For each job:
     - Format message
     - Create button
   ↓
   Paginate (10 per page)
   
5. SEND TO USER
   ↓
   Header → Job 1 → Job 2 → ... → Footer
   ↓
   Update statistics
   ↓
   Done ✓
```

---

## 🧩 Module Dependencies

```
index.js
├── scrapers/index.js
│   ├── scrapers/bossaz.js
│   │   ├── axios
│   │   ├── cheerio
│   │   └── utils.js
│   ├── scrapers/joblistaz.js
│   │   ├── axios
│   │   ├── cheerio
│   │   └── utils.js
│   ├── scrapers/jobsearchaz.js
│   │   ├── axios
│   │   ├── cheerio
│   │   └── utils.js
│   ├── scrapers/linkedin.js
│   │   ├── axios
│   │   ├── cheerio
│   │   └── utils.js
│   └── scrapers/indeed.js
│       ├── axios
│       ├── cheerio
│       └── utils.js
├── utils.js
├── node-telegram-bot-api
├── node-cache
└── dotenv
```

---

## 💾 Data Models

### Job Object
```javascript
{
  title: String,         // Required, job title
  company: String,       // Optional, company name
  location: String,      // Optional, job location
  datePosted: String,    // Optional, ISO date string
  link: String,          // Required, full URL
  source: String         // Required, website name
}
```

### Cache Entry
```javascript
{
  key: "normalized query",
  value: Job[],
  ttl: 600  // seconds
}
```

### Statistics
```javascript
{
  totalSearches: Number,
  uniqueUsers: Set<chatId>,
  searchesByUser: Map<chatId, count>
}
```

---

## 🔐 Configuration

### Environment Variables
```bash
TELEGRAM_BOT_TOKEN=required   # From @BotFather
BOT_MODE=polling              # Optional, default: polling
PORT=3000                     # Optional, for webhook mode
WEBHOOK_URL=url               # Optional, for webhook mode
```

### Constants (in code)
```javascript
const CACHE_TTL = 600;           // 10 minutes
const CACHE_CHECK_PERIOD = 120;  // 2 minutes
const PAGE_SIZE = 10;            // Jobs per page
const SCRAPER_TIMEOUT = 10000;   // 10 seconds
const DATE_FILTER_DAYS = 30;     // Last 30 days
```

---

## ⚡ Performance Optimizations

### 1. Parallel Scraping
```javascript
Promise.allSettled([
  scraper1(query),  // ← All execute
  scraper2(query),  //   simultaneously
  scraper3(query),  //   (not sequential)
  scraper4(query),
  scraper5(query)
])
```
**Impact:** 5x faster than sequential

### 2. Result Caching
```javascript
cache.set(query, results, 600)  // 10 min TTL
```
**Impact:** <1s response for repeated queries

### 3. Early Returns
```javascript
if (!query || query.length < 2) return;  // ← Validate early
```
**Impact:** Avoid unnecessary processing

### 4. Deduplication
```javascript
const key = `${title}|${link}`;
if (!seen.has(key)) { ... }
```
**Impact:** Reduce duplicate results

### 5. Pagination
```javascript
chunkArray(jobs, 10)  // Send in batches
```
**Impact:** Avoid rate limits, better UX

---

## 🛡️ Error Handling Strategy

### Multi-Level Error Handling

```
Level 1: Individual Job Parsing
  try { parseJob() } catch { skip job, continue }
  
Level 2: Site Scraper
  try { scrapeSite() } catch { log error, return [] }
  
Level 3: Scraper Aggregator
  Promise.allSettled()  // Never throws, returns status
  
Level 4: Bot Message Handler
  try { handleMessage() } catch { send error to user }
  
Level 5: Bot Polling
  bot.on('polling_error', log)
```

### Error Messages

**User-Facing:**
- Azerbaijani language
- Simple, actionable
- No technical details

**Developer-Facing:**
- Console logs with emoji
- Full error stack
- Site-specific errors

---

## 🔍 Monitoring & Logging

### Log Levels

```javascript
console.log('🔍 Searching...')     // Info
console.log('✅ Success')           // Success
console.error('❌ Error')           // Error
console.log('⚠️ Warning')          // Warning
console.log('📊 Stats')            // Statistics
```

### What We Log

1. **Bot Lifecycle**
   - Startup
   - Shutdown
   - Errors

2. **User Actions**
   - Commands used
   - Searches performed
   - (No personal data)

3. **Scraper Results**
   - Jobs found per site
   - Scraper failures
   - Total results

4. **Performance**
   - Cache hits/misses
   - Response times (implicit)

---

## 🔄 Deployment Architecture

### Polling Mode (Default)
```
[Bot Process] ←────→ [Telegram API]
     │               (Long polling)
     │
     └──→ [Job Sites]
```

**Pros:**
- Simple setup
- No webhook config
- Works anywhere

**Cons:**
- Slightly slower
- More server requests

### Webhook Mode (Optional)
```
[Telegram API] ──POST──→ [Your Server] ──→ [Bot Process]
                             │
                             └──→ [Job Sites]
```

**Pros:**
- Faster response
- Less overhead

**Cons:**
- Requires HTTPS
- More complex setup

---

## 🧪 Testing Strategy

### Unit Testing (Manual)
```bash
node test-scraper.js
```
Tests each scraper individually.

### Integration Testing (Manual)
1. Start bot
2. Send commands
3. Verify responses
4. Check logs

### Production Testing
- Monitor logs
- Track error rates
- User feedback

---

## 🔮 Scalability Considerations

### Current Limitations

1. **In-Memory Cache**
   - Lost on restart
   - Limited to single instance
   - **Solution:** Use Redis

2. **In-Memory Stats**
   - Lost on restart
   - **Solution:** Use database

3. **No Queue System**
   - Concurrent searches compete
   - **Solution:** Add job queue (Bull, BullMQ)

4. **No Rate Limiting**
   - Could hit Telegram limits
   - **Solution:** Implement queue + rate limiter

### Scaling Strategies

**Vertical (Better Hardware):**
- More RAM for cache
- Faster CPU for parsing
- Better network for scraping

**Horizontal (More Instances):**
- Multiple bot instances
- Load balancer
- Shared Redis cache
- Shared database

---

## 🎨 Design Decisions

### Why Cheerio over Puppeteer?
- ✅ Faster (no browser overhead)
- ✅ Less memory
- ✅ Simpler code
- ❌ Can't handle JavaScript-heavy sites
- **Decision:** Good enough for our target sites

### Why Polling over Webhooks?
- ✅ Easier setup
- ✅ Works anywhere
- ✅ No HTTPS required
- ❌ Slightly slower
- **Decision:** Better for beginners

### Why In-Memory Cache?
- ✅ Simple setup
- ✅ Fast
- ✅ No external dependencies
- ❌ Lost on restart
- **Decision:** Acceptable tradeoff for v1.0

### Why Parallel Scraping?
- ✅ 5x faster than sequential
- ✅ Better user experience
- ❌ More complex code
- **Decision:** Worth the complexity

---

## 📚 Code Standards

### File Organization
```
- One file per scraper
- Utilities in separate file
- Main bot logic in index.js
- Clear separation of concerns
```

### Naming Conventions
```javascript
// Functions: camelCase
searchBossAZ()
parseJobDate()

// Constants: UPPER_SNAKE_CASE
const CACHE_TTL = 600;

// Variables: camelCase
const jobList = [];
```

### Comment Style
```javascript
/**
 * Function description
 * @param {type} name - description
 * @returns {type} - description
 */
```

---

## 🔄 Update & Maintenance

### When Sites Change

1. **Identify** which scraper failed
2. **Inspect** website HTML
3. **Update** CSS selectors
4. **Test** with `test-scraper.js`
5. **Deploy** updated code

### Regular Maintenance

- **Weekly:** Check bot status
- **Monthly:** Update dependencies
- **Quarterly:** Review scraper accuracy
- **Yearly:** Major refactoring if needed

---

## 🎯 Success Metrics

### Technical
- ✅ Uptime: >99%
- ✅ Response time: <15s
- ✅ Error rate: <5%
- ✅ Cache hit rate: >50%

### User
- ✅ Jobs found rate: >80%
- ✅ Button click rate: >30%
- ✅ Repeat usage: >40%

---

## 📖 Further Reading

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Axios Documentation](https://axios-http.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Architecture Version:** 1.0  
**Last Updated:** January 8, 2024  
**Status:** Stable

