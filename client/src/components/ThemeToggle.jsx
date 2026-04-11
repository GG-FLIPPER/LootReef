import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'legacy'
  );

  const THEMES = [
    { key: 'legacy', label: t('theme.legacy'), icon: null },
    { key: 'dark', label: t('theme.dark'), icon: '🌙' },
    { key: 'light', label: t('theme.light'), icon: '☀️' },
    { key: 'glass', label: t('theme.glass'), icon: '💧' },
  ];

  const handleSwitch = useCallback((key) => {
    document.documentElement.setAttribute('data-theme', key);
    localStorage.setItem('pricescout_theme', key);
    setTheme(key);
  }, []);

  return (
    <div className="theme-toggle" role="radiogroup" aria-label={t('nav.theme')}>
      {THEMES.map((th) => (
        <button
          key={th.key}
          role="radio"
          aria-checked={theme === th.key}
          className={`theme-toggle-option ${theme === th.key ? 'theme-toggle-active' : ''}`}
          onClick={() => handleSwitch(th.key)}
        >
          {th.icon && <span className="theme-toggle-icon">{th.icon}</span>}
          <span>{th.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
