const cheerio = require('cheerio');
const { fetchHtml } = require('../utils/fetchHtml');

async function scrapePlayerAuctions(query) {
  try {
    const html = await fetchHtml(`https://www.playerauctions.com/search/?q=${encodeURIComponent(query)}`);
    const $ = cheerio.load(html);
    const results = [];

    const cardSelectors = [
      '[class*="offer-card"]',
      '[class*="product"]',
      '[class*="listing"]',
      '.search-result-item',
      '[class*="result-card"]',
      '[class*="search-item"]',
      'article',
      'tr[class*="offer"]',
      '.kv-item'
    ];

    for (const selector of cardSelectors) {
      $(selector).each((i, el) => {
        const title = $(el).find('[class*="title"], h2, h3, [class*="name"], [class*="offer-title"], td:first-child').first().text().trim();
        const priceText = $(el).find('[class*="price"], [class*="amount"], [class*="cost"]').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const link = $(el).find('a[href]').first().attr('href') || $(el).closest('a').attr('href');
        const ratingText = $(el).find('[class*="rating"], [class*="star"], [class*="seller-score"]').first().text().trim();

        if (title && link) {
          results.push({
            platform: 'PlayerAuctions',
            title,
            price: isNaN(price) ? null : price,
            currency: 'USD',
            url: link.startsWith('http') ? link : `https://www.playerauctions.com${link}`,
            seller_rating: ratingText || null
          });
        }
      });
      if (results.length) break;
    }

    // Fallback: embedded JSON
    if (!results.length) {
      $('script').each((i, el) => {
        const text = $(el).html() || '';
        if (text.includes('__NEXT_DATA__') || text.includes('searchResults') || text.includes('offers')) {
          try {
            let jsonStr;
            const nextMatch = text.match(/__NEXT_DATA__\s*=\s*({.+?});?\s*<?\//s);
            if (nextMatch) jsonStr = nextMatch[1];
            else {
              const scriptJson = $(el).attr('type') === 'application/json' ? text : null;
              if (scriptJson) jsonStr = scriptJson;
            }
            if (jsonStr) {
              const json = JSON.parse(jsonStr);
              const items = findNestedItems(json);
              items.forEach(item => {
                if (item.title || item.name) {
                  results.push({
                    platform: 'PlayerAuctions',
                    title: item.title || item.name || '',
                    price: parseFloat(item.price || item.amount) || null,
                    currency: item.currency || 'USD',
                    url: item.url ? (item.url.startsWith('http') ? item.url : `https://www.playerauctions.com${item.url}`) : `https://www.playerauctions.com/search/?q=${encodeURIComponent(query)}`,
                    seller_rating: item.rating || item.sellerScore || null
                  });
                }
              });
            }
          } catch {}
        }
      });
    }

    return results;
  } catch (e) {
    console.error('PlayerAuctions scraper error:', e.message);
    return [];
  }
}

function findNestedItems(obj, depth = 0) {
  if (depth > 10) return [];
  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] === 'object' && (obj[0].title || obj[0].name || obj[0].price)) {
      return obj;
    }
  }
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const found = findNestedItems(obj[key], depth + 1);
      if (found.length) return found;
    }
  }
  return [];
}

module.exports = { scrapePlayerAuctions };
