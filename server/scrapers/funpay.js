const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFunPay(query) {
  try {
    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'accept': 'text/html,application/xhtml+xml'
    };

    const qLower = query.toLowerCase();
    // Extract base game name (strip service keywords)
    const baseGame = qLower.replace(/\b(account|accounts|gold|coins|currency|boost|boosting|cd key|key|code|items|item|cheap|safe|fast)\b/g, '').trim();
    if (!baseGame) return [];

    // Step 1: Fetch homepage to discover the lot ID for this game
    const homeRes = await axios.get('https://funpay.com/en/', { headers, timeout: 10000 });
    const $home = cheerio.load(homeRes.data);

    let lotUrl = null;
    $home('a[href*="/lots/"]').each((i, el) => {
      const text = $home(el).text().trim().toLowerCase();
      const href = $home(el).attr('href');
      if (text.includes(baseGame) && !lotUrl) {
        lotUrl = href;
      }
    });

    if (!lotUrl) {
      // Try partial match (e.g. "cs" matching "CS2")
      $home('a[href*="/lots/"]').each((i, el) => {
        const text = $home(el).text().trim().toLowerCase();
        const href = $home(el).attr('href');
        if (!lotUrl && (text.includes(baseGame) || baseGame.includes(text))) {
          lotUrl = href;
        }
      });
    }

    if (!lotUrl) return [];

    // Step 2: Fetch the lot page directly (no ScraperAPI)
    const lotRes = await axios.get(lotUrl, { headers, timeout: 10000 });
    const $ = cheerio.load(lotRes.data);

    const results = [];
    $('a.tc-item').each((i, el) => {
      const title = $(el).find('.tc-desc-text').text().trim() || $(el).attr('title') || '';
      const priceText = $(el).find('.tc-price').text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const link = $(el).attr('href') || '';
      const seller = $(el).find('.media-user-name').text().trim();

      if (title && link) {
        results.push({
          platform: 'FunPay',
          title,
          price: isNaN(price) ? null : price,
          currency: 'USD',
          url: link.startsWith('http') ? link : `https://funpay.com${link}`,
          seller_rating: seller || null
        });
      }
    });

    return results;
  } catch (e) {
    console.error('FunPay scraper error:', e.message);
    return [];
  }
}

module.exports = { scrapeFunPay };
