# LootReef: Dynamic "Today's Deal" System Architecture

## 1. Overview
The "Today's Deal" system is a fully automated, full-stack feature designed to highlight a single high-value digital product every 24 hours on the LootReef homepage. Instead of hardcoding deals, the system uses the existing scraping engine to fetch the absolute cheapest live price across all supported marketplaces, seamlessly injecting it into the UI.

## 2. Backend Architecture (`server/utils/dailyDeal.js`)

### Deterministic Topic Rotation
We defined an array of 8 premium, high-search-volume topics (Spotify, Netflix, Discord, ChatGPT, Steam, Xbox, Adobe CC, 1Password). 
To determine which topic is active on any given day, we use a deterministic mathematical formula:
```javascript
const dayIndex = Math.floor(Date.now() / 86400000) % topics.length;
```
This takes the total number of days since the Unix Epoch (Jan 1, 1970) and uses the modulo operator (`%`) to map it to a specific index in the array. This ensures that every 24 hours, exactly at Midnight UTC, the index automatically increments by 1 for all users globally.

### The Scraping Engine
When the server needs to fetch the deal of the day, it essentially runs a "headless search". It executes `scrapeAll(topic.searchQuery)`, waits for all integrated marketplaces (G2G, Eldorado, Gameflip, etc.) to return their results, and then sorts them programmatically to extract the absolute lowest price available on the internet at that exact moment.

### Cache Stampede Protection & In-Memory Caching
Scraping 7 platforms takes time (typically 5-15 seconds). If 100 users open LootReef at the exact same second, we don't want to trigger 100 concurrent scrapes (which would immediately rate-limit our proxies and overload the server).
- **The Lock (`pendingPromise`):** If a scrape is currently in progress, any subsequent incoming requests simply `await` the exact same promise rather than starting a parallel scrape.
- **The Cache (`dailyCache`):** Once a deal is found, it is saved in the server's RAM along with today's date string. Any user who visits the site for the remainder of the day gets the instant, cached response (0ms delay).

### Automated Midnight Pre-fetch
The server calculates exactly how many milliseconds are left until the next UTC midnight and sets a precise `setTimeout`. When the clock strikes midnight, it automatically clears the cache and triggers a silent "pre-fetch" in the background. This ensures the next day's deal is pre-loaded into memory before the first user of the day even visits the site.

## 3. Frontend Integration (`client/src/components/TodaysDeal.jsx`)

### Skeleton Loading State
Because the very first scrape of the day (if the pre-fetch fails) takes a few seconds, we implemented a pulsing "Skeleton Loader". This reserves the exact height and layout of the deal card on the screen to prevent annoying Cumulative Layout Shifts (CLS) while the data is fetching over the network.

### Context Integration
The component heavily hooks into the global application state:
1. **Auth & Bookmarks (`useAuth`, `bookmarks.js`):** It checks if the user is logged in and syncs the heart/save button directly with Supabase. If the user is a guest, it gracefully falls back to `localStorage`.
2. **Currency Converter (`useCurrency`):** We strictly pass the price as a raw `Number` from the backend. The frontend then multiplies this by live exchange rates and formats it perfectly (e.g., converting `$2.99` to `€2.75` dynamically based on user preference).
3. **i18n (`useTranslation`):** The component architecture supports future multi-language scaling.

### URL Shortening & Seamless Redirects
When a user clicks the deal, we want to route them through our tracking/shortening system rather than exposing massive, ugly marketplace affiliate URLs. We intercept the click and rapidly pass the URL through our internal `/api/shorten` endpoint. We added a strict 5-second `AbortController` timeout safeguard—if the shortener API is slow, we immediately fall back to the raw URL so the user isn't kept waiting.

### User Experience (UX) Persistence
If a user clicks the "X" to dismiss the deal, we save two keys into their browser's local storage: `todaysDealDismissed: true` and `todaysDealDismissedDate: '5/9/2026'`. The React component runs a check on mount. If the dates match, it returns `null` (hiding the component). Tomorrow, when their local date changes, the check fails, the state resets, and the new deal is shown automatically.

## 4. The "White Screen" Bug & Resolution
During deployment, we encountered a severe React crash that resulted in a blank screen.
- **The Cause:** The backend's in-memory cache was holding onto an old string format (`"$10.99"`) from a previous build state, but the frontend's currency converter explicitly expected a strict `Number`. When the converter attempted to run `.toFixed()` on a string, JavaScript threw a fatal `TypeError`. In React, an unhandled error during rendering crashes the entire component tree, wiping out the UI. Additionally, an unsupported `catch {` syntax was causing parse errors in older build targets.
- **The Fix:** We implemented a strict type check (`typeof deal.price === 'number'`) in the JSX before passing data to the currency converter. We also added the `(err)` parameter to the catch blocks to ensure backwards compatibility with older JS environments, guaranteeing the UI gracefully falls back instead of breaking the entire application.
