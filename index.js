/**
 * Azerbaijan Jobs Telegram Bot - Smart Channel Reader
 * Reads job vacancies from Telegram channels with smart filtering
 * 
 * Features:
 * - Prioritizes direct URLs (boss.az, linkedin.com, etc.)
 * - Removes short/forward links (t.me, buff.ly)
 * - Deduplicates results
 * - Shows max 5-10 results
 * - Clean formatting
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

// ============================================================================
// TELEGRAM CHANNELS
// ============================================================================

const JOB_CHANNELS = [
  // Original channels
  '@smartjobit',
  '@smartjobaztecrube',
  '@iktisleri',
  '@marketinqvakansiyalari',
  '@itvakansiyalari',
  '@karyeraaze',
  '@tecrubeproqrami',
  '@tecrubeproqramlari',
  '@azejob',
  '@jobsearchazerbaijan',
  '@offeraz',
  '@hellojobaz',
  '@iselanlaritut',
  
  // New channels added
  '@maliyyevakansiyalar',      // Maliyyə sektorunda vakansiyalar (2.5K)
  '@qadinisleri',               // Qadın işləri (10.5K)
  '@dizaynvakansiyalari',       // Dizayn vakansiyaları (2.7K)
  '@azvakaz',                   // AzVak - Azərbaycanda vakansiyalar (47.5K)
  '@HRIN_AZ',                   // HRIN.AZ - İş elanları (9.9K)
  '@smartjobaz',                // SmartJob.az - iş elanları (41.8K)
  '@busy_az_vakansiyalar',      // Busy.az Vakansiyalar (24.3K)
  '@edumapazz',                 // Edumap.az - Vakansiyalar (26K)
  '@vakansiyalarbaki',          // Vakansiyalar İnzibati/Xidmət (11.1K)
  '@reklamvakansiyalari',       // Marketinq, reklam və mətbuat (1.4K)
  '@position_az',               // Position.az (11.4K)
  '@glori_jobs'                 // Glorri - Vakansiyalar (44.5K)
];

// Priority domains for direct links
const PRIORITY_DOMAINS = [
  'smartjob.az',
  'boss.az',
  'linkedin.com',
  'jobsearch.az',
  'indeed.com',
  'hellojob.az',
  'work.az',
  'career.az',
  'hr.gov.az',
  'offer.az',
  'azvak.az',
  'hrin.az',
  'busy.az',
  'edumap.az',
  'position.az',
  'vakansiya.az',
  'glorri.az',
  'jobs.glorri.az'
];

// Short link domains to skip
const SHORT_LINK_DOMAINS = [
  't.me',
  'buff.ly',
  'bit.ly',
  'tinyurl.com',
  'shorturl.at',
  'cutt.ly',
  'ow.ly'
];

// ============================================================================
// VALIDATION & INIT
// ============================================================================

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.API_ID || !process.env.API_HASH || !process.env.PHONE_NUMBER) {
  console.error('❌ .env faylında lazımi məlumatlar yoxdur!');
  console.error('📝 TELEGRAM_BOT_TOKEN, API_ID, API_HASH, PHONE_NUMBER lazımdır');
  process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
  polling: { interval: 300, autoStart: true, params: { timeout: 10 } }
});

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING || '');
const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });

const stats = {
  totalSearches: 0,
  uniqueUsers: new Set()
};

console.log('🤖 Smart Jobs Bot başlayır...');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function isWithinDays(timestamp, days = 30) {
  if (!timestamp) return false;
  const diffDays = (Date.now() / 1000 - timestamp) / (60 * 60 * 24);
  return diffDays <= days && diffDays >= 0;
}

/**
 * Smart keyword matching - handles variations
 * backend = back-end = back end = BACKEND
 * frontend = front-end = front end = FRONTEND
 */
function matchesKeyword(text, keyword) {
  if (!text || !keyword) return false;
  
  // Normalize both text and keyword
  const normalizedText = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword);
  
  // Direct match
  if (normalizedText.includes(normalizedKeyword)) {
    return true;
  }
  
  // Check word variations
  const keywordWords = normalizedKeyword.split(/\s+/);
  
  // If keyword has multiple words, check if all words present
  if (keywordWords.length > 1) {
    const allWordsPresent = keywordWords.every(word => 
      normalizedText.includes(word)
    );
    if (allWordsPresent) return true;
  }
  
  return false;
}

/**
 * Normalize text for better matching
 * Removes hyphens, extra spaces, converts to lowercase
 */
function normalizeText(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[-_]/g, ' ')        // Replace hyphens and underscores with space
    .replace(/\s+/g, ' ')         // Replace multiple spaces with single space
    .trim();
}

/**
 * Extract and prioritize URLs from message
 * Returns ONLY direct URLs, skips short links
 */
function extractDirectUrls(text) {
  if (!text) return [];
  
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex) || [];
  
  const directUrls = [];
  const seenUrls = new Set();
  
  for (const url of matches) {
    // Clean URL (remove trailing punctuation)
    const cleanUrl = url.replace(/[.,;!?)]+$/, '');
    
    // Skip if already seen
    if (seenUrls.has(cleanUrl.toLowerCase())) continue;
    
    // Check if it's a short link domain
    const isShortLink = SHORT_LINK_DOMAINS.some(domain => 
      cleanUrl.toLowerCase().includes(domain)
    );
    
    if (isShortLink) continue; // Skip short links
    
    // Check if it's a priority domain
    const isPriority = PRIORITY_DOMAINS.some(domain => 
      cleanUrl.toLowerCase().includes(domain)
    );
    
    if (isPriority) {
      directUrls.push(cleanUrl);
      seenUrls.add(cleanUrl.toLowerCase());
    }
  }
  
  return directUrls;
}

/**
 * Extract company name from message
 */
function extractCompany(text) {
  if (!text) return null;
  
  // Common patterns for company names
  const patterns = [
    /🏢\s*([^\n]+)/i,
    /Company[:\s]*([^\n]+)/i,
    /Şirkət[:\s]*([^\n]+)/i,
    /([A-Z][a-zA-Z\s&]+(?:LLC|MMC|CJSC|ASC))/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().substring(0, 50);
    }
  }
  
  return null;
}

/**
 * Extract vacancy title from message
 */
function extractVacancyTitle(text, keyword) {
  if (!text) return keyword;
  
  // Try to find the title line
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip if line is too short or too long
    if (trimmed.length < 10 || trimmed.length > 100) continue;
    
    // Check if line contains keyword
    if (matchesKeyword(trimmed, keyword)) {
      // Remove emojis and clean up
      const cleaned = trimmed.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
      if (cleaned.length > 5) {
        return cleaned.substring(0, 80);
      }
    }
  }
  
  // Fallback: return first meaningful line
  for (const line of lines) {
    const cleaned = line.trim().replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    if (cleaned.length >= 10 && cleaned.length <= 100) {
      return cleaned.substring(0, 80);
    }
  }
  
  return keyword;
}

/**
 * Search channels with smart filtering
 */
async function searchChannelsSmart(keyword) {
  console.log(`🔍 Smart axtarış: "${keyword}"`);
  
  const results = [];
  const seenLinks = new Set();
  
  for (const channelUsername of JOB_CHANNELS) {
    try {
      console.log(`📡 ${channelUsername} oxunur...`);
      
      const channel = await client.getEntity(channelUsername);
      const messages = await client.getMessages(channel, { limit: 50 });  // 50 per channel × 24 channels = 1200 total
      
      for (const message of messages) {
        // Check date (last 30 days)
        if (!isWithinDays(message.date, 30)) continue;
        
        const messageText = message.message || '';
        
        // Check keyword
        if (!matchesKeyword(messageText, keyword)) continue;
        
        // Extract direct URLs only
        const directUrls = extractDirectUrls(messageText);
        
        if (directUrls.length === 0) continue;
        
        // Use first priority URL
        const primaryUrl = directUrls[0];
        
        // Skip if we've already seen this link
        if (seenLinks.has(primaryUrl.toLowerCase())) continue;
        
        seenLinks.add(primaryUrl.toLowerCase());
        
        // Extract additional info
        const company = extractCompany(messageText);
        const vacancyTitle = extractVacancyTitle(messageText, keyword);
        const messageLink = `https://t.me/${channelUsername.replace('@', '')}/${message.id}`;
        
        results.push({
          channel: channelUsername,
          company: company,
          title: vacancyTitle,
          link: primaryUrl,
          messageLink: messageLink,
          date: new Date(message.date * 1000),
          timestamp: message.date
        });
      }
      
      console.log(`  ✅ ${results.filter(r => r.channel === channelUsername).length} unikal vakansiya`);
      
    } catch (error) {
      console.error(`  ❌ ${channelUsername}: ${error.message}`);
    }
  }
  
  // Sort by date (newest first)
  results.sort((a, b) => b.timestamp - a.timestamp);
  
  // Limit to 5-10 results
  const limited = results.slice(0, 10);
  
  console.log(`📊 Ümumi: ${limited.length} unikal vakansiya (${results.length}-dən)`);
  
  return limited;
}

// ============================================================================
// TELEGRAM CLIENT SETUP
// ============================================================================

async function initializeClient() {
  console.log('🔐 Telegram client qoşulur...');
  
  await client.start({
    phoneNumber: async () => process.env.PHONE_NUMBER,
    password: async () => await input.text('2FA Parol (varsa): '),
    phoneCode: async () => await input.text('Telegram kodu: '),
    onError: (err) => console.error('❌ Xəta:', err),
  });
  
  console.log('✅ Client qoşuldu!');
  
  const sessionString = client.session.save();
  if (!process.env.SESSION_STRING) {
    console.log('\n📝 SESSION_STRING (.env-ə əlavə edin):');
    console.log(sessionString);
    console.log('');
  }
  
  return client;
}

// ============================================================================
// BOT COMMANDS
// ============================================================================

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'İstifadəçi';
  
  const message = `
👋 Salam ${firstName}!

🎯 Smart iş axtarışı botu

Mən ${JOB_CHANNELS.length} Telegram kanalından vakansiya tapıram.

✨ Xüsusiyyətlər:
• Yalnız birbaşa linklər (boss.az, linkedin.com)
• Dublikat yoxdur
• Son 30 gün
• Maksimum 10 nəticə

🔍 İstifadə:
İş mövqeyini yazın:
• "frontend developer"
• "mühasib"
• "marketing"

📝 İndi axtarış edin!
  `.trim();
  
  bot.sendMessage(chatId, message);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const message = `
📖 Kömək

Əmrlər:
/start - Başlat
/help - Kömək
/channels - Kanal siyahısı
/stats - Statistika

Axtarış:
İş mövqeyini yazın, məsələn:
• frontend developer
• react
• mühasib

Nəticə formatı:
• Kanal adı
• Şirkət (varsa)
• Vakansiya adı
• Birbaşa link (boss.az, linkedin.com)
• Tarix

❌ Short linklər (t.me, buff.ly) göstərilmir
✅ Yalnız birbaşa, unikal linklər
  `.trim();
  
  bot.sendMessage(chatId, message);
});

bot.onText(/\/channels/, (msg) => {
  const chatId = msg.chat.id;
  
  const message = `
📡 Monitorinq edilən kanallar:

${JOB_CHANNELS.map((ch, i) => `${i + 1}. ${ch}`).join('\n')}

🔢 Ümumi: ${JOB_CHANNELS.length} kanal
📅 Son 30 gün
🔗 Yalnız birbaşa linklər
  `.trim();
  
  bot.sendMessage(chatId, message);
});

bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  
  const message = `
📊 Statistika

🔍 Axtarışlar: ${stats.totalSearches}
👥 İstifadəçilər: ${stats.uniqueUsers.size}
📡 Kanallar: ${JOB_CHANNELS.length}
🔗 Prioritet domenlər: ${PRIORITY_DOMAINS.length}
  `.trim();
  
  bot.sendMessage(chatId, message);
});

// ============================================================================
// SEARCH HANDLER
// ============================================================================

bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const keyword = msg.text;
  
  if (!keyword || keyword.trim().length < 2) {
    bot.sendMessage(chatId, '❗ Ən azı 2 simvol yazın.');
    return;
  }
  
  stats.totalSearches++;
  stats.uniqueUsers.add(chatId);
  
  if (!client.connected) {
    bot.sendMessage(chatId, '⚠️ Client hələ hazır deyil. Bir az gözləyin...');
    return;
  }
  
  bot.sendChatAction(chatId, 'typing');
  
  const searchMsg = await bot.sendMessage(
    chatId,
    `🔍 "${keyword}" axtarılır...\n\n⏳ ${JOB_CHANNELS.length} kanal yoxlanılır...`
  );
  
  try {
    const results = await searchChannelsSmart(keyword);
    
    await bot.deleteMessage(chatId, searchMsg.message_id);
    
    if (results.length === 0) {
      await bot.sendMessage(
        chatId,
        `❌ Son 30 gün üçün uyğun vakansiya tapılmadı.\n\n💡 Başqa açar söz ilə cəhd edin.`
      );
      return;
    }
    
    // Format results
    let response = `🔍 Tapılan vakansiyalar (son 30 gün):\n\n`;
    response += `📊 Ümumi: ${results.length} unikal elan\n\n`;
    
    for (const result of results) {
      response += `• ${result.channel}\n`;
      
      if (result.company) {
        response += `🏢 ${result.company}\n`;
      }
      
      response += `⌨️ ${result.title}\n`;
      response += `🖇 ${result.link}\n`;
      response += `📅 ${result.date.toLocaleDateString('az-AZ')}\n\n`;
    }
    
    // Send response (handle long messages)
    if (response.length > 4000) {
      const chunks = [];
      let current = '';
      
      for (const line of response.split('\n\n')) {
        if ((current + line).length > 4000) {
          chunks.push(current);
          current = line + '\n\n';
        } else {
          current += line + '\n\n';
        }
      }
      
      if (current) chunks.push(current);
      
      for (const chunk of chunks) {
        await bot.sendMessage(chatId, chunk);
        await new Promise(r => setTimeout(r, 500));
      }
    } else {
      await bot.sendMessage(chatId, response);
    }
    
  } catch (error) {
    console.error('❌ Xəta:', error);
    
    try {
      await bot.deleteMessage(chatId, searchMsg.message_id);
    } catch {}
    
    await bot.sendMessage(
      chatId,
      `❌ Xəta: ${error.message}\n\n💡 Yenidən cəhd edin.`
    );
  }
});

// ============================================================================
// ERROR HANDLERS
// ============================================================================

bot.on('polling_error', (error) => {
  if (error.code === 'EFATAL' || error.code === 'ECONNRESET') {
    console.log('🔄 Reconnecting...');
    return;
  }
  console.error('⚠️ Polling error:', error.message);
});

process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down...');
  await client.disconnect();
  bot.stopPolling();
  console.log(`📊 ${stats.totalSearches} axtarış, ${stats.uniqueUsers.size} istifadəçi`);
  process.exit(0);
});

// ============================================================================
// START
// ============================================================================

(async () => {
  try {
    await initializeClient();
    console.log('✅ Smart Jobs Bot hazırdır!');
    console.log(`📡 ${JOB_CHANNELS.length} kanal, ${PRIORITY_DOMAINS.length} prioritet domen`);
    console.log('🚀 Telegram-da bota mesaj göndərin');
  } catch (error) {
    console.error('❌ Başlatma xətası:', error);
    process.exit(1);
  }
})();
