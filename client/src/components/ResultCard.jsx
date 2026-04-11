import { useState, useEffect, memo, useRef } from 'react';
import { useCurrency } from '../CurrencyContext';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';
import { saveBookmark, removeBookmark } from '../bookmarks';

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

function ResultCard({ result, index, isCheapest, initialBookmarked }) {
  const { convert, currency } = useCurrency();
  const { targetLanguage, translate } = useLanguage();
  const { user } = useAuth();
  const cardRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(initialBookmarked || false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Translation state
  const [displayTitle, setDisplayTitle] = useState(result.title);
  const [hasTranslated, setHasTranslated] = useState(false);

  useEffect(() => {
    setBookmarked(initialBookmarked || false);
  }, [initialBookmarked]);

  // Lazy translate on viewport entry
  useEffect(() => {
    if (!cardRef.current || hasTranslated) return;
    
    // Only translate if target language is not english/default (or translate handles it)
    if (targetLanguage === 'en') {
      setDisplayTitle(result.title);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          
          translate(result.title).then(translated => {
             setDisplayTitle(translated);
             setHasTranslated(true);
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [result.title, targetLanguage, translate, hasTranslated]);

  // If user changes target language globally, reset translation state
  useEffect(() => {
    setHasTranslated(false);
  }, [targetLanguage]);



  const handleBookmarkToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (bookmarked) {
      setBookmarked(false);
      await removeBookmark(result.url, user);
    } else {
      setBookmarked(true);
      await saveBookmark(result, user);
    }
    window.dispatchEvent(new Event('bookmarksUpdated'));
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isSharing || !result.url) return;
    setIsSharing(true);
    
    let shortUrl = result.url;
    try {
      const res = await fetch(`/api/shorten?url=${encodeURIComponent(result.url)}`);
      const data = await res.json();
      if (data.short) {
        shortUrl = data.short;
      }
    } catch (err) {
      console.error("Shortening failed, using original url", err);
    }
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
         await navigator.clipboard.writeText(shortUrl);
      } else {
         throw new Error("Clipboard API not available");
      }
    } catch (err) {
      prompt("Copy the shortened link:", shortUrl);
    }

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    setIsSharing(false);
  };

  const handleViewDeal = async (e) => {
    e.preventDefault();
    if (isLoading || !result.url) return;
    setIsLoading(true);

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.opener = null;
    }

    try {
      const res = await fetch(`/api/shorten?url=${encodeURIComponent(result.url)}`);
      const data = await res.json();
      if (newWindow) newWindow.location.href = data.short || result.url;
      else window.open(data.short || result.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      if (newWindow) newWindow.location.href = result.url;
      else window.open(result.url, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  const badgeClass = PLATFORM_COLORS[result.platform] || 'bg-gray-500 text-white';
  const delay = Math.min(index * 60, 600);

  return (
    <div
      ref={cardRef}
      className={`fade-in-up group relative border rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-surface ${
        isCheapest ? 'border-l-4 border-l-accent-green border-t border-r border-b border-border' : 'border-border'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Cheapest badge */}
      {isCheapest && (
        <div className="absolute -top-2.5 left-3 px-2 py-0.5 bg-accent-green text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
          Best Price
        </div>
      )}

      {/* Header: Platform, Seller, Actions */}
      <div className="flex items-center justify-between mb-3">
        {/* Left side: platform badge + seller name (flex row, gap-2, items-center) */}
        <div className="flex items-center gap-2 max-w-[70%]">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0 ${badgeClass}`}>
            {result.platform}
          </span>
          {result.seller_rating && (
            <span className="text-xs text-text-secondary flex items-center gap-1 truncate">
              <svg className="w-3.5 h-3.5 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="truncate">{result.seller_rating}</span>
            </span>
          )}
        </div>

        {/* Right side: share icon + bookmark icon */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleShare}
            className="text-border hover:text-primary transition-colors focus:outline-none flex justify-center items-center w-6 h-6 rounded-full hover:bg-surface-alt relative"
            disabled={isSharing}
          >
            {isSharing ? (
              <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] font-medium rounded shadow-sm whitespace-nowrap pointer-events-none z-20">
                Copied!
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
              </span>
            )}
          </button>
          
          <button 
            onClick={handleBookmarkToggle}
            className="text-border hover:text-red-500 transition-colors focus:outline-none flex justify-center items-center w-6 h-6 rounded-full hover:bg-surface-alt relative"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${bookmarked ? 'text-red-500 scale-110' : 'hover:scale-110'}`} 
              fill={bookmarked ? "currentColor" : "none"} 
              stroke={bookmarked ? "none" : "currentColor"} 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-text leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {displayTitle}
      </h3>

      {/* Price + CTA */}
      <div className="flex items-end justify-between mt-auto">
        <div>
          {result.price != null ? (
            <>
              <p className={`text-2xl font-extrabold tracking-tight ${isCheapest ? 'text-accent-green' : 'text-text'}`}>
                {convert(result.price)}
              </p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">{currency}</p>
            </>
          ) : (
            <p className="text-sm text-text-secondary italic">Price not available</p>
          )}
        </div>

        <a
          id={`view-deal-${index}`}
          href={result.url || '#'}
          onClick={handleViewDeal}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isLoading ? 'bg-gray-400 text-white cursor-not-allowed opacity-70' :
            isCheapest
              ? 'bg-accent-green text-white hover:bg-green-700 active:scale-95'
              : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
          }`}
        >
          {isLoading ? '...' : 'View Deal'}
          {!isLoading && (
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </a>
      </div>
    </div>
  );
}

export default memo(ResultCard);
