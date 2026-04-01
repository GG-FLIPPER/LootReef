const axios = require('axios');

const RUB_TO_USD = 1 / 90; // approx conversion rate

async function scrapePlati(query) {
  try {
    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'accept': 'application/xml, text/xml, */*'
    };

    // Plati has a native XML search API
    const res = await axios.get('https://plati.market/api/search.ashx', {
      params: { query: query, pagesize: 20, currency: 'RUR' },
      headers,
      timeout: 10000
    });

    const xml = res.data;
    const results = [];

    // Parse XML items using regex (lightweight, no xml2js dependency needed)
    const itemRegex = /<item\s+id="(\d+)">([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemId = match[1];
      const itemXml = match[2];

      // Extract fields from XML
      const nameEng = extractCDATA(itemXml, 'name_eng') || extractCDATA(itemXml, 'name') || '';
      const name = extractCDATA(itemXml, 'name') || '';
      const title = nameEng || name;
      
      // Skip purely numeric or too-short titles
      if (!title || /^\d+$/.test(title) || title.length < 4) continue;

      const priceRub = parseFloat(extractTag(itemXml, 'price_rur') || extractTag(itemXml, 'price') || '0');
      const priceUsd = Math.round(priceRub * RUB_TO_USD * 100) / 100;
      const seller = extractCDATA(itemXml, 'seller') || '';
      const url = extractTag(itemXml, 'url') || `https://plati.market/itm/${itemId}`;

      results.push({
        platform: 'Plati.market',
        title,
        price: priceUsd || null,
        currency: 'USD',
        url: url.startsWith('http') ? url : `https://plati.market${url}`,
        seller_rating: seller || null
      });
    }

    return results;
  } catch (e) {
    console.error('Plati scraper error:', e.message);
    return [];
  }
}

function extractCDATA(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  return match ? match[1].trim() : null;
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return match ? match[1].trim() : null;
}

module.exports = { scrapePlati };

