const { scrapeAll } = require('../scrapers');

const TOPICS = [
  {
    query: 'Spotify Premium 3 months',
    tag: 'Audio',
    titlePrefix: 'Spotify Premium',
    description: 'Ad-free music listening, offline playback, and on-demand audio upgrades.',
    originalPrice: '$10.99',
    emoji: '🎧'
  },
  {
    query: 'Netflix Premium 1 month',
    tag: 'Streaming',
    titlePrefix: 'Netflix Premium',
    description: '4K Ultra HD streaming. Personal profiles at unbeatable grey-market prices.',
    originalPrice: '$22.99',
    emoji: '🍿'
  },
  {
    query: 'Discord Nitro 1 month',
    tag: 'Social',
    titlePrefix: 'Discord Nitro',
    description: 'Custom emojis, HD streaming, and larger uploads for your favorite servers.',
    originalPrice: '$9.99',
    emoji: '💬'
  },
  {
    query: 'ChatGPT Plus 1 month',
    tag: 'AI',
    titlePrefix: 'ChatGPT Plus',
    description: 'Access GPT-4, DALL-E 3, and advanced data analysis without the massive monthly fee.',
    originalPrice: '$20.00',
    emoji: '🤖'
  },
  {
    query: 'Steam Offline Activation',
    tag: 'Gaming',
    titlePrefix: 'Steam AAA Games',
    description: 'Play AAA games like Cyberpunk and Black Myth Wukong for a fraction of the cost.',
    originalPrice: '$59.99',
    emoji: '🎮'
  },
  {
    query: 'Xbox Game Pass Ultimate 1 month',
    tag: 'Gaming',
    titlePrefix: 'Xbox Game Pass',
    description: 'Hundreds of high-quality games on console and PC, plus online multiplayer.',
    originalPrice: '$16.99',
    emoji: '🕹️'
  },
  {
    query: 'Adobe Creative Cloud 1 year',
    tag: 'Design',
    titlePrefix: 'Adobe CC',
    description: 'Full suite of creative apps including Photoshop, Premiere, and Illustrator.',
    originalPrice: '$54.99/mo',
    emoji: '🎨'
  },
  {
    query: '1Password Family 1 year',
    tag: 'Security',
    titlePrefix: '1Password',
    description: 'Secure your digital life with the leading password manager for you and your family.',
    originalPrice: '$59.88/yr',
    emoji: '🔐'
  },
  {
    query: 'YouTube Premium 1 month',
    tag: 'Streaming',
    titlePrefix: 'YouTube Premium',
    description: 'Ad-free viewing, background play, and YouTube Music downloads included.',
    originalPrice: '$13.99',
    emoji: '📺'
  },
  {
    query: 'Claude Pro 1 month',
    tag: 'AI',
    titlePrefix: 'Claude Pro',
    description: 'More usage limits and faster responses with Anthropic\'s top-tier Claude 3 models.',
    originalPrice: '$20.00',
    emoji: '🧠'
  },
  {
    query: 'Higgsfield AI',
    tag: 'AI',
    titlePrefix: 'Higgsfield Pro',
    description: 'Premium AI video generation and rendering credits.',
    originalPrice: '$15.00',
    emoji: '🎥'
  },
  {
    query: 'Crunchyroll Mega Fan 1 month',
    tag: 'Streaming',
    titlePrefix: 'Crunchyroll',
    description: 'Ad-free anime, new episodes shortly after Japan, and offline viewing.',
    originalPrice: '$9.99',
    emoji: '🍣'
  },
  {
    query: 'PlayStation Plus Extra 1 month',
    tag: 'Gaming',
    titlePrefix: 'PS Plus Extra',
    description: 'Game catalog access, online multiplayer, and monthly free games.',
    originalPrice: '$14.99',
    emoji: '🎮'
  },
  {
    query: 'Nintendo Switch Online 1 year',
    tag: 'Gaming',
    titlePrefix: 'Switch Online',
    description: 'Online play, cloud saves, and classic NES/SNES game libraries.',
    originalPrice: '$19.99',
    emoji: '🍄'
  },
  {
    query: 'Valorant 1000 VP',
    tag: 'Gaming',
    titlePrefix: 'Valorant Points',
    description: 'Unlock premium weapon skins, battle passes, and Radianite.',
    originalPrice: '$9.99',
    emoji: '🔫'
  },
  {
    query: 'Fortnite 1000 V-Bucks',
    tag: 'Gaming',
    titlePrefix: 'Fortnite V-Bucks',
    description: 'Purchase the latest battle pass or fresh cosmetics from the item shop.',
    originalPrice: '$8.99',
    emoji: '🪂'
  },
  {
    query: 'Roblox 800 Robux',
    tag: 'Gaming',
    titlePrefix: 'Roblox Robux',
    description: 'Virtual currency to upgrade your avatar or buy special abilities in experiences.',
    originalPrice: '$9.99',
    emoji: '🧱'
  },
  {
    query: 'Google One 2TB 1 year',
    tag: 'Storage',
    titlePrefix: 'Google One 2TB',
    description: 'Expand your Google Drive, Gmail, and Google Photos storage securely.',
    originalPrice: '$99.99/yr',
    emoji: '☁️'
  },
  {
    query: 'NordVPN 1 year',
    tag: 'Security',
    titlePrefix: 'NordVPN',
    description: 'High-speed servers, strict no-logs policy, and advanced threat protection.',
    originalPrice: '$59.88',
    emoji: '🛡️'
  },
  {
    query: 'Windows 11 Pro Key',
    tag: 'Software',
    titlePrefix: 'Windows 11 Pro',
    description: 'Lifetime global activation key for Microsoft\'s latest operating system.',
    originalPrice: '$199.99',
    emoji: '🪟'
  },
  {
    query: 'Microsoft Office 365 1 year',
    tag: 'Software',
    titlePrefix: 'Office 365',
    description: 'Word, Excel, PowerPoint, and 1TB of OneDrive cloud storage.',
    originalPrice: '$69.99',
    emoji: '📊'
  },
  {
    query: 'Canva Pro 1 year',
    tag: 'Design',
    titlePrefix: 'Canva Pro',
    description: 'Premium templates, magic resize, background remover, and brand kits.',
    originalPrice: '$119.99',
    emoji: '🖌️'
  },
  {
    query: 'Duolingo Super 1 year',
    tag: 'Education',
    titlePrefix: 'Duolingo Super',
    description: 'Learn languages faster with no ads, unlimited hearts, and personalized reviews.',
    originalPrice: '$83.99',
    emoji: '🦉'
  },
  {
    query: 'Twitch Tier 1 Sub',
    tag: 'Social',
    titlePrefix: 'Twitch Sub',
    description: 'Ad-free viewing, custom emotes, and loyalty badges for your favorite streamer.',
    originalPrice: '$4.99',
    emoji: '🟣'
  },
  {
    query: 'Midjourney Basic Plan 1 month',
    tag: 'AI',
    titlePrefix: 'Midjourney',
    description: 'Generate stunning, professional-grade AI images directly through Discord.',
    originalPrice: '$10.00',
    emoji: '🖼️'
  }
];

// In-memory cache
let dailyCache = {
  dateString: null,
  deal: null
};

// Lock to prevent stampedes
let pendingPromise = null;

// Helper to get UTC date string (YYYY-MM-DD)
function getUTCDateString() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
}

// Helper to get day index based on UTC date
function getDayIndex() {
  const now = new Date();
  // Milliseconds since epoch at midnight UTC
  const msAtMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  // Divide by ms in a day
  return Math.floor(msAtMidnight / (1000 * 60 * 60 * 24));
}

function getFallbackDeal(topic, dateString) {
  return {
    id: `deal-${dateString}-${topic.tag.toLowerCase()}`,
    tag: topic.tag,
    title: `${topic.titlePrefix} (Estimated)`,
    description: topic.description,
    price: null,
    originalPrice: topic.originalPrice,
    emoji: topic.emoji,
    url: '#',
    platform: 'Various'
  };
}

async function fetchTodaysDeal() {
  const todayStr = getUTCDateString();
  
  // Return cache if valid
  if (dailyCache.dateString === todayStr && dailyCache.deal) {
    return dailyCache.deal;
  }

  // If a scrape is already running, wait for it
  if (pendingPromise) {
    return pendingPromise;
  }

  // Define the scrape promise
  pendingPromise = (async () => {
    const dayIndex = getDayIndex();
    const topic = TOPICS[dayIndex % TOPICS.length];
    
    try {
      console.log(`[DailyDeal] Fetching new deal for topic: ${topic.query}`);
      const results = await scrapeAll(topic.query);
      
      // Filter anomalies (e.g. less than $0.50 usually spam/fake on grey markets) and sort
      const validResults = results
        .filter(r => r.price != null && r.price > 0.50)
        .sort((a, b) => a.price - b.price);

      if (validResults.length > 0) {
        const topDeal = validResults[0];
        dailyCache = {
          dateString: todayStr,
          deal: {
            id: `deal-${todayStr}-${topic.tag.toLowerCase()}`,
            tag: topic.tag,
            title: topDeal.title || topic.titlePrefix,
            description: `Best price found on ${topDeal.platform} by ${topDeal.seller || 'a verified seller'}. Normally ${topic.originalPrice}, today just $${topDeal.price.toFixed(2)}!`,
            price: topDeal.price,
            originalPrice: topic.originalPrice,
            emoji: topic.emoji,
            url: topDeal.url,
            platform: topDeal.platform
          }
        };
      } else {
        console.warn(`[DailyDeal] No valid results for ${topic.query}. Using fallback.`);
        dailyCache = {
          dateString: todayStr,
          deal: getFallbackDeal(topic, todayStr)
        };
      }
    } catch (error) {
      console.error('[DailyDeal] Scraping failed:', error);
      dailyCache = {
        dateString: todayStr,
        deal: getFallbackDeal(topic, todayStr)
      };
    } finally {
      // Clear the lock
      pendingPromise = null;
    }
    
    return dailyCache.deal;
  })();

  return pendingPromise;
}

function clearCache() {
  dailyCache = { dateString: null, deal: null };
  console.log('[DailyDeal] Cache cleared.');
}

// Simple cron alternative using setTimeout to align with UTC midnight
function scheduleNextMidnightFetch() {
  const now = new Date();
  const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const msUntilMidnight = nextMidnight.getTime() - now.getTime();
  
  console.log(`[DailyDeal] Scheduled next fetch in ${(msUntilMidnight / 1000 / 60 / 60).toFixed(2)} hours (at UTC midnight).`);
  
  setTimeout(() => {
    console.log('[DailyDeal] Midnight UTC reached. Pre-fetching daily deal...');
    // Clear cache forcefully
    clearCache();
    // Fire fetch to populate new cache
    fetchTodaysDeal().catch(err => console.error('[DailyDeal] Pre-fetch error:', err));
    // Schedule the next one
    scheduleNextMidnightFetch();
  }, msUntilMidnight);
}

// Start the scheduler
scheduleNextMidnightFetch();

module.exports = {
  fetchTodaysDeal,
  clearCache
};
