/**
 * Scraper for Indeed Jobs (Azerbaijan)
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { parseJobDate, isWithinDays } = require('../utils');

/**
 * Search jobs on Indeed (Azerbaijan region)
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of job objects
 */
async function searchIndeed(query) {
  const jobs = [];
  
  try {
    // Indeed Azerbaijan URL - fromage=30 filters for last 30 days
    // Try www.indeed.com with Azerbaijan location
    const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=Azerbaijan&fromage=30`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    
    // Parse job listings - Indeed's structure
    $('.job_seen_beacon, .jobsearch-SerpJobCard, .slider_item, .result, div[data-jk]').each((i, element) => {
      try {
        const $el = $(element);
        
        // Extract job details with various selector patterns
        const title = $el.find('h2.jobTitle span[title], .jobTitle a span[title]').attr('title') ||
                     $el.find('h2.jobTitle, .jobTitle').text().trim() ||
                     $el.find('a[data-jk]').text().trim();
        
        const jobKey = $el.attr('data-jk') || 
                      $el.find('a[data-jk]').attr('data-jk') ||
                      $el.find('h2.jobTitle a').attr('data-jk');
        
        const link = jobKey ? `https://az.indeed.com/viewjob?jk=${jobKey}` : 
                    ($el.find('h2.jobTitle a, .jobTitle a').attr('href') || '');
        
        const company = $el.find('span.companyName, .companyName').text().trim() ||
                       $el.find('[data-testid="company-name"]').text().trim();
        
        const location = $el.find('.companyLocation, [data-testid="text-location"]').text().trim();
        
        const dateText = $el.find('.date, span.date').text().trim() ||
                        $el.find('[data-testid="myJobsStateDate"]').text().trim();
        
        if (title && link) {
          const fullLink = link.startsWith('http') ? link : `https://www.indeed.com${link}`;
          
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
              source: 'Indeed'
            });
          }
        }
      } catch (err) {
        console.error('Error parsing job item on Indeed:', err.message);
      }
    });
    
  } catch (error) {
    console.error('Error scraping Indeed:', error.message);
  }
  
  return jobs;
}

module.exports = searchIndeed;

