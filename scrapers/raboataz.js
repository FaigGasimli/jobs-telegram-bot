/**
 * Scraper for rabota.az (real working Azerbaijani job site)
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { parseJobDate, isWithinDays } = require('../utils');

/**
 * Search jobs on rabota.az
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of job objects
 */
async function searchRabotaAZ(query) {
  const jobs = [];
  
  try {
    // rabota.az search URL format
    const searchUrl = `https://rabota.az/vacancies?search=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'az,en;q=0.9',
        'Referer': 'https://rabota.az/'
      },
      timeout: 15000,
      maxRedirects: 5
    });
    
    const $ = cheerio.load(response.data);
    
    // Parse job listings - adjust selectors based on actual site structure
    $('.vacancies-list .vacancy, .job-item, article, .vacancy-item, .job-list-item').each((i, element) => {
      try {
        const $el = $(element);
        
        // Try multiple possible selectors
        const title = $el.find('.vacancy-title, .job-title, h2, h3, .title, a.vacancy-link').first().text().trim() ||
                     $el.find('a').first().text().trim();
        
        const link = $el.find('.vacancy-title a, .job-title a, h2 a, h3 a, a.vacancy-link').first().attr('href') ||
                    $el.find('a').first().attr('href');
        
        const company = $el.find('.company-name, .company, .employer, .vacancy-company').text().trim();
        
        const location = $el.find('.location, .city, .vacancy-location, .region').text().trim();
        
        const dateText = $el.find('.date, .posted-date, .vacancy-date, time, .published-date').text().trim() ||
                        $el.find('.date, .posted-date, .vacancy-date, time, .published-date').attr('datetime');
        
        if (title && link && title.length > 3) {
          const fullLink = link.startsWith('http') ? link : `https://rabota.az${link}`;
          
          // Parse and filter by date
          const datePosted = parseJobDate(dateText);
          
          // Only include jobs from last 30 days or if date cannot be determined
          if (!datePosted || isWithinDays(datePosted, 30)) {
            jobs.push({
              title,
              company: company || 'N/A',
              location: location || 'Azerbaijan',
              datePosted: datePosted ? datePosted.toISOString() : null,
              link: fullLink,
              source: 'rabota.az'
            });
          }
        }
      } catch (err) {
        console.error('Error parsing job item on rabota.az:', err.message);
      }
    });
    
  } catch (error) {
    console.error('Error scraping rabota.az:', error.message);
  }
  
  return jobs;
}

module.exports = searchRabotaAZ;

