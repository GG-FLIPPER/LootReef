import { useState, useEffect } from 'react';

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

function ResultCard({ result, index, isCheapest }) {
  const [shortUrl, setShortUrl] = useState(null);
  const [linkReady, setLinkReady] = useState(false);

  // Asynchronously shorten the URL via ouo.io
  useEffect(() => {
    if (!result.url) return;
    setLinkReady(false);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    fetch(`/api/shorten?url=${encodeURIComponent(result.url)}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data.short) setShortUrl(data.short);
        setLinkReady(true);
      })
      .catch(() => {
        setLinkReady(true); // fall back to direct link
      })
      .finally(() => clearTimeout(timer));

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [result.url]);

  const href = shortUrl || result.url;
  const badgeClass = PLATFORM_COLORS[result.platform] || 'bg-gray-500 text-white';
  const delay = Math.min(index * 60, 600);

  return (
    <div
      className={`fade-in-up group relative border rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white ${
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

      {/* Top row: platform badge + rating */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${badgeClass}`}>
          {result.platform}
        </span>
        {result.seller_rating && (
          <span className="text-xs text-text-secondary flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {result.seller_rating}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-text leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {result.title}
      </h3>

      {/* Price + CTA */}
      <div className="flex items-end justify-between mt-auto">
        <div>
          {result.price != null ? (
            <>
              <p className={`text-2xl font-extrabold tracking-tight ${isCheapest ? 'text-accent-green' : 'text-text'}`}>
                ${result.price.toFixed(2)}
              </p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">{result.currency}</p>
            </>
          ) : (
            <p className="text-sm text-text-secondary italic">Price not available</p>
          )}
        </div>

        <a
          id={`view-deal-${index}`}
          href={linkReady ? href : '#'}
          onClick={e => { if (!linkReady) e.preventDefault(); }}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            !linkReady ? 'bg-gray-400 text-white cursor-not-allowed opacity-70' :
            isCheapest
              ? 'bg-accent-green text-white hover:bg-green-700 active:scale-95'
              : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
          }`}
        >
          {linkReady ? 'View Deal' : 'Wait...'}
          {linkReady && (
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </a>
      </div>
    </div>
  );
}

export default ResultCard;
