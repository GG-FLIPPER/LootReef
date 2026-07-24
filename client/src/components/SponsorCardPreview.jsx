import React, { useState } from 'react';

/**
 * SponsorCardPreview — Reusable preview of how a sponsored card will render.
 * Used by the admin review page now, and will be used by the display/injection logic in step 3.
 *
 * Props:
 *   slot        — the sponsor_slots row (or form data with the same shape)
 *   variant     — 'deal_card' | 'todays_deal' (defaults to slot.placement)
 *   className   — optional extra classNames
 */
export default function SponsorCardPreview({ slot, variant, className = '' }) {
  const type = variant || slot.placement;
  const [imgError, setImgError] = useState(false);

  if (type === 'todays_deal') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-surface-alt to-surface border border-primary/20 rounded-2xl p-4 shadow-sm text-left ${className}`}>
        {/* Glossy top edge */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-accent-green to-primary opacity-70" />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Image / fallback icon */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent-green/10 flex items-center justify-center border border-primary/20 flex-shrink-0 overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
            {slot.image_url && !imgError ? (
              <img
                src={slot.image_url}
                alt={slot.card_title}
                className="w-full h-full object-cover rounded-xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-2xl">📢</span>
            )}
          </div>

          <div className="flex-grow pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                Sponsored
              </span>
              {slot.company_name && (
                <span className="text-xs text-text-secondary font-medium px-2 py-0.5 bg-surface rounded-full border border-border">
                  {slot.company_name}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text leading-tight">
              {slot.card_title || 'Untitled'}
            </h3>
            {slot.card_description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {slot.card_description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <a
              href={slot.target_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark active:scale-95 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              Visit
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Image error warning */}
        {imgError && (
          <div className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Image failed to load — URL may be broken
          </div>
        )}
      </div>
    );
  }

  // ─── deal_card variant ───
  return (
    <div className={`border rounded-xl p-4 sm:p-5 bg-surface border-border transition-all duration-200 hover:shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary">
            Sponsored
          </span>
          {slot.company_name && (
            <span className="text-xs text-text-secondary font-medium">
              {slot.company_name}
            </span>
          )}
        </div>
      </div>

      {/* Image (if provided) */}
      {slot.image_url && !imgError && (
        <div className="mb-3 rounded-lg overflow-hidden border border-border-light">
          <img
            src={slot.image_url}
            alt={slot.card_title}
            className="w-full h-32 object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-sm font-semibold text-text leading-snug mb-1 line-clamp-2">
        {slot.card_title || 'Untitled'}
      </h3>

      {/* Description */}
      {slot.card_description && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">
          {slot.card_description}
        </p>
      )}

      {/* CTA */}
      <div className="flex items-end justify-end mt-auto">
        <a
          href={slot.target_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark active:scale-95 transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          Visit
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Image error warning */}
      {imgError && (
        <div className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Image failed to load — URL may be broken
        </div>
      )}
    </div>
  );
}
