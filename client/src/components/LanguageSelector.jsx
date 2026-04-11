import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

function LanguageSelector() {
  const { targetLanguage, updateLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === targetLanguage) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className="currency-selector" ref={ref}>
      <button
        id="language-selector-btn"
        className="currency-pill"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="currency-flag">{current.flag}</span>
        <span className="currency-code">{current.code.toUpperCase()}</span>
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
        <div className="currency-dropdown animate-fade-scale-down" role="listbox" aria-label="Select language">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === targetLanguage}
              className={`currency-option ${l.code === targetLanguage ? 'currency-option-active' : ''}`}
              onClick={() => {
                updateLanguage(l.code);
                setOpen(false);
              }}
            >
              <span className="currency-flag">{l.flag}</span>
              <span className="currency-option-code">{l.name}</span>
              <span className="currency-option-symbol">{l.code.toUpperCase()}</span>
              {l.code === targetLanguage && (
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

export { LANGUAGES };
export default LanguageSelector;
