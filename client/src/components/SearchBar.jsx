import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function SearchBar({ onSearch, loading, compact }) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!compact && inputRef.current) {
      inputRef.current.focus();
    }
  }, [compact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mx-auto transition-all duration-500 ${compact ? 'max-w-2xl' : 'max-w-xl'}`}>
      <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
        loading ? 'border-primary/40 shadow-lg shadow-primary/10' : 'border-border hover:border-primary/50 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/10'
      } ${compact ? 'h-12' : 'h-14'}`}>
        {/* Search icon */}
        <div className="pl-4 pr-2 text-text-secondary">
          {loading ? (
            <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 h-full bg-transparent outline-none text-text placeholder:text-text-secondary/60 text-sm sm:text-base"
          disabled={loading}
        />

        <button
          id="search-button"
          type="submit"
          disabled={loading || !value.trim()}
          className={`h-full px-5 sm:px-6 font-semibold text-sm transition-all duration-200 ${
            loading || !value.trim()
              ? 'bg-border-light text-text-secondary cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
          }`}
        >
          {loading ? t('search.searching') : t('search.button')}
        </button>
      </div>

      {/* Tip text */}
      {!compact && (
        <p className="text-center text-xs text-text-secondary mt-3 opacity-60">
          {t('search.tip')}
        </p>
      )}
    </form>
  );
}

export default SearchBar;
