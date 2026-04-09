import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { useCurrency } from '../CurrencyContext';
import { loadBookmarks, removeBookmark } from '../bookmarks';

const PLATFORM_COLORS = {
  'G2G': 'badge-g2g',
  'FunPay': 'badge-funpay',
  'Eldorado.gg': 'badge-eldorado',
  'PlayerAuctions': 'badge-playerauctions',
  'Z2U': 'badge-z2u',
  'Gameflip': 'badge-gameflip',
  'StewieShop': 'badge-stewieshop',
  'Plati.market': 'badge-plati',
};

function BookmarksSection({ hide }) {
  const { user } = useAuth();
  const { convert, currency } = useCurrency();
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBookmarks = useCallback(async () => {
    const items = await loadBookmarks(user);
    setBookmarks(items);
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
    
    // Listen for custom event to refresh when a bookmark is added/removed from ResultCard
    const handleUpdate = () => {
      fetchBookmarks();
    };
    window.addEventListener('bookmarksUpdated', handleUpdate);
    return () => {
      window.removeEventListener('bookmarksUpdated', handleUpdate);
    };
  }, [fetchBookmarks]);

  const handleDelete = async (offerUrl) => {
    await removeBookmark(offerUrl, user);
    await fetchBookmarks();
    // Dispatch event to update ResultCards (unfill heart if they are visible)
    window.dispatchEvent(new Event('bookmarksUpdated'));
  };

  if (hide) return null;
  if (bookmarks.length === 0) return null;

  return (
    <div className="mt-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
      <p className="text-sm font-semibold text-text mb-3 px-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Saved deals
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {bookmarks.map((b) => {
          const offer = b.offer;
          if (!offer) return null;
          const badgeClass = PLATFORM_COLORS[offer.platform] || 'bg-gray-500 text-white';

          return (
            <div key={offer.url} className="relative bg-white border border-border rounded-xl p-3 flex flex-col hover:border-primary/30 transition-colors shadow-sm group">
              <button 
                onClick={() => handleDelete(offer.url)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove saved deal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2 mb-2 pr-6">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${badgeClass}`}>
                  {offer.platform}
                </span>
                <span className="text-xs font-semibold text-text truncate">
                  {offer.price != null ? convert(offer.price) : 'N/A'} {offer.price != null ? currency : ''}
                </span>
              </div>
              
              <h4 className="text-xs text-text-secondary leading-snug line-clamp-2 mb-3">
                {offer.title}
              </h4>
              
              <a 
                href={offer.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center w-full py-1.5 bg-surface-alt hover:bg-border text-text text-xs font-medium rounded-lg transition-colors border border-border"
              >
                View Deal
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookmarksSection;
