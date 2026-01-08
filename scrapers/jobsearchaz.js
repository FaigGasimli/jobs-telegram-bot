/**
 * Scraper for jobsearch.az
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { parseJobDate, isWithinDays } = require('../utils');

/**
 * Search jobs on jobsearch.az
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of job objects
 */
async function searchJobsearchAZ(query) {
  const jobs = [];
  
  try {
    // jobsearch.az search URL format
    const searchUrl = `https://jobsearch.az/vacancies?search=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Parse job listings - adjust selectors based on actual site structure
    $('.job-listing, .vacancy-item, article.vacancy, .job-card, .search-result-item').each((i, element) => {
      try {
        const $el = $(element);
        
        // Extract job details
        const title = $el.find('.job-title, h2 a, h3 a, .vacancy-name, .title a').first().text().trim() ||
                     $el.find('a[href*="/vacancy/"], a[href*="/job/"]').first().text().trim();
        
        const link = $el.find('.job-title a, h2 a, h3 a, .vacancy-name a, .title a').first().attr('href') ||
                    $el.find('a[href*="/vacancy/"], a[href*="/job/"]').first().attr('href');
        
        const company = $el.find('.company, .employer, .company-name').text().trim();
        
        const location = $el.find('.location, .city, .region').text().trim();
        
        const dateText = $el.find('.date, .posted, .publish-date, time').text().trim() ||
                        $el.find('.date, .posted, .publish-date, time').attr('datetime');
        
        if (title && link) {
          const fullLink = link.startsWith('http') ? link : `https://jobsearch.az${link}`;
          
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
              source: 'jobsearch.az'
            });
          }
        }
      } catch (err) {
        console.error('Error parsing job item on jobsearch.az:', err.message);
      }
    });
    
  } catch (error) {
    console.error('Error scraping jobsearch.az:', error.message);
  }
  
  return jobs;
}

module.exports = searchJobsearchAZ;

