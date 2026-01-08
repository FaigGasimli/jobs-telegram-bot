/**
 * Scraper for LinkedIn Jobs (Azerbaijan)
 * Note: LinkedIn has anti-scraping measures. This is a basic implementation.
 * For production, consider using LinkedIn's official API or a third-party service.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { parseJobDate, isWithinDays } = require('../utils');

/**
 * Search jobs on LinkedIn (Azerbaijan region)
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of job objects
 */
async function searchLinkedIn(query) {
  const jobs = [];
  
  try {
    // LinkedIn jobs search URL - location code for Azerbaijan
    // f_TPR=r2592000 filters for last 30 days
    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=Azerbaijan&f_TPR=r2592000`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    
    // Parse job listings - LinkedIn's structure for guest/public job search
    $('.base-card, .job-search-card, .jobs-search__results-list li').each((i, element) => {
      try {
        const $el = $(element);
        
        // Extract job details
        const title = $el.find('.base-search-card__title, h3.base-search-card__title').text().trim() ||
                     $el.find('.job-search-card__title').text().trim();
        
        const link = $el.find('a.base-card__full-link').attr('href') ||
                    $el.find('a[href*="/jobs/view/"]').attr('href');
        
        const company = $el.find('.base-search-card__subtitle, h4.base-search-card__subtitle').text().trim() ||
                       $el.find('.job-search-card__company-name').text().trim();
        
        const location = $el.find('.job-search-card__location').text().trim() ||
                        $el.find('.base-search-card__metadata span').first().text().trim();
        
        const dateText = $el.find('time').attr('datetime') ||
                        $el.find('.job-search-card__listdate').text().trim();
        
        if (title && link) {
          const fullLink = link.startsWith('http') ? link.split('?')[0] : `https://www.linkedin.com${link.split('?')[0]}`;
          
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
              source: 'LinkedIn'
            });
          }
        }
      } catch (err) {
        console.error('Error parsing job item on LinkedIn:', err.message);
      }
    });
    
  } catch (error) {
    console.error('Error scraping LinkedIn:', error.message);
    // LinkedIn has strong anti-scraping measures, so failures are expected
  }
  
  return jobs;
}

module.exports = searchLinkedIn;

