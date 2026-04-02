const cheerio = require('cheerio');
const { fetchHtml } = require('../utils/fetchHtml');

async function scrapeStewieShop(query) {
  try {
    const html = await fetchHtml(`https://stewieshop.mysellauth.com/search?q=${encodeURIComponent(query)}`);
    const $ = cheerio.load(html);
    const results = [];

    // SellAuth storefronts typically use simple card layouts
    const cardSelectors = [
      '[class*="product"]',
      '[class*="card"]',
      '[class*="listing"]',
      '[class*="item"]',
      '.col',
      'article',
      '.shop-item'
    ];

    for (const selector of cardSelectors) {
      $(selector).each((i, el) => {
        const title = $(el).find('[class*="title"], h2, h3, h4, h5, [class*="name"], [class*="product-name"], p').first().text().trim();
        const priceText = $(el).find('[class*="price"], [class*="amount"], [class*="cost"], span').filter((_, e) => {
          const t = $(e).text();
          return /\$|€|£|USD|\d+\.\d{2}/.test(t);
        }).first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const link = $(el).find('a[href]').first().attr('href') || $(el).closest('a').attr('href');

        if (title && title.length > 2) {
          results.push({
            platform: 'StewieShop',
            title,
            price: isNaN(price) ? null : price,
            currency: 'USD',
            url: link ? (link.startsWith('http') ? link : `https://stewieshop.mysellauth.com${link}`) : `https://stewieshop.mysellauth.com/search?q=${encodeURIComponent(query)}`,
            seller_rating: null
          });
        }
      });
      if (results.length) break;
    }

    return results;
  } catch (e) {
    console.error('StewieShop scraper error:', e.message);
    return [];
  }
}

module.exports = { scrapeStewieShop };
