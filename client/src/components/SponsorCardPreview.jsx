import React from 'react';

/**
 * SponsorCardPreview — Reusable component to render sponsored cards.
 * Structurally matches ResultCard.jsx (deal_card) and TodaysDeal.jsx (todays_deal)
 * to ensure 1:1 dimension and layout parity in search results grid.
 *
 * Props:
 *   slot              — sponsor_slots object
 *   variant           — 'deal_card' | 'todays_deal'
 *   className         — extra Tailwind class names
 *   onCardClick       — optional custom click handler
 */
export default function SponsorCardPreview({
  slot,
  variant,
  className = '',
  onCardClick,
}) {
  const type = variant || slot.placement;

  const handleLinkClick = (e) => {
    // Trigger click tracking if slot has an id
    if (slot.id) {
      fetch(`/api/sponsors/${slot.id}/click`, { method: 'POST' }).catch((err) => {
        console.error('[SponsorCard] Click tracking error:', err);
      });
    }

    if (onCardClick) {
      onCardClick(slot, e);
    }
  };

  // ─── todays_deal variant (matches TodaysDeal.jsx layout) ───
  if (type === 'todays_deal') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-surface-alt to-surface border border-amber-500/30 rounded-2xl p-4 shadow-sm text-left ${className}`}>
        {/* Glossy top edge with amber highlight */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400 via-accent-green to-amber-500 opacity-80" />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/10 to-primary/10 flex items-center justify-center border border-amber-500/20 flex-shrink-0 overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
            <span className="text-2xl">📢</span>
          </div>

          <div className="flex-grow pr-8 sm:pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-sm border border-amber-500/30">
                ★ Sponsored
              </span>
              {slot.company_name && (
                <span className="text-xs text-text-secondary font-medium px-2 py-0.5 bg-surface rounded-full border border-border">
                  {slot.company_name}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text leading-tight">
              <a href={slot.target_url || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline" onClick={handleLinkClick}>
                {slot.card_title || 'Untitled'}
              </a>
            </h3>
            {slot.card_description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {slot.card_description}
              </p>
            )}
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:gap-1 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border sm:border-0">
            <a
              href={slot.target_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark active:scale-95 transition-all duration-200"
              onClick={handleLinkClick}
            >
              View Deal
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── deal_card variant (EXACT 1:1 structural match to ResultCard.jsx) ───
  return (
    <div
      className={`fade-in-up group relative border rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-surface border-border border-t-2 border-t-amber-400 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header: Platform/Sponsor badge, Company name */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 max-w-[70%]">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0 bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              ★ Sponsored
            </span>
            {slot.company_name && (
              <span className="text-xs text-text-secondary flex items-center gap-1 truncate">
                <span className="truncate">{slot.company_name}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-text leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {slot.card_title || 'Untitled'}
        </h3>

        {/* Description (if present) */}
        {slot.card_description && (
          <p className="text-xs text-text-secondary mb-3 line-clamp-2">
            {slot.card_description}
          </p>
        )}
      </div>

      {/* Price + CTA (mt-auto matches ResultCard layout) */}
      <div className="flex items-end justify-between mt-auto">
        <div>
          {slot.price_paid != null && slot.price_paid > 0 ? (
            <>
              <p className="text-2xl font-extrabold tracking-tight text-text">
                ${slot.price_paid}
              </p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider">{slot.currency || 'USD'}</p>
            </>
          ) : (
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Promoted</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <a
            href={slot.target_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark active:scale-95 transition-all duration-200"
          >
            View Deal
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
