const { scrapeG2G } = require('./g2g');
const { scrapeFunPay } = require('./funpay');
const { scrapeEldorado } = require('./eldorado');
const { scrapePlayerAuctions } = require('./playerauctions');
const { scrapeZ2U } = require('./z2u');
const { scrapeGameflip } = require('./gameflip');
const { scrapePlati } = require('./plati');

// Timeout helper function
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Scraper runtime timeout')), ms))
  ]);
};

async function scrapeAll(query) {
  // We split the 7 scrapers into two batches.
  // The first batch runs native JSON APIs which are extremely fast and reliable.
  const batch1 = [
    scrapeG2G(query),
    scrapeFunPay(query),
    scrapeEldorado(query),
    scrapePlati(query),
    scrapeGameflip(query)
  ];
  
  // The second batch uses ScraperAPI for heavily protected sites.
  // We wrap each in a strict 20-second timeout so they don't hang the entire request.
  const batch2 = [
    withTimeout(scrapePlayerAuctions(query), 20000).catch(() => []),
    withTimeout(scrapeZ2U(query), 20000).catch(() => [])
  ];

  const settled1 = await Promise.allSettled(batch1);
  const settled2 = await Promise.allSettled(batch2);
  const settled = [...settled1, ...settled2];

  return settled.flatMap(r => r.status === 'fulfilled' ? r.value : []);
}

module.exports = { scrapeAll };
