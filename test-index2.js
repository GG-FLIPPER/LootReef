const { scrapeAll } = require('./server/scrapers/index');
const fs = require('fs');

async function testAll() {
  const queries = ['wow gold', 'valorant account'];
  const log = [];

  for (const query of queries) {
    log.push(`\n=== Testing query: "${query}" ===`);
    try {
      const results = await scrapeAll(query);
      
      const summary = {};
      results.forEach(r => {
        if (!summary[r.platform]) summary[r.platform] = 0;
        summary[r.platform]++;
      });
      
      log.push('Platforms and results count:');
      for (const [platform, count] of Object.entries(summary)) {
        log.push(`- ${platform}: ${count} items`);
      }
      
      if (results.length > 0) {
        log.push(`\nSample result for ${query}:`);
        log.push(JSON.stringify(results[Math.floor(Math.random() * results.length)], null, 2));
      }
    } catch (e) {
      log.push(`Error for ${query}: ${e.message}`);
    }
  }
  
  fs.writeFileSync('test-summary.log', log.join('\n'));
  console.log('Done test');
}

testAll();
