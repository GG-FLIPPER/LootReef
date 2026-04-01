const axios = require('axios');

async function testG2GApi(query) {
  try {
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'origin': 'https://www.g2g.com',
      'referer': 'https://www.g2g.com/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    };

    console.log(`[1] Fetching category for query: "${query}"...`);
    const catRes = await axios.get('https://sls.g2g.com/offer/keyword/search', {
      params: { q: query, root_id: 'all', include_cat: 1 },
      headers
    });

    const payload = catRes.data.payload;
    if (!payload || payload.length === 0) {
      console.log('No categories found for this query.');
      return;
    }

    // Usually payload is an array of matches. Let's find the first one that has a seo_term.
    const firstMatch = payload[0];
    const seo_term = firstMatch.seo_term;
    console.log(`-> Best matching category seo_term: ${seo_term} (Brand: ${firstMatch.brand_name})`);

    // Now let's fetch the actual items
    console.log(`\n[2] Fetching items for ${seo_term}...`);
    const itemRes = await axios.get('https://sls.g2g.com/offer/search', {
      params: {
        seo_term: seo_term,
        sort: 'lowest_price',
        page_size: 10,
        currency: 'USD',
        country: 'US',
        include_localization: 0,
        v: 'v2'
      },
      headers
    });

    const items = itemRes.data.payload.results;
    console.log(`-> Found ${items ? items.length : 0} items.`);
    
    if (items && items.length > 0) {
      const top3 = items.slice(0, 3).map(i => ({
        title: i.title,
        price: i.display_price,
        currency: i.display_currency,
        offer_id: i.offer_id,
        seller: i.seller_name
      }));
      console.log('Top 3 results:');
      console.dir(top3, { depth: null });
    }

  } catch (e) {
    if (e.response) {
      console.error(`HTTP Error ${e.response.status}:`, e.response.data);
    } else {
      console.error('Request Error:', e.message);
    }
  }
}

testG2GApi('valorant account');
