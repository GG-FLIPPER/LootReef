# LootReef — Master Build Prompt

## What You Are Building
LootReef is a web app that compares prices for digital goods (game keys, in-game currency, game accounts, digital services) across grey market gaming marketplaces in real time.

## Tech Stack
- **Frontend:** React + Tailwind CSS (clean, minimal, white/blue design)
- **Backend:** Node.js + Express
- **Scraping:** ScraperAPI (handles JS-rendered sites, proxies, anti-bot)
- **ScraperAPI Key:** 3db90afce2774e79a53dc2e5f176c674

## Supported Platforms
- g2g.com
- funpay.com
- eldorado.gg
- playerauctions.com
- z2u.com
- gameflip.com
- stewieshop.mysellauth.com
- plati.market

## Core Feature
User types a search query (e.g. "wow gold eu", "valorant account diamond", "arc raiders account") → backend scrapes all platforms in parallel → returns sorted results by price → frontend displays them as cards.

## ScraperAPI Integration

All scraping goes through ScraperAPI. Never fetch target sites directly.

ScraperAPI endpoint: `http://api.scraperapi.com`
Params:
- `api_key` — your key
- `url` — target URL (no encoding needed)
- `render` — set to `true` for JS-rendered sites (costs more credits)
- `premium` — set to `true` for heavily protected sites

```javascript
// utils/fetchHtml.js
const axios = require('axios');

const SCRAPERAPI_KEY = '3db90afce2774e79a53dc2e5f176c674';

// Sites that render listings with JS
const JS_RENDERED = ['g2g.com', 'eldorado.gg', 'z2u.com', 'gameflip.com', 'playerauctions.com'];

// Sites that block aggressively
const PREMIUM_SITES = ['playerauctions.com', 'eldorado.gg'];

async function fetchHtml(targetUrl) {
  const needsRender = JS_RENDERED.some(site => targetUrl.includes(site));
  const needsPremium = PREMIUM_SITES.some(site => targetUrl.includes(site));

  const params = {
    api_key: SCRAPERAPI_KEY,
    url: targetUrl,
    render: needsRender ? 'true' : 'false',
    premium: needsPremium ? 'true' : 'false',
    keep_headers: 'true'
  };

  const response = await axios.get('http://api.scraperapi.com', { 
    params,
    timeout: 30000
  });

  return response.data;
}

module.exports = { fetchHtml };
```

## Scraper URLs
- G2G: `https://www.g2g.com/search?query=QUERY`
- FunPay: `https://funpay.com/en/search/?query=QUERY`
- Eldorado: `https://www.eldorado.gg/search?query=QUERY`
- PlayerAuctions: `https://www.playerauctions.com/search/?q=QUERY`
- Z2U: `https://www.z2u.com/search?keywords=QUERY`
- Gameflip: `https://gameflip.com/search?q=QUERY`
- StewieShop: `https://stewieshop.mysellauth.com/search?q=QUERY`
- Plati: `https://plati.market/search/QUERY`

## HTML Parsing Strategy
Use **cheerio** on the backend to parse HTML returned by ScraperAPI.

Each scraper returns: `{ platform, title, price, currency, url, seller_rating }`

Use broad, resilient selectors with multiple fallbacks. If HTML parsing returns nothing, check for embedded JSON in `<script>` tags (`__NEXT_DATA__`, `window.__INITIAL_STATE__`).

Each scraper must:
- Never throw — always return `[]` on failure
- Be isolated — one failing scraper never affects others
- Run in parallel with `Promise.allSettled()`

## Scraper Template
```javascript
// scrapers/g2g.js
const cheerio = require('cheerio');
const { fetchHtml } = require('../utils/fetchHtml');

async function scrapeG2G(query) {
  try {
    const html = await fetchHtml(`https://www.g2g.com/search?query=${encodeURIComponent(query)}`);
    const $ = cheerio.load(html);
    const results = [];

    // Try multiple selectors — sites change their HTML often
    const cardSelectors = ['[data-testid*="product"]', '[class*="product-card"]', '[class*="listing"]', 'article'];
    
    for (const selector of cardSelectors) {
      $(selector).each((i, el) => {
        const title = $(el).find('[class*="title"], h2, h3').first().text().trim();
        const priceText = $(el).find('[class*="price"]').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const url = $(el).find('a[href]').first().attr('href');

        if (title && url) {
          results.push({
            platform: 'g2g',
            title,
            price: isNaN(price) ? null : price,
            currency: 'USD',
            url: url.startsWith('http') ? url : `https://www.g2g.com${url}`,
            seller_rating: null
          });
        }
      });
      if (results.length) break; // stop at first selector that works
    }

    // Fallback: check for embedded JSON
    if (!results.length) {
      $('script').each((i, el) => {
        const text = $(el).html() || '';
        try {
          const json = JSON.parse(text);
          // extract from json if possible
        } catch {}
      });
    }

    return results;
  } catch (e) {
    console.error('G2G scraper error:', e.message);
    return [];
  }
}

module.exports = { scrapeG2G };
```

Apply the same pattern for all other platforms.

## Item Name Normalization
```javascript
// utils/parser.js
function parseItemName(raw) {
  return raw
    .toLowerCase()
    .replace(/[⚡🔥💯✅👑]/g, '')
    .replace(/\b(cheap|fast|instant|delivery|best|trusted|safe|legit|verified|top|sell|buy)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = { parseItemName };
```

## API Endpoint
```javascript
// server/index.js
const express = require('express');
const cors = require('cors');
const { scrapeAll } = require('./scrapers');
const { parseItemName } = require('./utils/parser');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
  const query = parseItemName(req.query.q || '');
  if (!query) return res.json({ results: [] });

  const results = await scrapeAll(query);
  results.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  res.json({ results });
});

app.listen(3001, () => console.log('LootReef API running on port 3001'));
```

```javascript
// server/scrapers/index.js
const { scrapeG2G } = require('./g2g');
const { scrapeFunPay } = require('./funpay');
const { scrapeEldorado } = require('./eldorado');
const { scrapePlayerAuctions } = require('./playerauctions');
const { scrapeZ2U } = require('./z2u');
const { scrapeGameflip } = require('./gameflip');
const { scrapeStewieShop } = require('./stewieshop');
const { scrapePlati } = require('./plati');

async function scrapeAll(query) {
  const settled = await Promise.allSettled([
    scrapeG2G(query),
    scrapeFunPay(query),
    scrapeEldorado(query),
    scrapePlayerAuctions(query),
    scrapeZ2U(query),
    scrapeGameflip(query),
    scrapeStewieShop(query),
    scrapePlati(query)
  ]);

  return settled.flatMap(r => r.status === 'fulfilled' ? r.value : []);
}

module.exports = { scrapeAll };
```

## Frontend Design — Clean & Minimal
- Font: system-ui
- Background: #ffffff
- Text: #0a0a0a
- Accent: #2563eb
- Borders: #e5e5e5
- Cheapest result: green left border #16a34a
- Cards: border 1px #e5e5e5, border-radius 8px, padding 16px
- Search input + button at top
- Results grid below
- Loading skeleton cards while fetching
- Empty state: "No results found"
- Each card shows: platform name, item title, price in USD, "View Deal" button

## Monetization
- Free users: "View Deal" links go through ouo.io ad shortener
  - API: `https://ouo.io/api/DqcUwvlx?s=DESTINATION_URL`
- Supporters ($2.50/mo or $10 lifetime): direct links, no ads
- ouo.io shortening is async — show card immediately, update link when ready
- Fall back to direct link if ouo.io fails or times out after 3 seconds

## File Structure
```
/lootreef
  /client
    src/
      App.jsx
      components/
        SearchBar.jsx
        ResultCard.jsx
        ResultsGrid.jsx
  /server
    index.js
    scrapers/
      index.js
      g2g.js
      funpay.js
      eldorado.js
      playerauctions.js
      z2u.js
      gameflip.js
      stewieshop.js
      plati.js
    utils/
      fetchHtml.js
      parser.js
  package.json
```

## Expert Thinking Checkpoints
Before writing any scraper:
- Is this site JS-rendered or server-rendered? (determines render flag)
- What CSS selectors reliably identify listing cards?
- Does the site embed JSON in script tags I can parse instead?
- What's the fallback if selectors return nothing?

Before writing the API:
- Are all scrapers running in parallel with Promise.allSettled?
- Is each scraper wrapped in try/catch returning [] on failure?
- Is the query normalized before being passed to scrapers?

## What NOT To Do
- Never fetch target sites directly — always use ScraperAPI
- Never let one scraper crash the others
- Never block the UI waiting for slow scrapers
- Never hardcode selectors without fallbacks
- Never leave incomplete files or TODOs
- Never use import/export — use require/module.exports in Node.js
