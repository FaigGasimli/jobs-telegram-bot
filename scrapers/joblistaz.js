/**
 * Scraper for joblist.az
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { parseJobDate, isWithinDays } = require('../utils');

/**
 * Search jobs on joblist.az
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of job objects
 */
async function searchJoblistAZ(query) {
  const jobs = [];
  
  try {
    // joblist.az search URL format
    const searchUrl = `https://joblist.az/vacancies?search=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Parse job listings - adjust selectors based on actual site structure
    $('.job-list .job-item, .vacancy-list .vacancy-item, article.job, .job-card').each((i, element) => {
      try {
        const $el = $(element);
        
        // Extract job details with multiple possible selectors
        const title = $el.find('.job-title, h2 a, h3 a, .title a').first().text().trim() ||
                     $el.find('a[href*="/vacancy/"], a[href*="/job/"]').first().text().trim();
        
        const link = $el.find('.job-title a, h2 a, h3 a, .title a').first().attr('href') ||
                    $el.find('a[href*="/vacancy/"], a[href*="/job/"]').first().attr('href');
        
        const company = $el.find('.company-name, .employer, .company').text().trim();
        
        const location = $el.find('.location, .city, .job-location').text().trim();
        
        const dateText = $el.find('.date, .published, .posted-date, time').text().trim() ||
                        $el.find('.date, .published, .posted-date, time').attr('datetime');
        
        if (title && link) {
          const fullLink = link.startsWith('http') ? link : `https://joblist.az${link}`;
          
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
              source: 'joblist.az'
            });
          }
        }
      } catch (err) {
        console.error('Error parsing job item on joblist.az:', err.message);
      }
    });
    
  } catch (error) {
    console.error('Error scraping joblist.az:', error.message);
  }
  
  return jobs;
}

module.exports = searchJoblistAZ;

