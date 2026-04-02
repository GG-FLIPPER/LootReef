const axios = require('axios');

async function testG2G() {
  try {
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'origin': 'https://www.g2g.com',
      'referer': 'https://www.g2g.com/',
      'user-agent': 'Mozilla/5.0'
    };
    
    console.log(`[1] Fetching items with exact params...`);
    const sRes = await axios.get('https://sls.g2g.com/offer/search', {
      params: { 
        seo_term: 'valorant-account-for-sale', 
        v: 'v2', 
        country: 'US',
        currency: 'USD',
        sort: 'lowest_price',
        page_size: 48,
        include_localization: 0
      },
      headers
    });
    
    console.log(`Success! Found ${sRes.data.payload.results.length} items.`);
    if (sRes.data.payload.results.length > 0) {
       console.log('Top Result:', sRes.data.payload.results[0].title);
    }

  } catch (e) {
    console.error('API Error:', e.response ? `HTTP ${e.response.status} - ${JSON.stringify(e.response.data)}` : e.message);
  }
}

testG2G();
