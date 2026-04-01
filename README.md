<div align="center">

# 🔍 PriceScout

**Find the best price instantly.**

Compare prices for game keys, in-game currency, accounts & digital services across **8 marketplaces** in real time.

[![Platforms](https://img.shields.io/badge/platforms-8-blue?style=for-the-badge)](#-supported-platforms)
[![Built With](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#-tech-stack)
[![Backend](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#-tech-stack)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#-tech-stack)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#-tech-stack)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](#-license)

<br />

[![Homepage Screenshot](https://img.shields.io/badge/📸_Homepage-View_Screenshot-2ea44f?style=for-the-badge)](docs/images/homepage.png)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Demo](#-demo)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Supported Platforms](#-supported-platforms)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Adding a New Scraper](#-adding-a-new-scraper)
- [Disclaimer](#️-disclaimer)
- [License](#-license)

---

## 💡 About

**PriceScout** is a real-time price comparison engine for digital gaming goods. Instead of manually checking multiple marketplaces for the cheapest Valorant account, WoW gold, CS2 skins, or game keys — PriceScout searches **8 platforms simultaneously** and presents results sorted by price in a clean, unified interface.

Type a query, hit search, and get thousands of results in ~20 seconds — all sorted from cheapest to most expensive, with direct links to each deal.

---

## 🎬 Demo

<div align="center">

[![Watch Demo](https://img.shields.io/badge/▶_Watch_Demo-Streamable-1DA1F2?style=for-the-badge&logo=streamable&logoColor=white)](https://streamable.com/dwtohv)

</div>

---

## 📸 Screenshots

<div align="center">

### Homepage

[![Homepage](https://img.shields.io/badge/🏠_Homepage-Find_the_best_price_instantly-4285F4?style=for-the-badge)](docs/images/homepage.png)

> Clean landing page with search bar and list of supported platforms

<br />

### Search Results — "valorant account"

[![Valorant Search](https://img.shields.io/badge/🎮_Valorant_Account-3,149_results_in_20s-7C3AED?style=for-the-badge)](docs/images/search-valorant.png)

> Results across 8 platforms — sorted low → high — with Best Price badges

<br />

### Search Results — "wow gold"

[![WoW Gold Search](https://img.shields.io/badge/⚔️_WoW_Gold-60_results_with_best_price-F59E0B?style=for-the-badge)](docs/images/search-wow-gold.png)

> Platform-tagged cards with seller info and direct "View Deal" links

</div>

---

## 🏗 Architecture

<div align="center">

[![Architecture](https://img.shields.io/badge/🏗_Architecture-View_Diagram-E34F26?style=for-the-badge)](docs/images/architecture.png)

</div>

```
React Frontend (:5173)
├── /api/search ──► Express API (:3001) ──► Promise.allSettled ──► 8 Scrapers ──► ScraperAPI Proxy ──► Target Sites
└── /api/shorten ──► ouo.io Monetization
```

**Flow:**

1. User types a search query on the **React frontend**
2. Frontend sends a request to the **Express backend** (`/api/search`)
3. Backend fires off all **8 scrapers in parallel** using `Promise.allSettled`
4. Each scraper routes through **ScraperAPI** (proxy / anti-bot bypass) to fetch listings from target marketplaces
5. Results are **normalized, merged, and sorted by price** (low → high)
6. Frontend displays results with platform badges, seller info, prices, and "View Deal" links
7. Outbound links are optionally monetized via **ouo.io** link shortener (`/api/shorten`)

---

## 🌐 Supported Platforms

<div align="center">

[![G2G](https://img.shields.io/badge/G2G-FF6600?style=for-the-badge)](https://www.g2g.com)
[![FunPay](https://img.shields.io/badge/FunPay-7B2BFC?style=for-the-badge)](https://funpay.com)
[![Eldorado.gg](https://img.shields.io/badge/Eldorado.gg-00C853?style=for-the-badge)](https://www.eldorado.gg)
[![PlayerAuctions](https://img.shields.io/badge/PlayerAuctions-1565C0?style=for-the-badge)](https://www.playerauctions.com)
[![Z2U](https://img.shields.io/badge/Z2U-FF4081?style=for-the-badge)](https://www.z2u.com)
[![Gameflip](https://img.shields.io/badge/Gameflip-00BCD4?style=for-the-badge)](https://gameflip.com)
[![StewieShop](https://img.shields.io/badge/StewieShop-FF9800?style=for-the-badge)](https://stewieshop.com)
[![Plati.market](https://img.shields.io/badge/Plati.market-4CAF50?style=for-the-badge)](https://plati.market)

</div>

| Platform | Type | Website |
|----------|------|---------|
| ![G2G](https://img.shields.io/badge/G2G-FF6600?style=flat-square) | Marketplace | [g2g.com](https://www.g2g.com) |
| ![FunPay](https://img.shields.io/badge/FunPay-7B2BFC?style=flat-square) | Marketplace | [funpay.com](https://funpay.com) |
| ![Eldorado.gg](https://img.shields.io/badge/Eldorado.gg-00C853?style=flat-square) | Marketplace | [eldorado.gg](https://www.eldorado.gg) |
| ![PlayerAuctions](https://img.shields.io/badge/PlayerAuctions-1565C0?style=flat-square) | Marketplace | [playerauctions.com](https://www.playerauctions.com) |
| ![Z2U](https://img.shields.io/badge/Z2U-FF4081?style=flat-square) | Marketplace | [z2u.com](https://www.z2u.com) |
| ![Gameflip](https://img.shields.io/badge/Gameflip-00BCD4?style=flat-square) | Marketplace | [gameflip.com](https://gameflip.com) |
| ![StewieShop](https://img.shields.io/badge/StewieShop-FF9800?style=flat-square) | Store | [stewieshop.com](https://stewieshop.com) |
| ![Plati.market](https://img.shields.io/badge/Plati.market-4CAF50?style=flat-square) | Marketplace | [plati.market](https://plati.market) |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ![Search](https://img.shields.io/badge/🔎_Multi--Platform_Search-blue?style=flat-square) | Scrapes 8 marketplaces simultaneously |
| ![Speed](https://img.shields.io/badge/⚡_Parallel_Execution-orange?style=flat-square) | `Promise.allSettled` — one slow platform won't block the rest |
| ![Sort](https://img.shields.io/badge/💰_Price_Sorting-green?style=flat-square) | Results automatically sorted low → high (USD) |
| ![Badge](https://img.shields.io/badge/🏷️_Best_Price_Badge-red?style=flat-square) | Cheapest listings highlighted at a glance |
| ![Tags](https://img.shields.io/badge/🎨_Platform_Badges-purple?style=flat-square) | Color-coded tags per marketplace |
| ![Seller](https://img.shields.io/badge/👤_Seller_Info-teal?style=flat-square) | Displays seller name & rating where available |
| ![Links](https://img.shields.io/badge/🔗_Direct_Links-navy?style=flat-square) | "View Deal" buttons link straight to the original listing |
| ![Proxy](https://img.shields.io/badge/🛡️_Proxy_Support-gray?style=flat-square) | ScraperAPI handles anti-bot protections |
| ![Money](https://img.shields.io/badge/💵_Monetization-gold?style=flat-square) | Optional ouo.io integration for outbound links |
| ![UI](https://img.shields.io/badge/🖥️_Clean_UI-cyan?style=flat-square) | Responsive card-based layout |
| ![Status](https://img.shields.io/badge/🟢_Live_Status-brightgreen?style=flat-square) | Shows how many platforms are currently reachable |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| ![Frontend](https://img.shields.io/badge/Frontend-4285F4?style=flat-square) | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) |
| ![Backend](https://img.shields.io/badge/Backend-000000?style=flat-square) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) |
| ![Scraping](https://img.shields.io/badge/Scraping-E34F26?style=flat-square) | ![Cheerio](https://img.shields.io/badge/Cheerio-E88C1F?style=flat-square) ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) |
| ![Proxy](https://img.shields.io/badge/Proxy-gray?style=flat-square) | ![ScraperAPI](https://img.shields.io/badge/ScraperAPI-2EA44F?style=flat-square) |
| ![Monetization](https://img.shields.io/badge/Monetization-F59E0B?style=flat-square) | ![ouo.io](https://img.shields.io/badge/ouo.io-FF6B6B?style=flat-square) |

---

## 🚀 Getting Started

### Prerequisites

![Node](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-latest-CB3837?style=flat-square&logo=npm&logoColor=white)
![ScraperAPI](https://img.shields.io/badge/ScraperAPI-API_Key_Required-2EA44F?style=flat-square)
![ouo.io](https://img.shields.io/badge/ouo.io-Optional-gray?style=flat-square)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pricescout.git
cd pricescout

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Required
SCRAPER_API_KEY=your_scraperapi_key_here

# Optional (link monetization)
OUO_API_KEY=your_ouo_io_api_key_here

# Server config
PORT=3001
```

### Running the App

```bash
# Terminal 1 — Start the backend
cd server
npm run dev
# ✅ Express API running on http://localhost:3001

# Terminal 2 — Start the frontend
cd client
npm run dev
# ✅ React app running on http://localhost:5173
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser and start searching!

---

## ⚙ How It Works

### ![Step 1](https://img.shields.io/badge/1-Search_Query-4285F4?style=for-the-badge)

The user enters a search term (e.g., `"valorant account"`, `"wow gold"`, `"csgo skins"`).

### ![Step 2](https://img.shields.io/badge/2-Parallel_Scraping-FF6600?style=for-the-badge)

The backend fires all 8 scrapers concurrently:

```javascript
const results = await Promise.allSettled([
  scrapeG2G(query),
  scrapeFunPay(query),
  scrapeEldorado(query),
  scrapePlayerAuctions(query),
  scrapeZ2U(query),
  scrapeGameflip(query),
  scrapeStewieShop(query),
  scrapePlatiMarket(query),
]);
```

Each scraper sends requests through **ScraperAPI** to bypass anti-bot measures.

### ![Step 3](https://img.shields.io/badge/3-Normalization-00C853?style=for-the-badge)

Each scraper returns results in a unified format:

```javascript
{
  title: "Valorant Account | Full Access | 50 Skins",
  price: 4.99,
  currency: "USD",
  platform: "FunPay",
  seller: "frozen505",
  url: "https://funpay.com/lots/..."
}
```

### ![Step 4](https://img.shields.io/badge/4-Merge_&_Sort-7C3AED?style=for-the-badge)

All results are merged into a single array and sorted by price (low → high). The cheapest listings get a **"BEST PRICE"** badge.

### ![Step 5](https://img.shields.io/badge/5-Display-E91E63?style=for-the-badge)

The React frontend renders results as responsive cards with platform badges, price, seller info, and direct links.

---

## 📁 Project Structure

```
pricescout/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # SearchBar, ResultCard, Header, etc.
│   │   ├── pages/           # Home, Results
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── server/                  # Express backend
│   ├── scrapers/            # One file per platform
│   │   ├── g2g.js
│   │   ├── funpay.js
│   │   ├── eldorado.js
│   │   ├── playerauctions.js
│   │   ├── z2u.js
│   │   ├── gameflip.js
│   │   ├── stewieshop.js
│   │   └── platimarket.js
│   ├── routes/
│   │   ├── search.js        # /api/search endpoint
│   │   └── shorten.js       # /api/shorten endpoint
│   ├── index.js             # Express entry point
│   ├── .env
│   └── package.json
│
├── docs/images/             # Screenshots & diagrams
└── README.md
```

---

## 📡 API Reference

### ![GET](https://img.shields.io/badge/GET-/api/search-4285F4?style=for-the-badge)

Search across all platforms.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | ![string](https://img.shields.io/badge/string-blue?style=flat-square) | ![required](https://img.shields.io/badge/required-red?style=flat-square) | Search query |

**Example:**

```bash
curl "http://localhost:3001/api/search?q=valorant+account"
```

**Response:**

```json
{
  "query": "valorant account",
  "total": 3149,
  "time": "20s",
  "results": [
    {
      "title": "RENT 1 HOUR 1 HOUR PER REVIEW",
      "price": 0.01,
      "currency": "USD",
      "platform": "FunPay",
      "seller": "frozen505",
      "url": "https://funpay.com/lots/..."
    }
  ]
}
```

---

### ![POST](https://img.shields.io/badge/POST-/api/shorten-00C853?style=for-the-badge)

Shorten/monetize an outbound URL via ouo.io.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | ![string](https://img.shields.io/badge/string-blue?style=flat-square) | ![required](https://img.shields.io/badge/required-red?style=flat-square) | URL to shorten |

**Response:**

```json
{
  "shortened": "https://ouo.io/abc123"
}
```

---

## 🔧 Adding a New Scraper

![Step 1](https://img.shields.io/badge/Step_1-Create_Scraper_File-4285F4?style=flat-square) Create a new file in `server/scrapers/`:

```javascript
// server/scrapers/newplatform.js
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeNewPlatform(query) {
  const url = `https://newplatform.com/search?q=${encodeURIComponent(query)}`;

  const { data } = await axios.get('https://api.scraperapi.com', {
    params: {
      api_key: process.env.SCRAPER_API_KEY,
      url: url,
    },
  });

  const $ = cheerio.load(data);
  const results = [];

  $('.listing-item').each((_, el) => {
    results.push({
      title: $(el).find('.title').text().trim(),
      price: parseFloat($(el).find('.price').text().replace('$', '')),
      currency: 'USD',
      platform: 'NewPlatform',
      seller: $(el).find('.seller').text().trim(),
      url: $(el).find('a').attr('href'),
    });
  });

  return results;
}

module.exports = { scrapeNewPlatform };
```

![Step 2](https://img.shields.io/badge/Step_2-Register_in_Search_Route-FF6600?style=flat-square) Import and add it to the `Promise.allSettled` array in the search route.

![Step 3](https://img.shields.io/badge/Step_3-Add_Badge_Color-00C853?style=flat-square) Add the platform badge color in the frontend components.

---

## ⚠️ Disclaimer

> **PriceScout is a price comparison tool.** It aggregates publicly available listing data from third-party marketplaces. We are **not affiliated with any platform listed**. All trademarks, product names, and logos belong to their respective owners. Use responsibly and in accordance with each platform's Terms of Service.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

[![Star](https://img.shields.io/badge/⭐_Star_this_repo-if_it_helped_you-yellow?style=for-the-badge)](#)

Made with ☕ and too many API calls.

</div>
```
