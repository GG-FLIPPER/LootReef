import { useState, useCallback, useMemo, useRef, useDeferredValue, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';
import ResultsGrid from './ResultsGrid';
import FilterBar from './FilterBar';
import FilterDrawer from './FilterDrawer';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';
import OnboardingModal from './OnboardingModal';
import AccountSettingsModal from './AccountSettingsModal';
import ResetPassword from './ResetPassword';
import RecentSearches from './RecentSearches';
import BookmarksSection from './BookmarksSection';
import { useAuth } from '../AuthContext';
import { saveSearch } from '../searchHistory';
import { loadBookmarks } from '../bookmarks';
import { useLanguage } from '../LanguageContext';


function SearchApp() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const { targetLanguage, translate } = useLanguage();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [query, setQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountSettingsModalOpen, setAccountSettingsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
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

  // Global bookmarks state for search results
  const [bookmarkedUrls, setBookmarkedUrls] = useState(new Set());

  useEffect(() => {
    const fetchBookmarks = async () => {
      const items = await loadBookmarks(user);
      setBookmarkedUrls(new Set(items.map(b => b.offer.url)));
    };
    fetchBookmarks();

    const handler = () => fetchBookmarks();
    window.addEventListener('bookmarksUpdated', handler);
    return () => window.removeEventListener('bookmarksUpdated', handler);
  }, [user]);


  // Derive unique platforms from actual results
  const platforms = useMemo(() => {
    const set = new Set(results.map((r) => r.platform));
    return [...set].sort();
  }, [results]);

  // Defer filters to prevent typing lag
  const deferredPlatformFilters = useDeferredValue(platformFilters);
  const deferredPriceMin = useDeferredValue(priceMin);
  const deferredPriceMax = useDeferredValue(priceMax);
  const deferredHideNullPrices = useDeferredValue(hideNullPrices);
  const deferredSortMode = useDeferredValue(sortMode);

  // Apply filtering + sorting
  const filteredResults = useMemo(() => {
    let items = [...results];

    // Filter by platform
    items = items.filter((r) => deferredPlatformFilters[r.platform] !== false);

    // Filter by price range
    const min = deferredPriceMin !== '' ? parseFloat(deferredPriceMin) : null;
    const max = deferredPriceMax !== '' ? parseFloat(deferredPriceMax) : null;

    if (min !== null || max !== null || deferredHideNullPrices) {
      items = items.filter((r) => {
        if (r.price == null || (deferredHideNullPrices && r.price === 0)) return !deferredHideNullPrices;
        if (min !== null && r.price < min) return false;
        if (max !== null && r.price > max) return false;
        return true;
      });
    }

    // Sort
    if (deferredSortMode === 'price-asc') {
      items.sort((a, b) => {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return a.price - b.price;
      });
    } else if (deferredSortMode === 'price-desc') {
      items.sort((a, b) => {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return b.price - a.price;
      });
    } else if (deferredSortMode === 'platform-az') {
      items.sort((a, b) => a.platform.localeCompare(b.platform));
    }
    // 'relevant' = original order, no sort needed

    return items;
  }, [results, deferredSortMode, deferredPlatformFilters, deferredPriceMin, deferredPriceMax, deferredHideNullPrices]);

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
      let searchTerm = trimmed;
      if (targetLanguage !== 'en') {
        try {
          const translated = await translate(trimmed, 'en');
          if (translated) {
            searchTerm = translated;
          }
        } catch (translateErr) {
          console.error('Translation of search query failed:', translateErr);
        }
      }

      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data.results || []);
      setElapsed(data.elapsed || null);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [user, targetLanguage, translate]);

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
      let searchTerm = trimmed;
      if (targetLanguage !== 'en') {
        try {
          const translated = await translate(trimmed, 'en');
          if (translated) {
            searchTerm = translated;
          }
        } catch (translateErr) {
          console.error('Translation of search query failed:', translateErr);
        }
      }

      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data.results || []);
      setElapsed(data.elapsed || null);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [targetLanguage, translate]);


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

  if (location.pathname === '/reset-password') {
    return <ResetPassword />;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-surface/80 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" onClick={goHome} className="group">
            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-[1.03]">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-[10deg]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-text">
                Loot<span className="text-primary transition-all duration-300 group-hover:brightness-125">Reef</span>
              </h1>
            </div>
          </Link>          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            <CurrencySelector />
            <ThemeToggle />
            <div className="hidden lg:flex items-center gap-1 text-xs text-text-secondary">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
              {platforms.length > 0 ? t('nav.platformsActive', { count: platforms.length }) : t('nav.platformsLive')}
            </div>
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 bg-surface-alt border border-border rounded-full px-3 py-1.5 transition-all duration-300 hover:brightness-105 hover:scale-[1.02]"
                >
                  <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-text">
                    {profile?.username || user?.user_metadata?.username || user?.email}
                  </span>
                  <svg className={`w-4 h-4 text-text-secondary transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isAccountMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsAccountMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-surface-alt border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-scale-down">
                      <button 
                        onClick={() => { setIsAccountMenuOpen(false); setAccountSettingsModalOpen(true); }}
                        className="w-full text-left px-4 py-2 text-sm text-text hover:bg-border transition-colors font-medium border-b border-border/50"
                      >
                        {t('nav.accountSettings')}
                      </button>
                      <button 
                        onClick={async (e) => { e.preventDefault(); e.stopPropagation(); setIsAccountMenuOpen(false); await signOut(); }}
                        className="w-full text-left px-4 py-2 text-sm text-text hover:bg-border transition-colors hover:text-red-500 font-medium"
                      >
                        {t('nav.signOut')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="auth-nav-btn sign-in-btn">
                {t('nav.signInRegister')}
              </button>
            )}
          </div>

          {/* Mobile Nav Hamburger */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-menu md:hidden absolute top-full left-0 w-full border-b border-border bg-surface px-4 py-4 space-y-4 shadow-lg z-[9999]">
            {user ? (
              <div className="pb-3 border-b border-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 bg-surface-alt border border-border rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-text max-w-[120px] truncate">
                    {profile?.username || user?.user_metadata?.username || user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setAccountSettingsModalOpen(true); }}
                    className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
                  >
                    {t('nav.settings')}
                  </button>
                  <div className="w-px h-4 bg-border"></div>
                  <button 
                    onClick={async (e) => { e.preventDefault(); e.stopPropagation(); setIsMobileMenuOpen(false); await signOut(); }} 
                    className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    {t('nav.signOut')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pb-2 border-b border-border">
                <button onClick={() => { setAuthModalOpen(true); setIsMobileMenuOpen(false); }} className="auth-nav-btn sign-in-btn w-full flex justify-center py-2.5">
                  {t('nav.signInRegister')}
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">{t('nav.theme')}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">{t('nav.language')}</span>
              <LanguageSelector />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">{t('nav.currency')}</span>
              <CurrencySelector />
            </div>
          </div>
        )}
      </header>

      {/* Hero / Search Section */}
      <main className="max-w-6xl mx-auto px-4">
        <div className={`transition-all duration-500 ease-out ${searched ? 'pt-6 pb-4' : 'pt-24 pb-16'}`}>
          {!searched && (
            <div className="text-center mb-8">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-text mb-3 tracking-tight animate-hero-slide-up delay-100">
                {t('hero.title', { interpolation: { escapeValue: false } }).split('<1>').map((part, i) => {
                  if (i === 0) return part;
                  const [highlight, rest] = part.split('</1>');
                  return <span key={i}><span className="text-primary">{highlight}</span>{rest}</span>;
                })}
              </h2>
              <p className="text-text-secondary text-lg max-w-xl mx-auto animate-hero-slide-up delay-200">
                {t('hero.subtitle')}
              </p>
            </div>
          )}
          <div className={`${!searched ? 'animate-hero-slide-up delay-300' : ''}`}>
            <SearchBar onSearch={handleSearch} loading={loading} compact={searched} />
          </div>
          <RecentSearches onSearch={handleChipSearch} refreshRef={recentSearchesRef} hide={searched} />
          <BookmarksSection hide={searched} />
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
              {t('filter.filters')}{hasActiveFilters ? ` (${t('filter.active')})` : ''}
            </button>
          </div>
        )}

        {/* Stats bar */}
        {searched && !loading && results.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-1 fade-in-up">
            <p className="text-sm text-text-secondary">
              {t('results.showing')} <span className="font-semibold text-text">{filteredResults.length}</span>
              {filteredResults.length !== results.length && (
                <span> {t('results.of')} <span className="font-semibold text-text">{results.length}</span></span>
              )}
              {' '}{t('results.resultsFor')} "<span className="font-medium text-text">{query}</span>"
              {elapsed && <span className="ml-1">{t('results.in')} {elapsed}s</span>}
            </p>
            <p className="text-xs text-text-secondary hidden sm:block">
              {sortMode === 'price-asc' && t('results.sortedPriceAsc')}
              {sortMode === 'price-desc' && t('results.sortedPriceDesc')}
              {sortMode === 'platform-az' && t('results.sortedPlatformAz')}
              {sortMode === 'relevant' && t('results.sortedRelevant')}
            </p>
          </div>
        )}

        {/* Results */}
        <ResultsGrid results={filteredResults} loading={loading} searched={searched} bookmarkedUrls={bookmarkedUrls} />

        {/* Platform badges when idle */}
        {!searched && (
          <div className="text-center mt-8 animate-hero-slide-up delay-400">
            <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider font-medium">{t('hero.searchingAcross')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['G2G', 'FunPay', 'Eldorado.gg', 'PlayerAuctions', 'Z2U', 'Gameflip', 'Plati.market'].map((p, i) => (
                <span 
                  key={p} 
                  className="px-3 py-1.5 bg-surface-alt border border-border rounded-full text-xs font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-default animate-hero-slide-up"
                  style={{ animationDelay: `${500 + i * 50}ms` }}
                >
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
          {t('footer.disclaimer')}
        </div>
      </footer>

      {/* Auth & Setup modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <OnboardingModal />
      <AccountSettingsModal isOpen={accountSettingsModalOpen} onClose={() => setAccountSettingsModalOpen(false)} />
    </div>

  );
}

export default SearchApp;
