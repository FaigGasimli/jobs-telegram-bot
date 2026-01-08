/**
 * Scraper for jobs.glorri.az
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { parseJobDate, isWithinDays } = require('../utils');

/**
 * Search jobs on jobs.glorri.az
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of job objects
 */
async function searchGlorriAZ(query) {
  const jobs = [];
  
  try {
    const searchUrl = `https://jobs.glorri.az/vacancies?search=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'az,en;q=0.9'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    
    $('.vacancy-list .vacancy-item, .job-item, article.vacancy, .vacancy-card, .vacancy, .job-list-item, .item').each((i, element) => {
      try {
        const $el = $(element);
        
        const title = $el.find('.vacancy-title, .job-title, h2 a, h3 a, .title a, .name a, a.title').first().text().trim() ||
                     $el.find('a[href*="vacancy"], a[href*="vacancies"]').first().text().trim();
        
        const link = $el.find('.vacancy-title a, .job-title a, h2 a, h3 a, .title a, .name a').first().attr('href') ||
                    $el.find('a[href*="vacancy"], a[href*="vacancies"]').first().attr('href');
        
        const company = $el.find('.company-name, .company, .employer, .vacancy-company, .firm').text().trim();
        const location = $el.find('.location, .city, .vacancy-location, .region, .address').text().trim();
        const dateText = $el.find('.date, .posted-date, .vacancy-date, time, .published, .created-at').text().trim();
        
        if (title && link && title.length > 2) {
          const fullLink = link.startsWith('http') ? link : `https://jobs.glorri.az${link}`;
          const datePosted = parseJobDate(dateText);
          
          if (!datePosted || isWithinDays(datePosted, 30)) {
            jobs.push({
              title,
              company: company || 'N/A',
              location: location || 'Bakı',
              datePosted: datePosted ? datePosted.toISOString() : null,
              link: fullLink,
              source: 'jobs.glorri.az'
            });
          }
        }
      } catch (err) {
        // Skip individual errors
      }
    });
    
  } catch (error) {
    console.error('Error scraping jobs.glorri.az:', error.message);
  }
  
  return jobs;
}

module.exports = searchGlorriAZ;

