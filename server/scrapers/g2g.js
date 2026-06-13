const axios = require('axios');

const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY;

const G2G_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'origin': 'https://www.g2g.com',
  'referer': 'https://www.g2g.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

// Cache the categories map so we only fetch it once per process lifetime
let categoriesCache = null;

/**
 * Fetch a G2G API URL through ScrapingBee proxy.
 */
async function fetchViaScrapingBee(targetUrl) {
  const res = await axios.get('https://app.scrapingbee.com/api/v1', {
    params: {
      api_key: SCRAPINGBEE_KEY,
      url: targetUrl,
      render_js: 'false',
      forward_headers: 'true'
    },
    headers: G2G_HEADERS,
    timeout: 15000
  });
  return res.data;
}

/**
 * Fetch (and cache) the G2G categories.json which maps
 * "{service_id}_{brand_id}" => { seo_term } for building valid URLs.
 */
async function getCategoriesMap() {
  if (categoriesCache) return categoriesCache;
  try {
    const res = await axios.get('https://assets.g2g.com/offer/categories.json', {
      timeout: 10000
    });
    categoriesCache = res.data;
    return categoriesCache;
  } catch (e) {
    console.log('G2G categories.json fetch failed:', e.message);
    return {};
  }
}

/**
 * Build a valid G2G category URL from service_id + brand_id using the categories map.
 * Falls back to the base game seo_term if the lookup fails.
 * Deep-links to the individual offer when offerId is available.
 */
function buildOfferUrl(catMap, serviceId, brandId, baseSeoTerm, offerId) {
  let slug;
  if (serviceId && brandId) {
    const entry = catMap[`${serviceId}_${brandId}`];
    if (entry?.seo_term) {
      slug = entry.seo_term;
    }
  }
  slug = slug || baseSeoTerm;
  if (offerId) {
    return `https://www.g2g.com/categories/${slug}/offer/${offerId}`;
  }
  return `https://www.g2g.com/categories/${slug}?sort=lowest_price`;
}

async function scrapeG2G(query) {
  try {
    const baseGameQuery = query.trim();
    if (!baseGameQuery) return [];

    // 1. Fetch categories map (cached after first call)
    const catMap = await getCategoriesMap();

    // 2. Fetch Category seo_term + service_id via keyword search
    let baseSeoTerm;
    let serviceId;
    let brandId;
    try {
      const targetUrl = `https://sls.g2g.com/offer/keyword/search?q=${encodeURIComponent(baseGameQuery)}&root_id=all&include_cat=1`;
      const kwData = await fetchViaScrapingBee(targetUrl);

      console.log('G2G keyword raw:', JSON.stringify(kwData).slice(0, 500));

      const results = kwData?.payload?.results;
      if (!results || results.length === 0) {
        throw new Error('No results found');
      }

      // Find an exact match for the base game name, otherwise fallback to the highest scored first element
      const exactMatch = results.find(r => r.default_name.toLowerCase() === baseGameQuery.toLowerCase() || r.seo_term.toLowerCase() === baseGameQuery.toLowerCase());
      const matched = exactMatch || results[0];
      baseSeoTerm = matched.seo_term;
      serviceId = matched.categories?.[0]?.service_id;
      brandId = matched.brand_id;

      console.log(`G2G resolved => seo_term: ${baseSeoTerm}, service_id: ${serviceId}, brand_id: ${brandId}`);
    } catch (e) {
      baseSeoTerm = baseGameQuery.trim().replace(/\s+/g, '-').toLowerCase();
      serviceId = undefined;
      brandId = undefined;
    }

    // 3. Fetch the listings
    let items = [];
    try {
      let targetUrl;
      if (brandId) {
        const svcParam = serviceId ? `&service_id=${encodeURIComponent(serviceId)}` : '';
        targetUrl = `https://sls.g2g.com/offer/search?brand_id=${encodeURIComponent(brandId)}${svcParam}&sort=lowest_price&page_size=48&currency=USD&country=US&include_localization=0&v=v2`;
      } else {
        targetUrl = `https://sls.g2g.com/offer/search?seo_term=${encodeURIComponent(baseSeoTerm)}&sort=lowest_price&page_size=48&currency=USD&country=US&include_localization=0&v=v2`;
      }
      console.log('G2G search URL:', targetUrl);
      const sData = await fetchViaScrapingBee(targetUrl);
      items = sData?.payload?.results || sData?.results || [];
    } catch (e) {
      if (e.response && e.response.status === 404 && !brandId) {
        console.log('G2G search 404 on slug fallback, no results');
      } else if (e.response && e.response.status === 404 && brandId) {
        try {
          const fallbackSlug = baseGameQuery.trim().replace(/\s+/g, '-').toLowerCase();
          const targetUrl = `https://sls.g2g.com/offer/search?seo_term=${encodeURIComponent(fallbackSlug)}&sort=lowest_price&page_size=48&currency=USD&country=US&include_localization=0&v=v2`;
          console.log('G2G fallback search URL:', targetUrl);
          const fbData = await fetchViaScrapingBee(targetUrl);
          items = fbData?.payload?.results || fbData?.results || [];
        } catch (fbErr) {
          console.log('G2G slug fallback also failed:', fbErr.message);
        }
      } else {
        throw e;
      }
    }

    // 4. Map results — deep-link each item via the categories map + offer_id
    return items.map(i => {
      const itemUrl = buildOfferUrl(catMap, i.service_id, i.brand_id, baseSeoTerm, i.offer_id);
      return {
        platform: 'G2G',
        title: i.title || i.description?.slice(0, 80) || baseSeoTerm,
        price: parseFloat(i.display_price) || null,
        currency: i.display_currency || 'USD',
        url: itemUrl,
        seller_rating: i.username || null
      };
    });

  } catch (e) {
    console.error('G2G scraper error:', e.response?.data ? `${e.message} - ${JSON.stringify(e.response.data)}` : e.message);
    return [];
  }
}

module.exports = { scrapeG2G };
