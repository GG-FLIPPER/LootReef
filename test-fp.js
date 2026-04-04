const axios = require('axios');
const cheerio = require('cheerio');
async function test() {
  try {
    const res = await axios.get('https://funpay.com/en/lots/220/', { headers: { 'user-agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(res.data);
    const links = [];
    $('.tc-item').slice(0, 3).each((i, el) => links.push($(el).attr('href')));
    console.log('FunPay extracted links:', links);
  } catch(e) {
    console.log('Error:', e.message);
  }
}
test();
