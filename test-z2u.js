const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function testZ2U() {
  const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'accept': 'text/html'
  };

  const res = await axios.get('https://www.z2u.com/search', {
    params: { keywords: 'valorant account' },
    headers,
    timeout: 10000
  });

  const $ = cheerio.load(res.data);
  const output = [];
  
  // Check scripts for product JSON
  $('script').each((i, el) => {
    const text = $(el).html() || '';
    if (text.includes('product') && text.length > 500) {
      output.push(`=== SCRIPT ${i} (${text.length} chars) ===`);
      output.push(text.substring(0, 800));
      output.push('');
    }
  });
  
  // Check product containers
  const pc = $('.productContainer').html();
  if (pc) { output.push('=== productContainer ==='); output.push(pc.substring(0, 1500)); }
  
  const pl = $('.productListUl').html();
  if (pl) { output.push('=== productListUl ==='); output.push(pl.substring(0, 1500)); }
  
  const sp = $('.search_product').html();
  if (sp) { output.push('=== search_product ==='); output.push(sp.substring(0, 1500)); }

  // Check all links with game-related paths
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if ((href.includes('valorant') || href.includes('/game/')) && text.length > 3) {
      output.push(`LINK: "${text.substring(0,80)}" -> ${href}`);
    }
  });

  fs.writeFileSync('z2u-analysis.txt', output.join('\n'));
  console.log('Done. Written to z2u-analysis.txt');
}

testZ2U().catch(e => console.error(e.message));
