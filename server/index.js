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

// ouo.io link shortening endpoint
app.get('/api/shorten', async (req, res) => {
  const destination = req.query.url;
  if (!destination) return res.json({ short: null });

  try {
    const response = await axios.get(`https://ouo.io/api/DqcUwvlx?s=${encodeURIComponent(destination)}`, {
      timeout: 3000
    });
    res.json({ short: response.data || null });
  } catch {
    // Fall back to direct link if ouo.io fails or times out
    res.json({ short: null });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LootReef API running on port ${PORT}`));
