const { scrapeFunPay } = require('./server/scrapers/funpay');

async function test() {
  console.log('Testing FunPay scraper...');
  const res = await scrapeFunPay('valorant account');
  console.log(`Found ${res.length} results.`);
  if (res.length > 0) console.log('Sample:', res[0]);
}
test();
