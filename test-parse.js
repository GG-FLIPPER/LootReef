const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('g2g-raw.html', 'utf8');
const $ = cheerio.load(html);

// Check if any json objects exist in scripts
let foundJson = false;
$('script').each((i, el) => {
  const text = $(el).html() || '';
  if (text.includes('__NEXT_DATA__') || text.includes('__INITIAL_STATE__')) {
    console.log('Found embedded state object!');
    foundJson = true;
  }
});
if (!foundJson) console.log('No embedded JSON found.');

// Find any links containing 'valorant'
const links = [];
$('a[href*="valorant"]').each((i, el) => {
  links.push($(el).attr('href'));
});
console.log('Valorant links:', links.slice(0, 5));

// Find general card classes
const classes = new Set();
$('*').each((i, el) => {
  const cls = $(el).attr('class');
  if (cls && (cls.includes('card') || cls.includes('item') || cls.includes('offer') || cls.includes('product'))) {
    classes.add(cls);
  }
});
console.log('Possible card classes:', Array.from(classes).slice(0, 10));
