const axios = require('axios');

async function scrapeG2G(query) {
  try {
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'origin': 'https://www.g2g.com',
      'referer': 'https://www.g2g.com/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    // 1. Determine service modifier matching user request vs G2G taxonomy
    const qLower = query.toLowerCase();
    let serviceSuffix = '-items-for-sale'; 
    if (qLower.match(/\b(account|accounts)\b/)) serviceSuffix = '-account-for-sale';
    else if (qLower.match(/\b(gold|coins|currency)\b/)) serviceSuffix = '-game-coins';
    else if (qLower.match(/\b(boost|boosting)\b/)) serviceSuffix = '-boosting-service';
    else if (qLower.match(/\b(key|cd key|code)\b/)) serviceSuffix = '-cd-key-for-sale';
    
    // 2. Extract base game name
    const baseGameQuery = qLower.replace(/\b(account|accounts|gold|coins|currency|boost|boosting|cd key|key|code|items|item|cheap|safe|fast)\b/g, '').trim();
    if (!baseGameQuery) return [];

    // 3. Fetch Category seo_term
    const kwRes = await axios.get('https://sls.g2g.com/offer/keyword/search', {
      params: { q: baseGameQuery, root_id: 'all', include_cat: 1 },
      headers,
      timeout: 10000
    });
    
    const results = kwRes.data?.payload?.results;
    if (!results || results.length === 0) return [];
    
    // Find an exact match for the base game name, otherwise fallback to the highest scored first element
    const exactMatch = results.find(r => r.default_name.toLowerCase() === baseGameQuery.toLowerCase() || r.seo_term.toLowerCase() === baseGameQuery.toLowerCase());
    const baseSeoTerm = exactMatch ? exactMatch.seo_term : results[0].seo_term;
    let finalSeoTerm = baseSeoTerm + serviceSuffix;


    // 4. Fetch the listings
    const sRes = await axios.get('https://sls.g2g.com/offer/search', {
      params: { 
        seo_term: finalSeoTerm, 
        sort: 'lowest_price', 
        page_size: 48, 
        currency: 'USD',
        country: 'US',
        include_localization: 0,
        v: 'v2' 
      },
      headers,
      timeout: 15000
    });
    
    const items = sRes.data?.payload?.results || [];
    
    // 5. Map results
    return items.map(i => ({
      platform: 'G2G',
      title: i.title || '',
      price: parseFloat(i.display_price) || null,
      currency: i.display_currency || 'USD',
      url: `https://www.g2g.com/offer/${i.offer_id}`,
      seller_rating: i.seller_name || null // Seller name instead of raw rating value string
    }));

  } catch (e) {
    console.error('G2G scraper error:', e.message);
    // Silent fail returning [] as instructed
    return [];
  }
}

module.exports = { scrapeG2G };
