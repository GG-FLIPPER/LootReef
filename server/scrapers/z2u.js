const cheerio = require('cheerio');
const { fetchHtml } = require('../utils/fetchHtml');

async function scrapeZ2U(query) {
  try {
    const html = await fetchHtml(`https://www.z2u.com/search?keywords=${encodeURIComponent(query)}`);
    const $ = cheerio.load(html);
    const results = [];

    const cardSelectors = [
      '[class*="product-card"]',
      '[class*="offer"]',
      '[class*="listing"]',
      '[class*="search-item"]',
      '[class*="game-card"]',
      '.product-item',
      'article',
      '.list-item'
    ];

    for (const selector of cardSelectors) {
      $(selector).each((i, el) => {
        const title = $(el).find('[class*="title"], h2, h3, [class*="name"], [class*="product-name"]').first().text().trim();
        const priceText = $(el).find('[class*="price"], [class*="amount"], [class*="cost"]').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const link = $(el).find('a[href]').first().attr('href') || $(el).closest('a').attr('href');
        const ratingText = $(el).find('[class*="rating"], [class*="star"]').first().text().trim();

        if (title && link) {
          results.push({
            platform: 'Z2U',
            title,
            price: isNaN(price) ? null : price,
            currency: 'USD',
            url: link.startsWith('http') ? link : `https://www.z2u.com${link}`,
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
        try {
          if (text.includes('products') || text.includes('items') || text.includes('offers')) {
            const match = text.match(/(?:products|items|offers)\s*[:=]\s*(\[{.+?}\])/s);
            if (match) {
              const items = JSON.parse(match[1]);
              items.forEach(item => {
                if (item.title || item.name || item.product_name) {
                  results.push({
                    platform: 'Z2U',
                    title: item.title || item.name || item.product_name || '',
                    price: parseFloat(item.price || item.min_price) || null,
                    currency: item.currency || 'USD',
                    url: item.url ? (item.url.startsWith('http') ? item.url : `https://www.z2u.com${item.url}`) : `https://www.z2u.com/search?keywords=${encodeURIComponent(query)}`,
                    seller_rating: item.rating || null
                  });
                }
              });
            }
          }
        } catch {}
      });
    }

    return results;
  } catch (e) {
    console.error('Z2U scraper error:', e.message);
    return [];
  }
}

module.exports = { scrapeZ2U };
