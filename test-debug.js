const { scrapeG2G } = require('./server/scrapers/g2g');
const { scrapePlayerAuctions } = require('./server/scrapers/playerauctions');

async function test() {
  console.log('Testing G2G...');
  const res1 = await scrapeG2G('valorant account');
  console.log('G2G results:', res1.length);
  if (res1.length > 0) console.log(res1[0]);

  console.log('Testing PlayerAuctions...');
  const res2 = await scrapePlayerAuctions('valorant account');
  console.log('PlayerAuctions results:', res2.length);
  if (res2.length > 0) console.log(res2[0]);
}

test().catch(console.error);
