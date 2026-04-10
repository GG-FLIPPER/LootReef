const fs = require('fs');
const lines = fs.readFileSync('client/src/index.css', 'utf8').split('\n');
const kept = lines.slice(0, 1546).join('\n');
fs.writeFileSync('client/src/index.css', kept + '\n', 'utf8');
console.log('Truncated to', 1546, 'lines. New size:', kept.length, 'bytes');
