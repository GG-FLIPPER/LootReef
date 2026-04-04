const { scrapeFunPay } = require('./server/scrapers/funpay');
const { scrapeEldorado } = require('./server/scrapers/eldorado');

async function testPhase1() {
  console.log('--- Testing FunPay Link ---');
  const fp = await scrapeFunPay('csgo skins');
  if (fp.length > 0) {
    console.log('Sample FunPay Link:', fp[0].url);
  } else {
    console.log('No FunPay results');
  }

  console.log('\n--- Testing Eldorado Link ---');
  const el = await scrapeEldorado('valorant account');
  if (el.length > 0) {
    console.log('Sample Eldorado Account Link:', el[0].url);
  } else {
    console.log('No Eldorado results');
  }
}

testPhase1();
