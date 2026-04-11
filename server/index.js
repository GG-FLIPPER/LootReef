require('dotenv').config();
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
  if (!destination) return res.status(400).send('URL is required');

  try {
    const apiKey = process.env.OUO_API_KEY;
    const response = await axios.get(`https://ouo.io/api/${apiKey}?s=${encodeURIComponent(destination)}`, {
      timeout: 5000
    });
    
    const shortUrl = response.data.trim();
    if (!shortUrl.startsWith('http')) {
      console.error(`[ouo.io error] Invalid response (non-URL):`, shortUrl);
      return res.json({ short: destination });
    }
    
    res.json({ short: shortUrl });
  } catch (err) {
    if (err.response) {
      console.error(`[ouo.io error] Status: ${err.response.status}, Body:`, err.response.data);
    } else {
      console.error(`[ouo.io error] Request failed:`, err.message);
    }
    res.json({ short: destination });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LootReef API running on port ${PORT}`));
