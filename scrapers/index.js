/**
 * Central scraper aggregator
 * Imports all individual scrapers and provides a unified search function
 */

// Import all scrapers
const searchLinkedIn = require('./linkedin');
const searchBusyAZ = require('./busyaz');
const searchWorkAZ = require('./workaz');
const searchHelloJobAZ = require('./hellojobaz');
const searchGlorriAZ = require('./glorriaz');
const searchHrinAZ = require('./hrinaz');
const searchJobsearchAZ = require('./jobsearchaz');
const searchJobuAZ = require('./jobuaz');
// Legacy scrapers (may not work)
const searchBossAZ = require('./bossaz');
const searchJoblistAZ = require('./joblistaz');
const searchIndeed = require('./indeed');
const searchRabotaAZ = require('./raboataz');

/**
 * Search all job sites in parallel
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of all jobs from all sources
 */
async function searchAllJobs(query) {
  console.log(`🔍 Searching for: "${query}"`);
  
  // Run all scrapers in parallel for better performance
  const results = await Promise.allSettled([
    searchBusyAZ(query),         // 🇦🇿 busy.az
    searchWorkAZ(query),         // 🇦🇿 work.az
    searchHelloJobAZ(query),     // 🇦🇿 hellojob.az
    searchGlorriAZ(query),       // 🇦🇿 jobs.glorri.az
    searchHrinAZ(query),         // 🇦🇿 hrin.az
    searchJobsearchAZ(query),    // 🇦🇿 jobsearch.az
    searchJobuAZ(query),         // 🇦🇿 jobu.az
    searchLinkedIn(query),       // 🌐 LinkedIn (works well)
    searchRabotaAZ(query),       // 🇦🇿 rabota.az (if exists)
    searchBossAZ(query),         // 🇦🇿 boss.az (legacy)
    searchJoblistAZ(query),      // 🇦🇿 joblist.az (legacy)
    searchIndeed(query)          // 🌐 Indeed (may be blocked)
  ]);
  
  // Combine all successful results
  const allJobs = [];
  
  results.forEach((result, index) => {
    const sources = [
      'busy.az', 'work.az', 'hellojob.az', 'jobs.glorri.az', 
      'hrin.az', 'jobsearch.az', 'jobu.az', 'LinkedIn',
      'rabota.az', 'boss.az', 'joblist.az', 'Indeed'
    ];
    
    if (result.status === 'fulfilled') {
      const jobs = result.value;
      console.log(`✅ ${sources[index]}: Found ${jobs.length} jobs`);
      allJobs.push(...jobs);
    } else {
      console.error(`❌ ${sources[index]}: Failed -`, result.reason?.message || 'Unknown error');
    }
  });
  
  console.log(`📊 Total jobs found: ${allJobs.length}`);
  
  // Remove duplicates based on similar titles and links
  const uniqueJobs = removeDuplicates(allJobs);
  console.log(`✨ Unique jobs after deduplication: ${uniqueJobs.length}`);
  
  // Sort by date (most recent first)
  uniqueJobs.sort((a, b) => {
    if (!a.datePosted) return 1;
    if (!b.datePosted) return -1;
    return new Date(b.datePosted) - new Date(a.datePosted);
  });
  
  return uniqueJobs;
}

/**
 * Remove duplicate jobs based on title and link similarity
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Array of unique jobs
 */
function removeDuplicates(jobs) {
  const seen = new Set();
  const unique = [];
  
  for (const job of jobs) {
    // Create a key from normalized title and link
    const key = `${job.title.toLowerCase().replace(/\s+/g, '')}|${job.link.toLowerCase()}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(job);
    }
  }
  
  return unique;
}

module.exports = {
  searchAllJobs,
  // New Azerbaijani job sites
  searchBusyAZ,
  searchWorkAZ,
  searchHelloJobAZ,
  searchGlorriAZ,
  searchHrinAZ,
  searchJobsearchAZ,
  searchJobuAZ,
  // International sites
  searchLinkedIn,
  searchIndeed,
  // Legacy/other sites
  searchRabotaAZ,
  searchBossAZ,
  searchJoblistAZ
};

