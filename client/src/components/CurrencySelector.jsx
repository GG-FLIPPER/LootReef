import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../CurrencyContext';

function CurrencySelector() {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = currencies.find((c) => c.code === currency) || currencies[0];

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className="currency-selector" ref={ref}>
      <button
        id="currency-selector-btn"
        className="currency-pill"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="currency-flag">{current.flag}</span>
        <span className="currency-code">{current.code}</span>
        <svg
          className={`currency-chevron ${open ? 'currency-chevron-open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="currency-dropdown animate-fade-scale-down" role="listbox" aria-label="Select currency">
          {currencies.map((c) => (
            <button
              key={c.code}
              role="option"
              aria-selected={c.code === currency}
              className={`currency-option ${c.code === currency ? 'currency-option-active' : ''}`}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
            >
              <span className="currency-flag">{c.flag}</span>
              <span className="currency-option-code">{c.code}</span>
              <span className="currency-option-symbol">{c.symbol}</span>
              {c.code === currency && (
                <svg className="currency-check" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 7.5l3 3 7-7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CurrencySelector;
