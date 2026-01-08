/**
 * Utility functions for the job scraper bot
 */

/**
 * Check if a date is within the last N days
 * @param {Date} date - The date to check
 * @param {number} days - Number of days to check (default: 30)
 * @returns {boolean} - True if date is within the last N days
 */
function isWithinDays(date, days = 30) {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return false;
  }
  
  const now = new Date();
  const diffTime = now - date;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  return diffDays <= days;
}

/**
 * Parse various date formats commonly found on job sites
 * @param {string} dateStr - The date string to parse
 * @returns {Date|null} - Parsed date or null if parsing failed
 */
function parseJobDate(dateStr) {
  if (!dateStr) return null;
  
  const str = dateStr.toLowerCase().trim();
  const now = new Date();
  
  // Handle "today", "bugün"
  if (str.includes('bugün') || str.includes('today')) {
    return now;
  }
  
  // Handle "yesterday", "dünən"
  if (str.includes('dünən') || str.includes('yesterday')) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
  
  // Handle "X gün əvvəl", "X days ago"
  const daysAgoMatch = str.match(/(\d+)\s*(gün|days?)\s*(əvvəl|ago)/i);
  if (daysAgoMatch) {
    const daysAgo = parseInt(daysAgoMatch[1]);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date;
  }
  
  // Handle "X saat əvvəl", "X hours ago"
  const hoursAgoMatch = str.match(/(\d+)\s*(saat|hours?)\s*(əvvəl|ago)/i);
  if (hoursAgoMatch) {
    const hoursAgo = parseInt(hoursAgoMatch[1]);
    const date = new Date(now);
    date.setHours(date.getHours() - hoursAgo);
    return date;
  }
  
  // Handle "X həftə əvvəl", "X weeks ago"
  const weeksAgoMatch = str.match(/(\d+)\s*(həftə|weeks?)\s*(əvvəl|ago)/i);
  if (weeksAgoMatch) {
    const weeksAgo = parseInt(weeksAgoMatch[1]);
    const date = new Date(now);
    date.setDate(date.getDate() - (weeksAgo * 7));
    return date;
  }
  
  // Try parsing standard date formats (DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD)
  const dateParts = str.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (dateParts) {
    const day = parseInt(dateParts[1]);
    const month = parseInt(dateParts[2]) - 1; // JS months are 0-indexed
    const year = parseInt(dateParts[3]);
    return new Date(year, month, day);
  }
  
  // Try ISO format
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate)) {
    return isoDate;
  }
  
  return null;
}

/**
 * Normalize search query
 * @param {string} query - The search query
 * @returns {string} - Normalized query
 */
function normalizeQuery(query) {
  return query.trim().toLowerCase();
}

/**
 * Format job message for Telegram
 * @param {Object} job - Job object
 * @returns {string} - Formatted message
 */
function formatJobMessage(job) {
  let message = `🔹 ${job.title}`;
  
  if (job.location) {
    message += ` — ${job.location}`;
  }
  
  if (job.company) {
    message += `\n${job.company}`;
  }
  
  if (job.datePosted) {
    const date = new Date(job.datePosted);
    if (!isNaN(date)) {
      message += `\n📅 ${date.toLocaleDateString('az-AZ')}`;
    }
  }
  
  return message;
}

/**
 * Create inline keyboard for job link
 * @param {string} url - Job URL
 * @returns {Object} - Telegram inline keyboard markup
 */
function createJobButton(url) {
  return {
    inline_keyboard: [[
      { text: '👁️ View Job', url: url }
    ]]
  };
}

/**
 * Generate search URLs for Azerbaijani job sites
 * @param {string} query - Search query
 * @returns {Array} - Array of site objects with name and URL
 */
function generateAzerbaijaniJobSiteLinks(query) {
  const encodedQuery = encodeURIComponent(query);
  
  return [
    {
      name: '🇦🇿 Boss.az',
      url: `https://boss.az/vacancies?search=${encodedQuery}`,
      emoji: '💼'
    },
    {
      name: '🇦🇿 Jobsearch.az',
      url: `https://jobsearch.az/vacancies?search=${encodedQuery}`,
      emoji: '🔍'
    },
    {
      name: '🇦🇿 HelloJob.az',
      url: `https://hellojob.az/vacancies?search=${encodedQuery}`,
      emoji: '👋'
    },
    {
      name: '🇦🇿 Boss.az',
      url: `https://www.boss.az/vacancies?search=${encodedQuery}`,
      emoji: '💼'
    },
    {
      name: '🇦🇿 Work.az',
      url: `https://work.az/vacancies?search=${encodedQuery}`,
      emoji: '💻'
    },
    {
      name: '🇦🇿 Vakansiya.az',
      url: `https://vakansiya.az/vacancies?search=${encodedQuery}`,
      emoji: '📋'
    },
    {
      name: '🇦🇿 HRIN.az',
      url: `https://hrin.az/vacancies?search=${encodedQuery}`,
      emoji: '👥'
    },
    {
      name: '🇦🇿 Jobu.az',
      url: `https://jobu.az/vacancies?search=${encodedQuery}`,
      emoji: '🎯'
    }
  ];
}

/**
 * Create inline keyboard with multiple buttons in rows
 * @param {Array} sites - Array of site objects
 * @returns {Object} - Telegram inline keyboard markup
 */
function createSiteButtonsKeyboard(sites) {
  // Create 2 buttons per row
  const keyboard = [];
  for (let i = 0; i < sites.length; i += 2) {
    const row = [];
    row.push({ text: sites[i].name, url: sites[i].url });
    if (i + 1 < sites.length) {
      row.push({ text: sites[i + 1].name, url: sites[i + 1].url });
    }
    keyboard.push(row);
  }
  
  return { inline_keyboard: keyboard };
}

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} - Array of chunks
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  isWithinDays,
  parseJobDate,
  normalizeQuery,
  formatJobMessage,
  createJobButton,
  generateAzerbaijaniJobSiteLinks,
  createSiteButtonsKeyboard,
  chunkArray,
  sleep
};
