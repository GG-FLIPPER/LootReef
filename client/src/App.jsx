import { useState, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import ResultsGrid from './components/ResultsGrid';
import FilterBar from './components/FilterBar';
import FilterDrawer from './components/FilterDrawer';
import CurrencySelector from './components/CurrencySelector';
import AuthModal from './components/AuthModal';
import RecentSearches from './components/RecentSearches';
import BookmarksSection from './components/BookmarksSection';
import { useAuth } from './AuthContext';
import { saveSearch } from './searchHistory';


function App() {
  const { user, profile, signOut } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [query, setQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [homeKey, setHomeKey] = useState(0);

  // Logo nav reset
  const goHome = useCallback(() => {
    setSearched(false);
    setQuery('');
    setResults([]);
    setElapsed(null);
    setSortMode('price-asc');
    setPlatformFilters({});
    setPriceMin('');
    setPriceMax('');
    setHomeKey(prev => prev + 1);
  }, []);

  // Ref to refresh recent searches after a search is saved
  const recentSearchesRef = useRef(null);

  // Filter & sort state
  const [sortMode, setSortMode] = useState('price-asc');
  const [platformFilters, setPlatformFilters] = useState({});
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [hideNullPrices, setHideNullPrices] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);


  // Derive unique platforms from actual results
  const platforms = useMemo(() => {
    const set = new Set(results.map((r) => r.platform));
    return [...set].sort();
  }, [results]);

  // Apply filtering + sorting
  const filteredResults = useMemo(() => {
    let items = [...results];

    // Filter by platform
    items = items.filter((r) => platformFilters[r.platform] !== false);

    // Filter by price range
    const min = priceMin !== '' ? parseFloat(priceMin) : null;
    const max = priceMax !== '' ? parseFloat(priceMax) : null;

    if (min !== null || max !== null || hideNullPrices) {
      items = items.filter((r) => {
        if (r.price == null || (hideNullPrices && r.price === 0)) return !hideNullPrices;
        if (min !== null && r.price < min) return false;
        if (max !== null && r.price > max) return false;
        return true;
      });
    }

    // Sort
    if (sortMode === 'price-asc') {
      items.sort((a, b) => {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return a.price - b.price;
      });
    } else if (sortMode === 'price-desc') {
      items.sort((a, b) => {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return b.price - a.price;
      });
    } else if (sortMode === 'platform-az') {
      items.sort((a, b) => a.platform.localeCompare(b.platform));
    }
    // 'relevant' = original order, no sort needed

    return items;
  }, [results, sortMode, platformFilters, priceMin, priceMax, hideNullPrices]);

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim();
    setQuery(trimmed);
    setLoading(true);
    setSearched(true);
    setResults([]);
    setElapsed(null);

    // Reset filters on new search
    setSortMode('price-asc');
    setPlatformFilters({});
    setPriceMin('');
    setPriceMax('');
    setHideNullPrices(false);
    setFiltersOpen(false);

    // Save search to history (manual search bar submission only)
    saveSearch(trimmed, user).then(() => {
      // Trigger refresh of recent searches chips
      if (recentSearchesRef.current) recentSearchesRef.current();
    });

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(data.results || []);
      setElapsed(data.elapsed || null);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Search triggered by clicking a recent-search chip — skips saveSearch()
  const handleChipSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim();
    setQuery(trimmed);
    setLoading(true);
    setSearched(true);
    setResults([]);
    setElapsed(null);

    // Reset filters on new search
    setSortMode('price-asc');
    setPlatformFilters({});
    setPriceMin('');
    setPriceMax('');
    setHideNullPrices(false);
    setFiltersOpen(false);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(data.results || []);
      setElapsed(data.elapsed || null);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const handlePlatformToggle = useCallback((platform) => {
    setPlatformFilters((prev) => ({
      ...prev,
      [platform]: prev[platform] === false ? true : false,
    }));
  }, []);

  const handleHideNullToggle = useCallback(() => {
    setHideNullPrices((prev) => !prev);
  }, []);

  // Shared filter props for both FilterBar and FilterDrawer
  const filterProps = {
    sortMode,
    onSortChange: setSortMode,
    platforms,
    platformFilters,
    onPlatformToggle: handlePlatformToggle,
    priceMin,
    priceMax,
    onPriceMinChange: setPriceMin,
    onPriceMaxChange: setPriceMax,
    hideNullPrices,
    onHideNullToggle: handleHideNullToggle,
  };

  const hasActiveFilters = hideNullPrices
    || priceMin !== ''
    || priceMax !== ''
    || sortMode !== 'price-asc'
    || Object.values(platformFilters).some((v) => v === false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-white/80 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" onClick={goHome}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-text">
                Loot<span className="text-primary">Reef</span>
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <div className="hidden sm:flex items-center gap-1 text-xs text-text-secondary">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
              {platforms.length > 0 ? `${platforms.length} platforms active` : '7 platforms live'}
            </div>
            {user ? (
              <div className="flex items-center gap-2 bg-surface-alt border border-border rounded-full px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-text">
                  {profile?.username}
                </span>
                <div className="w-px h-4 bg-border mx-1"></div>
                <button onClick={() => signOut()} className="text-xs font-medium text-text-secondary hover:text-text transition-colors">
                  Sign out
                </button>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="auth-nav-btn sign-in-btn">
                Sign in
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Hero / Search Section */}
      <main className="max-w-6xl mx-auto px-4">
        <div className={`transition-all duration-500 ease-out ${searched ? 'pt-6 pb-4' : 'pt-24 pb-16'}`}>
          {!searched && (
            <div className="text-center mb-8 fade-in-up">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-text mb-3 tracking-tight">
                Find the <span className="text-primary">best price</span> instantly
              </h2>
              <p className="text-text-secondary text-lg max-w-xl mx-auto">
                Compare prices for game keys, in-game currency, accounts & digital services across 7 marketplaces in real time.
              </p>
            </div>
          )}
          <SearchBar onSearch={handleSearch} loading={loading} compact={searched} />
          <RecentSearches key={homeKey} onSearch={handleChipSearch} refreshRef={recentSearchesRef} hide={searched} />
          <BookmarksSection key={`bm-${homeKey}`} hide={searched} />
        </div>


        {/* Filter controls (desktop) */}
        {searched && !loading && results.length > 0 && (
          <FilterBar {...filterProps} />
        )}

        {/* Mobile filter button */}
        {searched && !loading && results.length > 0 && (
          <div className="sm:hidden mb-4 fade-in-up">
            <button
              onClick={() => setFiltersOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                hasActiveFilters
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border text-text-secondary hover:border-primary/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters{hasActiveFilters ? ' (active)' : ''}
            </button>
          </div>
        )}

        {/* Stats bar */}
        {searched && !loading && results.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-1 fade-in-up">
            <p className="text-sm text-text-secondary">
              Showing <span className="font-semibold text-text">{filteredResults.length}</span>
              {filteredResults.length !== results.length && (
                <span> of <span className="font-semibold text-text">{results.length}</span></span>
              )}
              {' '}results for "<span className="font-medium text-text">{query}</span>"
              {elapsed && <span className="ml-1">in {elapsed}s</span>}
            </p>
            <p className="text-xs text-text-secondary hidden sm:block">
              {sortMode === 'price-asc' && 'Sorted by price: low → high'}
              {sortMode === 'price-desc' && 'Sorted by price: high → low'}
              {sortMode === 'platform-az' && 'Sorted by platform: A → Z'}
              {sortMode === 'relevant' && 'Sorted by relevance'}
            </p>
          </div>
        )}

        {/* Results */}
        <ResultsGrid results={filteredResults} loading={loading} searched={searched} />

        {/* Platform badges when idle */}
        {!searched && (
          <div className="text-center mt-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider font-medium">Searching across</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['G2G', 'FunPay', 'Eldorado.gg', 'PlayerAuctions', 'Z2U', 'Gameflip', 'Plati.market'].map(p => (
                <span key={p} className="px-3 py-1.5 bg-surface-alt border border-border rounded-full text-xs font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-default">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile filter drawer */}
      <FilterDrawer isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} {...filterProps} />

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-text-secondary">
          LootReef compares prices across third-party marketplaces. We are not affiliated with any platform listed.
        </div>
      </footer>

      {/* Auth modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>

  );
}

export default App;
