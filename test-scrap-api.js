const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://api.scraperapi.com', {
      params: {
        api_key: '3db90afce2774e79a53dc2e5f176c674',
        url: 'https://sls.g2g.com/offer/keyword/search?q=netflix&root_id=all&include_cat=1',
        premium: 'true'
      }
    });
    console.log(res.status, res.data);
  } catch (err) {
    console.error('Error:', err.response ? `${err.response.status} - ${JSON.stringify(err.response.data)}` : err.message);
  }
}

test();
