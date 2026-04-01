const { chromium } = require('playwright-chromium');
const fs = require('fs');

const eldoradoUrl = 'https://www.eldorado.gg/search?query=valorant+account';
const paUrl = 'https://www.playerauctions.com/search/?q=valorant+account';
const gfUrl = 'https://gameflip.com/browse/video-games?query=valorant+account';

async function sniffNetwork(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  const urls = [];

  page.on('response', (response) => {
    const reqUrl = response.url();
    const type = response.request().resourceType();
    if (type === 'fetch' || type === 'xhr') {
      if (reqUrl.includes('search') || reqUrl.includes('offers') || reqUrl.includes('graphql') || reqUrl.includes('api')) {
        urls.push(reqUrl);
      }
    }
  });

  try { await page.goto(url, { waitUntil: 'load', timeout: 30000 }); } catch (e) {}
  await page.waitForTimeout(5000);
  await browser.close();
  return urls;
}

async function run() {
  const data = {};
  data.eldorado = await sniffNetwork(eldoradoUrl);
  data.pa = await sniffNetwork(paUrl);
  data.gf = await sniffNetwork(gfUrl);
  fs.writeFileSync('sniff.json', JSON.stringify(data, null, 2), 'utf8');
}
run();
