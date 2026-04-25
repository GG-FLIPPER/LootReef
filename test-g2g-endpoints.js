const axios = require('axios');

const urls = [
  'https://sls.g2g.com/offer/keyword/search',
  'https://sls.g2g.com/offer/search/keyword',
  'https://api.g2g.com/offer/keyword/search'
];

const headers = {
  'accept': 'application/json, text/plain, */*',
  'origin': 'https://www.g2g.com',
  'referer': 'https://www.g2g.com/',
  'user-agent': 'Mozilla/5.0'
};

async function test(q) {
  for (const url of urls) {
    try {
      const res = await axios.get(url, { params: { q, root_id: 'all', include_cat: 1 }, headers, timeout: 5000 });
      console.log(`[SUCCESS] ${url} for q=${q} - Status: ${res.status}`);
    } catch (e) {
      console.log(`[FAIL] ${url} for q=${q} - Status: ${e.response ? e.response.status : e.message}`);
    }
  }
}

async function run() {
  await test('nflx');
  await test('valorant');
}

run();
