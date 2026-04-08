const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'README.md',
  'server/index.js',
  'CLAUDE.md',
  'walkthrough.md',
  'Building PriceScout Web App.md'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/PriceScout/g, 'LootReef');
    content = content.replace(/pricescout/g, 'lootreef');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
