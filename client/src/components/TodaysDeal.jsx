import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import { useCurrency } from '../CurrencyContext';
import { saveBookmark, removeBookmark, isBookmarked } from '../bookmarks';

export default function TodaysDeal({ onSearch }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { convert, currency } = useCurrency();
  const [deal, setDeal] = useState(null);
  const [dismissed, setDismissed] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  useEffect(() => {
    // Check dismissal status for today
    const isDismissed = localStorage.getItem('todaysDealDismissed');
    const dismissedDate = localStorage.getItem('todaysDealDismissedDate');
    const today = new Date().toLocaleDateString();
    
    if (dismissedDate === today && isDismissed === 'true') {
      setDismissed(true);
      setLoading(false);
      return;
    } else {
      setDismissed(false);
    }
    
    // Fetch dynamic deal from backend
    fetch('/api/todays-deal')
      .then(res => res.json())
      .then(data => {
        if (!data || !data.id) {
          setLoading(false);
          return;
        }
        
        // Check global saved status
        isBookmarked(data.url, user).then(res => {
          setSaved(res);
        });
        
        setDeal(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch todays deal:', err);
        setLoading(false);
      });
  }, []);

  if (dismissed) return null;

  if (loading) {
    return (
      <div className="mt-8 mb-4 max-w-2xl mx-auto w-full animate-hero-slide-up" style={{ animationDelay: '250ms' }}>
        <div className="relative overflow-hidden bg-surface-alt border border-border rounded-2xl p-4 shadow-sm text-left flex items-center gap-4 h-24 animate-pulse">
          <div className="w-14 h-14 rounded-xl bg-border flex-shrink-0"></div>
          <div className="flex-grow space-y-2">
            <div className="h-3 bg-border rounded w-1/4"></div>
            <div className="h-4 bg-border rounded w-3/4"></div>
            <div className="h-3 bg-border rounded w-full"></div>
          </div>
          <div className="flex flex-col items-end gap-2 w-20">
            <div className="h-3 bg-border rounded w-3/4"></div>
            <div className="h-6 bg-border rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) return null;

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    localStorage.setItem('todaysDealDismissed', 'true');
    localStorage.setItem('todaysDealDismissedDate', new Date().toLocaleDateString());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (saved) {
      setSaved(false);
      await removeBookmark(deal.url, user);
    } else {
      setSaved(true);
      await saveBookmark(deal, user);
    }
    window.dispatchEvent(new Event('bookmarksUpdated'));
  };

  const shortenUrl = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(`/api/shorten?url=${encodeURIComponent(url)}`, { signal: controller.signal });
      const data = await res.json();
      clearTimeout(timeout);
      return data.shortUrl || url;
    } catch (err) {
      clearTimeout(timeout);
      return url;
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!deal.url) return;
    
    let shareUrl = deal.url;
    try {
      shareUrl = await shortenUrl(deal.url);
    } catch (err) {}
    
    const shareText = `LootReef Today's Deal: ${deal.title}! Check it out here:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "LootReef Today's Deal",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleDealClick = async (e) => {
    e.preventDefault();
    if (isUrlLoading || !deal.url) return;
    setIsUrlLoading(true);

    const newWindow = window.open('', '_blank');
    if (newWindow) newWindow.opener = null;

    try {
      const shortUrl = await shortenUrl(deal.url);
      if (newWindow) newWindow.location.href = shortUrl;
      else window.open(shortUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      if (newWindow) newWindow.location.href = deal.url;
      else window.open(deal.url, '_blank', 'noopener,noreferrer');
    } finally {
      setIsUrlLoading(false);
    }
  };

  return (
    <div className="mt-8 mb-4 max-w-2xl mx-auto w-full animate-hero-slide-up" style={{ animationDelay: '250ms' }}>
      <div className="relative overflow-hidden bg-gradient-to-br from-surface-alt to-surface border border-primary/20 rounded-2xl p-4 shadow-sm group hover:shadow-md transition-shadow hover:border-primary/40 cursor-pointer text-left" onClick={handleDealClick}>
        
        {/* Glossy top edge */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-accent-green to-primary opacity-70"></div>
        
        {/* Dismiss Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-text-secondary hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-full transition-colors z-10"
          aria-label="Dismiss deal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent-green/10 flex items-center justify-center border border-primary/20 flex-shrink-0 text-3xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] dark:shadow-none">
            {deal.emoji}
          </div>

          <div className="flex-grow pr-8 sm:pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm">Today's Deal</span>
              <span className="text-xs text-text-secondary font-medium">{deal.tag}</span>
              <span className="text-xs text-text-secondary font-medium px-2 py-0.5 bg-surface rounded-full border border-border ml-1">{deal.platform}</span>
            </div>
            <h3 className="text-lg font-bold text-text leading-tight group-hover:text-primary transition-colors">
              <a href={deal.url} target="_blank" rel="noopener noreferrer" className="hover:underline" onClick={handleDealClick}>
                {deal.title} {isUrlLoading && <span className="inline-block ml-1 w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>}
              </a>
            </h3>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {deal.description}
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:gap-1 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border sm:border-0">
            <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-0">
              <span className="text-sm text-text-secondary line-through opacity-70">{deal.originalPrice}</span>
              {deal.price != null ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-accent-green">
                    {typeof deal.price === 'number' ? convert(deal.price) : deal.price}
                  </span>
                  {typeof deal.price === 'number' && (
                    <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{currency}</span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-text-secondary italic">N/A</span>
              )}
            </div>
            
            <div className="flex gap-2 relative z-10">
              {/* Share Button */}
              <button 
                onClick={handleShare}
                className="p-2 bg-surface hover:bg-border border border-border rounded-lg text-text-secondary hover:text-text transition-colors relative group/btn"
                aria-label="Share deal"
                title="Share"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
              </button>

              {/* Save/Favorite Button */}
              <button 
                onClick={handleSave}
                className={`p-2 border rounded-lg transition-colors ${
                  saved 
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' 
                    : 'bg-surface hover:bg-border border-border text-text-secondary hover:text-red-500'
                }`}
                aria-label={saved ? "Remove from favorites" : "Save deal"}
                title="Save"
              >
                <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
