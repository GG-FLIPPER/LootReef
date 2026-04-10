import { useEffect } from 'react';

const PLATFORM_CHIP_COLORS = {
  'G2G': { on: 'bg-[#ff6b00] text-white border-[#ff6b00]', off: 'bg-surface text-[#ff6b00] border-[#ff6b00]/40' },
  'FunPay': { on: 'bg-[#7c3aed] text-white border-[#7c3aed]', off: 'bg-surface text-[#7c3aed] border-[#7c3aed]/40' },
  'Eldorado.gg': { on: 'bg-[#d97706] text-white border-[#d97706]', off: 'bg-surface text-[#d97706] border-[#d97706]/40' },
  'PlayerAuctions': { on: 'bg-[#2563eb] text-white border-[#2563eb]', off: 'bg-surface text-[#2563eb] border-[#2563eb]/40' },
  'Z2U': { on: 'bg-[#dc2626] text-white border-[#dc2626]', off: 'bg-surface text-[#dc2626] border-[#dc2626]/40' },
  'Gameflip': { on: 'bg-[#059669] text-white border-[#059669]', off: 'bg-surface text-[#059669] border-[#059669]/40' },
  'Plati.market': { on: 'bg-[#0891b2] text-white border-[#0891b2]', off: 'bg-surface text-[#0891b2] border-[#0891b2]/40' },
};

const FALLBACK_CHIP = { on: 'bg-gray-500 text-white border-gray-500', off: 'bg-surface text-gray-500 border-gray-500/40' };

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'platform-az', label: 'Platform: A → Z' },
  { value: 'relevant', label: 'Most Relevant' },
];

function FilterDrawer({
  isOpen,
  onClose,
  sortMode,
  onSortChange,
  platforms,
  platformFilters,
  onPlatformToggle,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  hideNullPrices,
  onHideNullToggle,
}) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="sm:hidden fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-fade-in"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl shadow-2xl drawer-slide-up max-h-[80vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-text">Filters & Sort</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-alt text-text-secondary hover:bg-border transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sort */}
          <div className="mb-5">
            <label htmlFor="mobile-sort-select" className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">
              Sort by
            </label>
            <select
              id="mobile-sort-select"
              value={sortMode}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-surface text-text outline-none focus:border-primary transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Platforms */}
          <div className="mb-5">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">Platforms</span>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => {
                const colors = PLATFORM_CHIP_COLORS[p] || FALLBACK_CHIP;
                const isOn = platformFilters[p] !== false;
                return (
                  <button
                    key={p}
                    onClick={() => onPlatformToggle(p)}
                    className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all duration-200 ${
                      isOn ? colors.on : colors.off
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price range */}
          <div className="mb-5">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">Price Range</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-1.5 border border-border rounded-lg px-3 py-2">
                <span className="text-sm text-text-secondary">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => onPriceMinChange(e.target.value)}
                  className="w-full text-sm bg-transparent text-text outline-none"
                />
              </div>
              <span className="text-text-secondary">—</span>
              <div className="flex-1 flex items-center gap-1.5 border border-border rounded-lg px-3 py-2">
                <span className="text-sm text-text-secondary">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => onPriceMaxChange(e.target.value)}
                  className="w-full text-sm bg-transparent text-text outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hide null prices */}
          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-sm text-text">Hide results without price</span>
              <div className={`toggle-switch ${hideNullPrices ? 'active' : ''}`} onClick={onHideNullToggle}>
                <div className="toggle-knob" />
              </div>
            </label>
          </div>

          {/* Apply button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark active:scale-[0.98] transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterDrawer;
