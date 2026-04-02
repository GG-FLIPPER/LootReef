const { chromium } = require('playwright-chromium');
const fs = require('fs');

async function sniffNetwork(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const foundUrls = [];

  page.on('response', async (response) => {
    const reqUrl = response.url();
    const type = response.request().resourceType();
    
    if (type === 'fetch' || type === 'xhr') {
      if (reqUrl.includes('search') || reqUrl.includes('offers') || reqUrl.includes('graphql') || reqUrl.includes('api')) {
        foundUrls.push(reqUrl);
      }
    }
  });

  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    // Wait an extra few seconds for async requests
    await page.waitForTimeout(5000);
  } catch (e) {
    console.log(`Error navigating: ${e.message}`);
  }

  console.log('--- FOUND XHR/FETCH REQUESTS ---');
  console.log(JSON.stringify(foundUrls, null, 2));

  await browser.close();
}

async function run() {
  console.log('--- ELDORADO ---');
  await sniffNetwork('https://www.eldorado.gg/search?query=valorant+account');

  console.log('\n--- PLAYERAUCTIONS ---');
  await sniffNetwork('https://www.playerauctions.com/search/?q=valorant+account');
  
  console.log('\n--- GAMEFLIP ---');
  await sniffNetwork('https://gameflip.com/browse/video-games?query=valorant+account');
}

run();
