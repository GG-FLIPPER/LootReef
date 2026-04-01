const axios = require('axios');

async function testBackend() {
  try {
    const res = await axios.get('http://localhost:3001/api/search?q=valorant account', { timeout: 30000 });
    console.log('Backend response status:', res.status);
    console.log('Results count:', res.data.results?.length);
  } catch (e) {
    if (e.response) {
      console.error('Backend HTTP Error:', e.response.status, e.response.data);
    } else {
      console.error('Backend Error:', e.message);
    }
  }
}

testBackend();
