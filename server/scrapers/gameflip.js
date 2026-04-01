const axios = require('axios');

async function scrapeGameflip(query) {
  try {
    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const res = await axios.get('https://production-gameflip.fingershock.com/api/v1/listing', {
      params: {
        limit: 40,
        status: 'onsale',
        term: query
      },
      headers,
      timeout: 10000
    });

    const results = [];
    const items = res.data.data || [];

    for (const item of items) {
      if (!item.name) continue;

      let priceUsd = null;
      if (item.price) {
        // Gameflip price is stored in cents
        priceUsd = item.price / 100;
      }

      results.push({
        platform: 'Gameflip',
        title: item.name,
        price: priceUsd,
        currency: 'USD',
        url: `https://gameflip.com/item/${item.id}`,
        seller_rating: null // Could pull from owner data if collapsed
      });
    }

    return results;
  } catch (e) {
    console.error('Gameflip scraper error:', e.message);
    return [];
  }
}

module.exports = { scrapeGameflip };
