function parseItemName(raw) {
  return raw
    .toLowerCase()
    .replace(/[⚡🔥💯✅👑]/g, '')
    .replace(/\b(cheap|fast|instant|delivery|best|trusted|safe|legit|verified|top|sell|buy)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = { parseItemName };
