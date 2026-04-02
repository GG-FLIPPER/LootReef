const axios = require('axios');

async function scrapeEldorado(query) {
  try {
    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const qLower = query.toLowerCase();
    const baseGame = qLower.replace(/\b(account|accounts|gold|coins|currency|boost|boosting|cd key|key|code|items|item|cheap|safe|fast)\b/g, '').trim();
    if (!baseGame) return [];

    let category = 'Items';
    if (qLower.includes('account')) category = 'Account';
    else if (qLower.includes('gold') || qLower.includes('coins')) category = 'Currency';
    else if (qLower.includes('boost')) category = 'RequestedBoosting';

    // 1. Fetch library to map game name to gameId
    const libRes = await axios.get('https://www.eldorado.gg/api/library?locale=en-US', { headers, timeout: 10000 });
    const games = libRes.data;
    
    // Find the matching game ID
    let game = games.find(g => g.gameName && g.gameName.toLowerCase() === baseGame && g.category === category);
    if (!game) {
      game = games.find(g => g.gameName && g.gameName.toLowerCase().includes(baseGame) && g.category === category);
    }
    // Fallback if category mismatch
    if (!game) {
      game = games.find(g => g.gameName && g.gameName.toLowerCase().includes(baseGame));
    }
    
    if (!game || !game.gameId) return [];

    // 2. Fetch offers
    const offersRes = await axios.get('https://www.eldorado.gg/api/flexibleOffers', {
      params: {
        gameId: game.gameId,
        category: category,
        pageSize: 40
      },
      headers,
      timeout: 10000
    });

    const results = [];
    const items = offersRes.data.results || [];
    
    for (const item of items) {
      if (!item.offer || !item.offer.offerTitle) continue;
      
      const offer = item.offer;
      
      results.push({
        platform: 'Eldorado.gg',
        title: offer.offerTitle,
        price: offer.pricePerUnitInUSD ? offer.pricePerUnitInUSD.amount : (offer.pricePerUnit ? offer.pricePerUnit.amount : null),
        currency: 'USD',
        url: offer.gameSeoAlias ? `https://www.eldorado.gg/${offer.gameSeoAlias}/o/${offer.id}` : `https://www.eldorado.gg/`,
        seller_rating: item.userOrderInfo?.feedbackScore ? `${Math.round(item.userOrderInfo.feedbackScore)}%` : null
      });
    }

    return results;
  } catch (e) {
    console.error('Eldorado scraper error:', e.message);
    return [];
  }
}

module.exports = { scrapeEldorado };
