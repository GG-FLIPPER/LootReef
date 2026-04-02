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
    timeout: 90000 // Increased timeout for JS-rendered and premium ScraperAPI requests
  });

  return response.data;
}

module.exports = { fetchHtml };
