import React, { useState, useEffect, useRef } from 'react';
import TodaysDeal from './TodaysDeal';
import SponsorCardPreview from './SponsorCardPreview';

const DISMISS_KEY = 'sponsoredTodaysDealDismissedDate';
const API_BASE = '/api/sponsors';

/**
 * SponsoredTodaysDealOverlay
 *
 * Wraps TodaysDeal with an optional sponsored overlay.
 * - Fetches the active todays_deal sponsor slot on mount
 * - Shows the sponsored card as an overlay on top of the real TodaysDeal
 * - Dismissible via "Skip Ad" button — stores today's date in localStorage
 * - Next calendar day, the overlay reappears even if previously dismissed
 * - If no active todays_deal slot exists, renders TodaysDeal normally
 *
 * Props are forwarded to TodaysDeal (e.g. onSearch).
 */
export default function SponsoredTodaysDealOverlay({ onSearch }) {
  const [sponsoredSlot, setSponsoredSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const impressionFiredRef = useRef(false);

  // Get today's date as YYYY-MM-DD for consistent comparison
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // Check if the overlay was dismissed today
  const isDismissedToday = () => {
    try {
      const dismissedDate = localStorage.getItem(DISMISS_KEY);
      return dismissedDate === getTodayStr();
    } catch {
      return false;
    }
  };

  // Fetch active todays_deal sponsor slot on mount
  useEffect(() => {
    let isMounted = true;

    // If already dismissed today, skip the fetch entirely
    if (isDismissedToday()) {
      setLoading(false);
      setShowOverlay(false);
      return;
    }

    fetch(`${API_BASE}/active?placement=todays_deal&limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const slots = data.slots || [];
        if (slots.length > 0) {
          setSponsoredSlot(slots[0]);
          setShowOverlay(true);
        }
      })
      .catch((err) => {
        console.error('[SponsoredTodaysDealOverlay] Fetch error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fire impression once when the overlay is actually shown
  useEffect(() => {
    if (showOverlay && sponsoredSlot?.id && !impressionFiredRef.current) {
      impressionFiredRef.current = true;
      fetch(`${API_BASE}/${sponsoredSlot.id}/impression`, { method: 'POST' }).catch((err) => {
        console.error('[SponsoredTodaysDealOverlay] Impression tracking error:', err);
      });
    }
  }, [showOverlay, sponsoredSlot]);

  // Dismiss handler — store today's date in localStorage
  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      localStorage.setItem(DISMISS_KEY, getTodayStr());
    } catch {
      // localStorage may be unavailable in some contexts
    }
    setShowOverlay(false);
  };

  // If still loading, don't show anything extra (TodaysDeal has its own loading state)
  // If no sponsored slot or overlay not shown, just render TodaysDeal normally
  if (!showOverlay || !sponsoredSlot) {
    return <TodaysDeal onSearch={onSearch} />;
  }

  // Show sponsored overlay on top of TodaysDeal
  return (
    <div className="mt-8 mb-4 max-w-2xl mx-auto w-full animate-hero-slide-up" style={{ animationDelay: '250ms', position: 'relative' }}>
      {/* Sponsored overlay — positioned on top */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'relative' }}>
          <SponsorCardPreview
            slot={sponsoredSlot}
            variant="todays_deal"
            className=""
          />

          {/* Skip Ad dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 border border-amber-500/30 px-3 py-1.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-amber-400/40 focus:outline-none z-10 backdrop-blur-sm shadow-sm"
            aria-label="Skip sponsored deal"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Skip Ad
          </button>
        </div>
      </div>

      {/* Real TodaysDeal hidden behind — revealed when overlay is dismissed */}
      {/* This is never actually visible while the overlay is showing, but it's mounted
          so it fetches its data and is ready for instant reveal on dismiss */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, visibility: 'hidden', pointerEvents: 'none' }}>
        <TodaysDeal onSearch={onSearch} />
      </div>
    </div>
  );
}
