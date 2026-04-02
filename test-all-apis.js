const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function run() {
  const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'accept': 'text/html'
  };
  const output = [];

  // === GAMEFLIP - check for __NEXT_DATA__ or embedded state ===
  output.push('=== GAMEFLIP ===');
  const gfRes = await axios.get('https://gameflip.com/browse/video-games', { params: { query: 'valorant account' }, headers, timeout: 10000 });
  const $gf = cheerio.load(gfRes.data);
  
  // Check __NEXT_DATA__
  const nextData = $gf('script#__NEXT_DATA__').html();
  if (nextData) {
    output.push('Found __NEXT_DATA__! Length: ' + nextData.length);
    output.push(nextData.substring(0, 1000));
  }
  
  // Check for any script with listing/product data
  $gf('script').each((i, el) => {
    const text = $gf(el).html() || '';
    if (text.includes('__INITIAL_STATE__') || text.includes('listings') || text.includes('window.__')) {
      output.push(`GF Script ${i}: ${text.substring(0, 500)}`);
    }
  });
  
  // Check for link patterns
  const gfLinks = [];
  $gf('a[href*="/item/"]').each((i, el) => {
    gfLinks.push({ text: $gf(el).text().trim().substring(0, 60), href: $gf(el).attr('href') });
  });
  output.push('Gameflip item links: ' + JSON.stringify(gfLinks.slice(0, 5)));

  // === Z2U - extract AJAX URL from JS ===
  output.push('\n=== Z2U JS Source ===');
  const z2uRes = await axios.get('https://www.z2u.com/search', { params: { keywords: 'valorant account' }, headers, timeout: 10000 });
  const $z2u = cheerio.load(z2uRes.data);
  
  $z2u('script').each((i, el) => {
    const text = $z2u(el).html() || '';
    // Look for ajax/fetch/XMLHttpRequest calls with product/search URLs
    if (text.includes('ajax') && text.includes('product') && text.length > 200) {
      const ajaxCalls = text.match(/url\s*:\s*["']([^"']+)["']/g) || [];
      if (ajaxCalls.length > 0) {
        output.push(`Z2U Script ${i} AJAX URLs: ${ajaxCalls.join(', ')}`);
      }
    }
  });

  // === ELDORADO - try known category URLs ===
  output.push('\n=== ELDORADO ===');
  try {
    const eldRes = await axios.get('https://www.eldorado.gg', { headers, timeout: 10000 });
    const $eld = cheerio.load(eldRes.data);
    const eldLinks = [];
    $eld('a[href]').each((i, el) => {
      const href = $eld(el).attr('href') || '';
      const text = $eld(el).text().trim();
      if (href.includes('valorant') && text.length > 3) {
        eldLinks.push({ text: text.substring(0, 60), href });
      }
    });
    output.push('Eldorado valorant links: ' + JSON.stringify(eldLinks.slice(0, 10)));
    
    // Check for __NEXT_DATA__
    const eldNext = $eld('script#__NEXT_DATA__').html();
    if (eldNext) output.push('Eldorado has __NEXT_DATA__: ' + eldNext.substring(0, 500));
  } catch (e) {
    output.push('Eldorado homepage error: ' + (e.response?.status || e.message));
  }

  fs.writeFileSync('deep-probe-2.txt', output.join('\n'));
  console.log('Done. Written to deep-probe-2.txt');
}

run().catch(e => console.error(e.message));
