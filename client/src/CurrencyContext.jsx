import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CURRENCIES = [
  { code: 'AED', flag: '🇦🇪', symbol: 'د.إ', decimals: 2 },
  { code: 'ARS', flag: '🇦🇷', symbol: 'AR$', decimals: 2 },
  { code: 'AUD', flag: '🇦🇺', symbol: 'A$',  decimals: 2 },
  { code: 'BDT', flag: '🇧🇩', symbol: '৳',   decimals: 2 },
  { code: 'BGN', flag: '🇧🇬', symbol: 'лв',  decimals: 2 },
  { code: 'BHD', flag: '🇧🇭', symbol: 'BD',  decimals: 3 },
  { code: 'BND', flag: '🇧🇳', symbol: 'B$',  decimals: 2 },
  { code: 'BOB', flag: '🇧🇴', symbol: 'Bs',  decimals: 2 },
  { code: 'BRL', flag: '🇧🇷', symbol: 'R$',  decimals: 2 },
  { code: 'CAD', flag: '🇨🇦', symbol: 'C$',  decimals: 2 },
  { code: 'CHF', flag: '🇨🇭', symbol: 'CHF', decimals: 2 },
  { code: 'CLP', flag: '🇨🇱', symbol: 'CL$', decimals: 0 },
  { code: 'CNY', flag: '🇨🇳', symbol: '¥',   decimals: 2 },
  { code: 'COP', flag: '🇨🇴', symbol: 'CO$', decimals: 0 },
  { code: 'CZK', flag: '🇨🇿', symbol: 'Kč',  decimals: 2 },
  { code: 'DKK', flag: '🇩🇰', symbol: 'kr',  decimals: 2 },
  { code: 'EGP', flag: '🇪🇬', symbol: 'E£',  decimals: 2 },
  { code: 'EUR', flag: '🇪🇺', symbol: '€',   decimals: 2 },
  { code: 'GBP', flag: '🇬🇧', symbol: '£',   decimals: 2 },
  { code: 'GHS', flag: '🇬🇭', symbol: 'GH₵', decimals: 2 },
  { code: 'HKD', flag: '🇭🇰', symbol: 'HK$', decimals: 2 },
  { code: 'HUF', flag: '🇭🇺', symbol: 'Ft',  decimals: 0 },
  { code: 'IDR', flag: '🇮🇩', symbol: 'Rp',  decimals: 0 },
  { code: 'ILS', flag: '🇮🇱', symbol: '₪',   decimals: 2 },
  { code: 'INR', flag: '🇮🇳', symbol: '₹',   decimals: 2 },
  { code: 'IQD', flag: '🇮🇶', symbol: 'ع.د', decimals: 0 },
  { code: 'IRR', flag: '🇮🇷', symbol: '﷼',   decimals: 0 },
  { code: 'ISK', flag: '🇮🇸', symbol: 'kr',  decimals: 0 },
  { code: 'JOD', flag: '🇯🇴', symbol: 'JD',  decimals: 3 },
  { code: 'JPY', flag: '🇯🇵', symbol: '¥',   decimals: 0 },
  { code: 'KES', flag: '🇰🇪', symbol: 'KSh', decimals: 2 },
  { code: 'KRW', flag: '🇰🇷', symbol: '₩',   decimals: 0 },
  { code: 'KWD', flag: '🇰🇼', symbol: 'KD',  decimals: 3 },
  { code: 'KZT', flag: '🇰🇿', symbol: '₸',   decimals: 2 },
  { code: 'LBP', flag: '🇱🇧', symbol: 'L£',  decimals: 0 },
  { code: 'MAD', flag: '🇲🇦', symbol: 'MAD', decimals: 2 },
  { code: 'MXN', flag: '🇲🇽', symbol: 'MX$', decimals: 2 },
  { code: 'MYR', flag: '🇲🇾', symbol: 'RM',  decimals: 2 },
  { code: 'NGN', flag: '🇳🇬', symbol: '₦',   decimals: 2 },
  { code: 'NOK', flag: '🇳🇴', symbol: 'kr',  decimals: 2 },
  { code: 'NZD', flag: '🇳🇿', symbol: 'NZ$', decimals: 2 },
  { code: 'OMR', flag: '🇴🇲', symbol: 'OMR', decimals: 3 },
  { code: 'PHP', flag: '🇵🇭', symbol: '₱',   decimals: 2 },
  { code: 'PKR', flag: '🇵🇰', symbol: 'Rs',  decimals: 2 },
  { code: 'PLN', flag: '🇵🇱', symbol: 'zł',  decimals: 2 },
  { code: 'RON', flag: '🇷🇴', symbol: 'lei', decimals: 2 },
  { code: 'RSD', flag: '🇷🇸', symbol: 'din', decimals: 2 },
  { code: 'SAR', flag: '🇸🇦', symbol: 'SR',  decimals: 2 },
  { code: 'SEK', flag: '🇸🇪', symbol: 'kr',  decimals: 2 },
  { code: 'SGD', flag: '🇸🇬', symbol: 'S$',  decimals: 2 },
  { code: 'THB', flag: '🇹🇭', symbol: '฿',   decimals: 2 },
  { code: 'TRY', flag: '🇹🇷', symbol: '₺',   decimals: 2 },
  { code: 'TWD', flag: '🇹🇼', symbol: 'NT$', decimals: 0 },
  { code: 'UAH', flag: '🇺🇦', symbol: '₴',   decimals: 2 },
  { code: 'USD', flag: '🇺🇸', symbol: '$',   decimals: 2 },
  { code: 'VND', flag: '🇻🇳', symbol: '₫',   decimals: 0 },
  { code: 'ZAR', flag: '🇿🇦', symbol: 'R',   decimals: 2 },
];

const CACHE_KEY = 'pricescout_fx_cache';
const TIMESTAMP_KEY = 'pricescout_fx_timestamp';
const PREF_KEY = 'pricescout_currency';
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      return localStorage.getItem(PREF_KEY) || 'USD';
    } catch {
      return 'USD';
    }
  });

  const [rates, setRates] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const ts = localStorage.getItem(TIMESTAMP_KEY);
      if (cached && ts && Date.now() - Number(ts) < MAX_AGE_MS) {
        return JSON.parse(cached);
      }
    } catch { /* ignore */ }
    return null;
  });

  // Persist currency preference
  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(PREF_KEY, code);
    } catch { /* ignore */ }
  }, []);

  // Fetch rates (only if cache is stale or missing)
  useEffect(() => {
    let stale = true;
    try {
      const ts = localStorage.getItem(TIMESTAMP_KEY);
      if (ts && Date.now() - Number(ts) < MAX_AGE_MS && rates) {
        stale = false;
      }
    } catch { /* ignore */ }

    if (!stale) return;

    let cancelled = false;

    const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

    const frankfurterFetch = fetch('https://api.frankfurter.app/latest?from=USD')
      .then((res) => res.json())
      .then((data) => data.rates || {})
      .catch(() => ({}));

    const exchangeRateFetch = apiKey
      ? fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
          .then((res) => res.json())
          .then((data) => data.conversion_rates || {})
          .catch(() => ({}))
      : Promise.resolve({});

    Promise.all([frankfurterFetch, exchangeRateFetch])
      .then(([frankfurterRates, exchangeApiRates]) => {
        if (cancelled) return;
        // Merge: ExchangeRate-API as base, Frankfurter as override (higher quality)
        const merged = { ...exchangeApiRates, ...frankfurterRates };
        // Remove USD=1 key if present (we handle USD identity in convert)
        delete merged.USD;
        setRates(merged);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
          localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
        } catch { /* ignore */ }
      })
      .catch((err) => {
        console.warn('Failed to fetch exchange rates:', err);
      });

    return () => { cancelled = true; };
  }, []);

  // Convert USD amount to selected currency, returns formatted string
  const convert = useCallback(
    (usdAmount) => {
      if (usdAmount == null) return null;

      const info = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

      if (currency === 'USD' || !rates) {
        return `${info.symbol}${usdAmount.toFixed(info.decimals)}`;
      }

      const rate = rates[currency];
      if (!rate) {
        return `${info.symbol}${usdAmount.toFixed(info.decimals)}`;
      }

      const converted = usdAmount * rate;
      return `${info.symbol}${converted.toFixed(info.decimals)}`;
    },
    [currency, rates]
  );

  const value = useMemo(
    () => ({ currency, setCurrency, convert, currencies: CURRENCIES }),
    [currency, setCurrency, convert]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}

export default CurrencyContext;
