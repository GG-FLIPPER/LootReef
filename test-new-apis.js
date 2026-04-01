const { scrapeEldorado } = require('./server/scrapers/eldorado');

async function testScripts() {
  console.log('Testing Eldorado...');
  const eld = await scrapeEldorado('valorant account');
  console.log('Eldorado:', eld.length);
  if (eld.length > 0) console.log(eld[0]);
}

testScripts();
