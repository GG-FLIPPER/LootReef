const axios = require('axios');

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY;

/**
 * G2G Scraper — uses ScraperAPI to proxy requests to sls.g2g.com.
 *
 * How G2G search works:
 *   1. Keyword search → returns brands (e.g. "Spotify", "Spotify Premium")
 *   2. Each brand has categories, each with a service_id
 *   3. The offer/search endpoint accepts brand_id + service_id to return listings
 */

const G2G_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'origin': 'https://www.g2g.com',
  'referer': 'https://www.g2g.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

/**
 * Route a request through ScraperAPI with premium residential proxies.
 */
function viaScraperAPI(targetUrl, timeoutMs = 15000) {
  return axios.get('http://api.scraperapi.com', {
    headers: G2G_HEADERS,
    params: {
      api_key: SCRAPERAPI_KEY,
      url: targetUrl,
      premium: 'true',
      keep_headers: 'true'
    },
    timeout: timeoutMs
  });
}

async function scrapeG2G(query) {
  console.log(`[G2G] Starting scrape for query: "${query}"`);
  
  if (!SCRAPERAPI_KEY) {
    console.error('[G2G] ERROR: SCRAPERAPI_KEY is not defined in environment variables.');
    return [];
  }

  try {
    // ── STRATEGY A: Keyword Search -> brand_id + service_id ──────
    console.log(`[G2G] Strategy A: Keyword search...`);
    const kwUrl = `https://sls.g2g.com/offer/keyword/search?q=${encodeURIComponent(query)}&root_id=all&include_cat=1`;

    let brands = [];
    try {
      const kwRes = await viaScraperAPI(kwUrl, 10000);
      brands = kwRes.data?.payload?.results || [];
      console.log(`[G2G] Strategy A: Keyword search returned ${brands.length} brand(s)`);
    } catch (e) {
      console.error(`[G2G] Strategy A: Keyword search failed: ${e.message}`);
    }

    if (brands.length > 0) {
      // Pick the best brand
      const qLower = query.toLowerCase().trim();
      const exactBrand = brands.find(b =>
        b.default_name.toLowerCase() === qLower ||
        b.seo_term.toLowerCase() === qLower.replace(/\s+/g, '-')
      );
      const bestBrand = exactBrand || brands[0];
      console.log(`[G2G] Best brand match: "${bestBrand.default_name}" (brand_id: ${bestBrand.brand_id})`);

      // Collect unique (brand_id, service_id) pairs
      const pairs = new Map();
      for (const cat of (bestBrand.categories || [])) {
        if (cat.service_id && !pairs.has(cat.service_id)) {
          pairs.set(cat.service_id, {
            brandId: bestBrand.brand_id,
            serviceId: cat.service_id
          });
        }
      }

      // Also include the second brand if available to catch related items (e.g. "Spotify Premium")
      if (brands.length > 1) {
        const secondBrand = brands[1];
        for (const cat of (secondBrand.categories || [])) {
          const key = `${secondBrand.brand_id}|${cat.service_id}`;
          if (cat.service_id && !pairs.has(key)) {
            pairs.set(key, {
              brandId: secondBrand.brand_id,
              serviceId: cat.service_id
            });
          }
        }
      }

      const pairList = [...pairs.values()];
      console.log(`[G2G] Strategy A: Found ${pairList.length} service_id(s) to query`);

      if (pairList.length > 0) {
        // Limit to max 2 queries for speed
        const searchPairs = pairList.slice(0, 2);
        console.log(`[G2G] Strategy A: Querying ${searchPairs.length} endpoint(s)...`);
        
        const promises = searchPairs.map(({ brandId, serviceId }) => {
          const offerUrl = `https://sls.g2g.com/offer/search?brand_id=${encodeURIComponent(brandId)}&service_id=${encodeURIComponent(serviceId)}&sort=lowest_price&page_size=48&currency=USD&country=US&include_localization=0&v=v2`;
          return viaScraperAPI(offerUrl)
            .then(r => {
              const res = r.data?.payload?.results || [];
              console.log(`[G2G] Strategy A: Received ${res.length} offers for brand_id=${brandId}, service_id=${serviceId}`);
              return res;
            })
            .catch(err => {
               console.error(`[G2G] Strategy A: Fetch failed for brand_id=${brandId}: ${err.message}`);
               return [];
            });
        });

        const batches = await Promise.all(promises);
        const allItems = batches.flat();

        if (allItems.length > 0) {
          console.log(`[G2G] Strategy A: Success. Total items: ${allItems.length}`);
          return processResults(allItems);
        } else {
           console.log(`[G2G] Strategy A: Returned 0 results. Falling back to Strategy B...`);
        }
      }
    } else {
       console.log(`[G2G] Strategy A: No brands found. Falling back to Strategy B...`);
    }

    // ── STRATEGY B: Fallback to seo_term ──────
    console.log(`[G2G] Strategy B: Using seo_term fallbacks...`);
    const qSlug = query.toLowerCase().trim().replace(/\s+/g, '-');
    
    // Test common G2G slugs (both software and game patterns)
    const fallbackSlugs = [
      `${qSlug}-accounts`,         // Software/Apps
      `${qSlug}-account-for-sale`, // Games
      `${qSlug}-top-up`            // In-app currency/subs
    ];

    let allFallbackItems = [];
    // Only query the first one that works, to save time/requests (max 2)
    for (let i = 0; i < Math.min(fallbackSlugs.length, 2); i++) {
       const slug = fallbackSlugs[i];
       console.log(`[G2G] Strategy B: Trying seo_term="${slug}"...`);
       try {
         const url = `https://sls.g2g.com/offer/search?seo_term=${encodeURIComponent(slug)}&sort=lowest_price&page_size=48&currency=USD&country=US&include_localization=0&v=v2`;
         const res = await viaScraperAPI(url);
         const items = res.data?.payload?.results || [];
         console.log(`[G2G] Strategy B: Received ${items.length} offers for seo_term="${slug}"`);
         
         if (items.length > 0) {
           allFallbackItems = items;
           break; // Stop trying fallbacks once we get results
         }
       } catch (err) {
         console.error(`[G2G] Strategy B: Failed for seo_term="${slug}": ${err.message}`);
       }
    }

    console.log(`[G2G] Strategy B: Finished. Total fallback items: ${allFallbackItems.length}`);
    return processResults(allFallbackItems);

  } catch (e) {
    console.error(`[G2G] Fatal Error: ${e.response?.data ? `${e.message} - ${JSON.stringify(e.response.data)}` : e.message}`);
    return [];
  }
}

function processResults(allItems) {
    // Deduplicate by offer_id
    const seen = new Set();
    const items = [];
    for (const item of allItems) {
      if (item.offer_id && !seen.has(item.offer_id)) {
        seen.add(item.offer_id);
        items.push(item);
      }
    }

    console.log(`[G2G] After deduplication: ${items.length} items`);
    return items.map(mapOffer);
}

/**
 * Map a raw G2G offer object to our standard result shape.
 */
function mapOffer(i) {
  const price = parseFloat(i.display_price);

  return {
    platform: 'G2G',
    title: i.title || '',
    price: !isNaN(price) ? price : null,
    currency: i.display_currency || 'USD',
    url: `https://www.g2g.com/offer/${i.offer_id}`,
    seller_rating: i.username || i.seller_name || null
  };
}

module.exports = { scrapeG2G };
