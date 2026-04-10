import { useState, useCallback } from 'react';

const THEMES = [
  { key: 'legacy', label: 'Legacy', icon: null },
  { key: 'dark', label: 'Dark', icon: '🌙' },
  { key: 'light', label: 'Light', icon: '☀️' },
];

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'legacy'
  );

  const handleSwitch = useCallback((key) => {
    document.documentElement.setAttribute('data-theme', key);
    localStorage.setItem('pricescout_theme', key);
    setTheme(key);
  }, []);

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Theme selector">
      {THEMES.map((t) => (
        <button
          key={t.key}
          role="radio"
          aria-checked={theme === t.key}
          className={`theme-toggle-option ${theme === t.key ? 'theme-toggle-active' : ''}`}
          onClick={() => handleSwitch(t.key)}
        >
          {t.icon && <span className="theme-toggle-icon">{t.icon}</span>}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
