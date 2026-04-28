/**
 * Diagnostic: test each step of the G2G scraper pipeline independently.
 * Run: node test-g2g-debug.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
const axios = require('axios');

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY;
const QUERY = 'spotify account';

const G2G_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'origin': 'https://www.g2g.com',
  'referer': 'https://www.g2g.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

async function test() {
  console.log('=== G2G SCRAPER DIAGNOSTIC ===');
  console.log('ScraperAPI key:', SCRAPERAPI_KEY ? `${SCRAPERAPI_KEY.slice(0, 6)}...` : 'MISSING!');
  console.log('Query:', QUERY);
  console.log('');

  // ── TEST 1: Direct keyword search (no proxy) ──
  console.log('--- TEST 1: Direct keyword search (no proxy) ---');
  try {
    const kwUrl = `https://sls.g2g.com/offer/keyword/search?q=${encodeURIComponent(QUERY)}&root_id=all&include_cat=1`;
    const res = await axios.get(kwUrl, { headers: G2G_HEADERS, timeout: 8000 });
    const brands = res.data?.payload?.results || [];
    console.log('  STATUS: SUCCESS');
    console.log('  Brands found:', brands.length);
    brands.slice(0, 3).forEach(b => {
      console.log(`    - "${b.default_name}" (seo: ${b.seo_term}, brand_id: ${b.brand_id})`);
      console.log(`      Categories: ${(b.categories || []).map(c => c.service_id).join(', ')}`);
    });
  } catch (e) {
    console.log('  STATUS: FAILED -', e.message);
    if (e.response) console.log('  HTTP Status:', e.response.status, '| Data:', JSON.stringify(e.response.data).slice(0, 200));
  }
  console.log('');

  // ── TEST 2: ScraperAPI keyword search ──
  console.log('--- TEST 2: ScraperAPI keyword search ---');
  let brands2 = [];
  try {
    const kwUrl = `https://sls.g2g.com/offer/keyword/search?q=${encodeURIComponent(QUERY)}&root_id=all&include_cat=1`;
    const res = await axios.get('http://api.scraperapi.com', {
      headers: G2G_HEADERS,
      params: { api_key: SCRAPERAPI_KEY, url: kwUrl, premium: 'true', keep_headers: 'true' },
      timeout: 15000
    });
    brands2 = res.data?.payload?.results || [];
    console.log('  STATUS: SUCCESS');
    console.log('  Brands found:', brands2.length);
    brands2.slice(0, 3).forEach(b => {
      console.log(`    - "${b.default_name}" (seo: ${b.seo_term}, brand_id: ${b.brand_id})`);
      console.log(`      Categories: ${(b.categories || []).map(c => c.service_id).join(', ')}`);
    });
  } catch (e) {
    console.log('  STATUS: FAILED -', e.message);
    if (e.response) console.log('  HTTP Status:', e.response.status, '| Data:', JSON.stringify(e.response.data).slice(0, 200));
  }
  console.log('');

  // Use whichever brands result we got
  const brands = brands2.length > 0 ? brands2 : [];
  if (brands.length === 0) {
    console.log('No brands found from either method. Cannot proceed.');
    return;
  }

  const bestBrand = brands[0];

  // ── TEST 3: Direct offer search with brand_id + service_id (no proxy) ──
  if (bestBrand.categories && bestBrand.categories.length > 0) {
    const cat = bestBrand.categories[0];
    console.log(`--- TEST 3: Direct offer search (brand_id=${bestBrand.brand_id}, service_id=${cat.service_id}) ---`);
    try {
      const offerUrl = `https://sls.g2g.com/offer/search?brand_id=${bestBrand.brand_id}&service_id=${cat.service_id}&sort=lowest_price&page_size=5&currency=USD&country=US&include_localization=0&v=v2`;
      const res = await axios.get(offerUrl, { headers: G2G_HEADERS, timeout: 8000 });
      const items = res.data?.payload?.results || [];
      console.log('  STATUS: SUCCESS');
      console.log('  Items found:', items.length);
      items.slice(0, 3).forEach(i => console.log(`    - $${i.display_price} | ${i.title?.slice(0, 60)}`));
    } catch (e) {
      console.log('  STATUS: FAILED -', e.message);
      if (e.response) console.log('  HTTP Status:', e.response.status, '| Data:', JSON.stringify(e.response.data).slice(0, 200));
    }
    console.log('');

    // ── TEST 4: ScraperAPI offer search with brand_id + service_id ──
    console.log(`--- TEST 4: ScraperAPI offer search (brand_id=${bestBrand.brand_id}, service_id=${cat.service_id}) ---`);
    try {
      const offerUrl = `https://sls.g2g.com/offer/search?brand_id=${bestBrand.brand_id}&service_id=${cat.service_id}&sort=lowest_price&page_size=5&currency=USD&country=US&include_localization=0&v=v2`;
      const res = await axios.get('http://api.scraperapi.com', {
        headers: G2G_HEADERS,
        params: { api_key: SCRAPERAPI_KEY, url: offerUrl, premium: 'true', keep_headers: 'true' },
        timeout: 15000
      });
      const items = res.data?.payload?.results || [];
      console.log('  STATUS: SUCCESS');
      console.log('  Items found:', items.length);
      items.slice(0, 3).forEach(i => console.log(`    - $${i.display_price} | ${i.title?.slice(0, 60)}`));
    } catch (e) {
      console.log('  STATUS: FAILED -', e.message);
      if (e.response) console.log('  HTTP Status:', e.response.status, '| Data:', JSON.stringify(e.response.data).slice(0, 200));
    }
    console.log('');
  }

  // ── TEST 5: ScraperAPI offer search with seo_term (old approach for comparison) ──
  console.log(`--- TEST 5: ScraperAPI offer search with seo_term="${bestBrand.seo_term}-top-up" ---`);
  try {
    const offerUrl = `https://sls.g2g.com/offer/search?seo_term=${bestBrand.seo_term}-top-up&sort=lowest_price&page_size=5&currency=USD&country=US&include_localization=0&v=v2`;
    const res = await axios.get('http://api.scraperapi.com', {
      headers: G2G_HEADERS,
      params: { api_key: SCRAPERAPI_KEY, url: offerUrl, premium: 'true', keep_headers: 'true' },
      timeout: 15000
    });
    const items = res.data?.payload?.results || [];
    console.log('  STATUS: SUCCESS');
    console.log('  Items found:', items.length);
    items.slice(0, 3).forEach(i => console.log(`    - $${i.display_price} | ${i.title?.slice(0, 60)}`));
  } catch (e) {
    console.log('  STATUS: FAILED -', e.message);
    if (e.response) console.log('  HTTP Status:', e.response.status, '| Data:', JSON.stringify(e.response.data).slice(0, 200));
  }
  console.log('');

  // ── TEST 6: Now test the actual scraper module ──
  console.log('--- TEST 6: Full scrapeG2G() module test ---');
  try {
    const { scrapeG2G } = require('./server/scrapers/g2g');
    const results = await scrapeG2G(QUERY);
    console.log('  STATUS: SUCCESS');
    console.log('  Results returned:', results.length);
    results.slice(0, 5).forEach(r => {
      console.log(`    - [${r.platform}] $${r.price} | ${r.title?.slice(0, 60)} | seller: ${r.seller_rating}`);
    });
  } catch (e) {
    console.log('  STATUS: FAILED -', e.message);
    console.log('  Stack:', e.stack?.split('\n').slice(0, 5).join('\n'));
  }

  console.log('\n=== DIAGNOSTIC COMPLETE ===');
}

test().catch(console.error);
