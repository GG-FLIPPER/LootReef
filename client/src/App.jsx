import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import ResultsGrid from './components/ResultsGrid';

const PLATFORMS = [
  'G2G', 'FunPay', 'Eldorado.gg', 'PlayerAuctions',
  'Z2U', 'Gameflip', 'StewieShop', 'Plati.market'
];

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery.trim());
    setLoading(true);
    setSearched(true);
    setResults([]);
    setElapsed(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-white/80 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text">
              Price<span className="text-primary">Scout</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-text-secondary">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
            {PLATFORMS.length} platforms live
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
                Compare prices for game keys, in-game currency, accounts & digital services across {PLATFORMS.length} marketplaces in real time.
              </p>
            </div>
          )}
          <SearchBar onSearch={handleSearch} loading={loading} compact={searched} />
        </div>

        {/* Stats bar */}
        {searched && !loading && results.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-1 fade-in-up">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text">{results.length}</span> results for "<span className="font-medium text-text">{query}</span>"
              {elapsed && <span className="ml-1">in {elapsed}s</span>}
            </p>
            <p className="text-xs text-text-secondary hidden sm:block">
              Sorted by price: low → high
            </p>
          </div>
        )}

        {/* Results */}
        <ResultsGrid results={results} loading={loading} searched={searched} />

        {/* Platform badges when idle */}
        {!searched && (
          <div className="text-center mt-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider font-medium">Searching across</p>
            <div className="flex flex-wrap justify-center gap-2">
              {PLATFORMS.map(p => (
                <span key={p} className="px-3 py-1.5 bg-surface-alt border border-border rounded-full text-xs font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-default">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-text-secondary">
          PriceScout compares prices across third-party marketplaces. We are not affiliated with any platform listed.
        </div>
      </footer>
    </div>
  );
}

export default App;
