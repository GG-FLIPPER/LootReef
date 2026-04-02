const { scrapeAll } = require('./server/scrapers/index');

async function testAll() {
  const queries = ['wow gold', 'valorant account'];

  for (const query of queries) {
    console.log(`\n=== Testing query: "${query}" ===`);
    try {
      const results = await scrapeAll(query);
      
      const summary = {};
      results.forEach(r => {
        if (!summary[r.platform]) summary[r.platform] = 0;
        summary[r.platform]++;
      });
      
      console.log('Platforms and results count:');
      for (const [platform, count] of Object.entries(summary)) {
        console.log(`- ${platform}: ${count} items`);
      }
      
      if (results.length > 0) {
        console.log(`\nSample result for ${query}:`);
        console.log(results[Math.floor(Math.random() * results.length)]);
      }
    } catch (e) {
      console.error(`Error for ${query}:`, e.message);
    }
  }
}

testAll();
