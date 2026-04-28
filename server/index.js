const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { scrapeAll } = require('./scrapers');
const { parseItemName } = require('./utils/parser');

const app = express();
app.use(cors());
app.use(express.json());

// Main search endpoint
app.get('/api/search', async (req, res) => {
  const raw = req.query.q || '';
  const query = parseItemName(raw);
  if (!query) return res.json({ results: [] });

  console.log(`[LootReef] Searching: "${query}"`);
  const startTime = Date.now();

  const results = await scrapeAll(query);
  results.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[LootReef] Found ${results.length} results in ${elapsed}s`);

  res.json({ results, elapsed: parseFloat(elapsed) });
});

// Temporary debug endpoint for G2G
app.get('/api/test-g2g', async (req, res) => {
  const { scrapeG2G } = require('./scrapers/g2g');
  const query = req.query.q || 'spotify account';
  const startTime = Date.now();
  try {
    const results = await scrapeG2G(query);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    res.json({ results, elapsed, count: results.length });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
app.get('/api/shorten', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ shortUrl: '' });

  const apiKey = process.env.OUO_API_KEY;
  if (!apiKey) return res.json({ shortUrl: url });

  try {
    const ouoUrl = `https://ouo.io/api/${apiKey}?s=${encodeURIComponent(url)}`;
    const response = await axios.get(ouoUrl, { timeout: 5000 });
    const text = typeof response.data === 'string' ? response.data.trim() : '';
    if (text.startsWith('http')) {
      return res.json({ shortUrl: text });
    }
    return res.json({ shortUrl: url });
  } catch (error) {
    console.error('[Shorten] Error:', error.message);
    return res.json({ shortUrl: url });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LootReef API running on port ${PORT}`));
