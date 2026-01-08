/**
 * Scraper for boss.az
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { parseJobDate, isWithinDays } = require('../utils');

/**
 * Search jobs on boss.az
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of job objects
 */
async function searchBossAZ(query) {
  const jobs = [];
  
  try {
    // boss.az uses search in URL format: https://boss.az/vacancies?search=query
    // Try multiple possible URL formats
    const searchUrl = `https://www.boss.az/vacancies?search=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'az,en;q=0.9',
        'Referer': 'https://www.boss.az/'
      },
      timeout: 15000,
      maxRedirects: 5
    });
    
    const $ = cheerio.load(response.data);
    
    // Parse job listings - adjust selectors based on actual site structure
    $('.vacancies-list .vacancy-item, .job-item, article.vacancy, .vacancy-card').each((i, element) => {
      try {
        const $el = $(element);
        
        // Extract job details - multiple possible selectors
        const title = $el.find('.vacancy-title, .job-title, h2 a, h3 a, .title a').first().text().trim() ||
                     $el.find('a[href*="/vacancies/"]').first().text().trim();
        
        const link = $el.find('.vacancy-title a, .job-title a, h2 a, h3 a, .title a').first().attr('href') ||
                    $el.find('a[href*="/vacancies/"]').first().attr('href');
        
        const company = $el.find('.company-name, .vacancy-company, .employer-name').text().trim();
        
        const location = $el.find('.vacancy-location, .location, .city').text().trim();
        
        const dateText = $el.find('.vacancy-date, .date, .published-date, time').text().trim() ||
                        $el.find('.vacancy-date, .date, .published-date, time').attr('datetime');
        
        if (title && link) {
          const fullLink = link.startsWith('http') ? link : `https://boss.az${link}`;
          
          // Parse and filter by date
          const datePosted = parseJobDate(dateText);
          
          // Only include jobs from last 30 days or if date cannot be determined (to be safe)
          if (!datePosted || isWithinDays(datePosted, 30)) {
            jobs.push({
              title,
              company: company || 'N/A',
              location: location || 'Azerbaijan',
              datePosted: datePosted ? datePosted.toISOString() : null,
              link: fullLink,
              source: 'boss.az'
            });
          }
        }
      } catch (err) {
        // Skip individual job parsing errors
        console.error('Error parsing job item on boss.az:', err.message);
      }
    });
    
  } catch (error) {
    console.error('Error scraping boss.az:', error.message);
  }
  
  return jobs;
}

module.exports = searchBossAZ;

