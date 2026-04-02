const axios = require('axios');

async function testZ2UList() {
  const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-with': 'XMLHttpRequest',
    'origin': 'https://www.z2u.com',
    'referer': 'https://www.z2u.com/search'
  };

  try {
    const data = new URLSearchParams();
    data.append('keywords', 'valorant account');
    data.append('page', '1');

    console.log('Fetching Z2U products API...');
    const res = await axios.post('https://www.z2u.com/searchProductList', data.toString(), { 
        headers: headers,
        timeout: 10000 
    });

    console.log(`Status: ${res.status}`);
    const resData = res.data;
    
    if (resData.code && resData.html) {
      console.log('Found HTML payload! Length:', resData.html.length);
      console.log(resData.html.substring(0, 1000));
    } else {
      console.log('Unexpected response:', JSON.stringify(resData).substring(0, 500));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testZ2UList();
