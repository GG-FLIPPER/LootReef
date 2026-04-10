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

function FilterBar({
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
  return (
    <div className="hidden sm:block mb-4 fade-in-up">
      {/* Row 1: Sort + Hide null prices */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortMode}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-surface text-text outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Price range */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Price</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-secondary">$</span>
            <input
              id="price-min"
              type="number"
              min="0"
              step="0.01"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              className="w-20 text-sm border border-border rounded-lg px-2 py-1.5 bg-surface text-text outline-none focus:border-primary transition-colors"
            />
          </div>
          <span className="text-xs text-text-secondary">—</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-secondary">$</span>
            <input
              id="price-max"
              type="number"
              min="0"
              step="0.01"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className="w-20 text-sm border border-border rounded-lg px-2 py-1.5 bg-surface text-text outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Hide null prices */}
        <label htmlFor="hide-null-toggle" className="flex items-center gap-2 cursor-pointer select-none">
          <div className={`toggle-switch ${hideNullPrices ? 'active' : ''}`} onClick={onHideNullToggle}>
            <div className="toggle-knob" />
          </div>
          <span className="text-xs text-text-secondary whitespace-nowrap">Hide no-price</span>
        </label>
      </div>

      {/* Row 2: Platform chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider mr-1">Platforms</span>
        {platforms.map((p) => {
          const colors = PLATFORM_CHIP_COLORS[p] || FALLBACK_CHIP;
          const isOn = platformFilters[p] !== false;
          return (
            <button
              key={p}
              onClick={() => onPlatformToggle(p)}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border transition-all duration-200 cursor-pointer ${
                isOn ? colors.on : colors.off
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
