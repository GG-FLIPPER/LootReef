import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import { loadHistory, deleteSearch } from '../searchHistory';

function RecentSearches({ onSearch, refreshRef, hide }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  const refresh = useCallback(async () => {
    const items = await loadHistory(user);
    console.log('[RecentSearches] loadHistory result:', items);
    setHistory(items);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Expose refresh function to parent via ref
  useEffect(() => {
    if (refreshRef) refreshRef.current = refresh;
  }, [refreshRef, refresh]);


  const handleDelete = async (entry, e) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteSearch(entry, user);
    await refresh();
  };

  if (hide) return null;
  if (history.length === 0) return null;

  return (
    <div className="recent-searches fade-in-up">
      <p className="recent-searches-label">{t('search.recentSearches')}</p>
      <div className="recent-searches-chips">
        {history.map((entry, i) => (
          <button
            key={entry.id || `${entry.query}-${entry.timestamp}`}
            className="search-chip animate-spring-pop"
            style={{ animationDelay: `${i * 50}ms` }}
            onClick={(e) => {
              e.preventDefault();
              onSearch(entry.query);
            }}
            title={entry.query}
          >
            <span className="search-chip-text">{entry.query}</span>
            <span
              className="search-chip-x"
              onClick={(e) => handleDelete(entry, e)}
              role="button"
              aria-label={`Remove ${entry.query}`}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;
