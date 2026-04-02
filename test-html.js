const fs = require('fs');
const { fetchHtml } = require('./server/utils/fetchHtml');

async function testHtml() {
  console.log('Fetching G2G HTML...');
  const html = await fetchHtml('https://www.g2g.com/search?query=valorant%20account');
  fs.writeFileSync('g2g-raw.html', html, 'utf8');
  console.log('Saved to g2g-raw.html. Length:', html.length);
}

testHtml().catch(console.error);
