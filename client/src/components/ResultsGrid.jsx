import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import ResultCard from './ResultCard';

function SkeletonCard() {
  return (
    <div className="border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton w-20 h-5"></div>
        <div className="skeleton w-12 h-4"></div>
      </div>
      <div className="skeleton w-full h-4 mb-2"></div>
      <div className="skeleton w-3/4 h-4 mb-4"></div>
      <div className="flex items-end justify-between">
        <div>
          <div className="skeleton w-24 h-8 mb-1"></div>
          <div className="skeleton w-10 h-3"></div>
        </div>
        <div className="skeleton w-24 h-9 rounded-lg"></div>
      </div>
    </div>
  );
}

function ResultsGrid({ results, loading, searched, bookmarkedUrls }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (searched && results.length === 0) {
    return (
      <div className="text-center py-20 fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-alt flex items-center justify-center">
          <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text mb-1">{t('results.noResults')}</h3>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          {t('results.noResultsHint')}
        </p>
      </div>
    );
  }

  if (!searched) return null;

  // Find the cheapest result with a valid price
  const cheapestPrice = Math.min(...results.filter(r => r.price != null).map(r => r.price));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
      {results.map((result, i) => (
        <ResultCard
          key={`${result.platform}-${result.title}-${i}`}
          result={result}
          index={i}
          isCheapest={result.price != null && result.price === cheapestPrice}
          initialBookmarked={bookmarkedUrls?.has(result.url) || false}
        />
      ))}
    </div>
  );
}

export default memo(ResultsGrid);
