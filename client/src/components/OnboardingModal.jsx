import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { useCurrency } from '../CurrencyContext';
import { LANGUAGES } from './LanguageSelector';
import { supabase } from '../supabase';

function OnboardingModal() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { targetLanguage, updateLanguage } = useLanguage();
  const { currency, setCurrency, currencies } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [localLang, setLocalLang] = useState(targetLanguage);
  const [localCurr, setLocalCurr] = useState(currency);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  // Check onboarding state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Sync Supabase state into local storage so returning users bypass this silently 
      if (profile && profile.has_onboarded) {
        localStorage.setItem('pricescout_onboarded', 'true');
        return;
      }

      // Check localStorage as the ultimate source of truth, independent of auth state
      const hasOnboarded = localStorage.getItem('pricescout_onboarded');
      if (!hasOnboarded) {
        setIsOpen(true);
        setLocalLang(profile?.language_pref || navigator.language.split('-')[0] || 'en');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [profile]);

  const handleFinish = async () => {
    setDismissed(true);
    setIsOpen(false);
    try {
      updateLanguage(localLang);
      setCurrency(localCurr);

      // Always set local storage as source of truth
      localStorage.setItem('pricescout_onboarded', 'true');

      if (user) {
        await supabase.from('profiles').update({ has_onboarded: true, language_pref: localLang }).eq('id', user.id);
      }
    } catch (err) {
      console.error('Onboarding finish error:', err);
    } finally {
      setIsOpen(false);
    }
  };

  const handleSkip = async () => {
    setDismissed(true);
    setIsOpen(false);
    try {
      // Always set local storage as source of truth
      localStorage.setItem('pricescout_onboarded', 'true');
      
      if (user) {
        await supabase.from('profiles').update({ has_onboarded: true }).eq('id', user.id);
      }
    } catch (err) {
      console.error('Onboarding skip error:', err);
    } finally {
      setIsOpen(false);
    }
  };

  if (loading || !isOpen || dismissed) return null;

  return (
    <>
      {/* Backdrop (non-dismissible) */}
      <div className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm backdrop-fade-in" />

      {/* Modal Container Shell — Fixed dimension frame */}
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
        <div className="bg-surface border border-border shadow-2xl rounded-2xl p-6 w-full max-w-md h-[500px] max-h-[85vh] relative flex flex-col justify-between overflow-hidden animate-fade-scale-up">
          
          {/* Fixed Header */}
          <div className="flex justify-between items-center pb-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-text tracking-tight">{t('onboarding.welcome')}</h2>
            </div>
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="h-8 px-3 text-xs font-semibold text-text-secondary hover:text-text border border-border rounded-lg hover:bg-surface-alt active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none"
            >
              {t('onboarding.skip')}
            </button>
          </div>

          {/* Scrollable Middle Content Area */}
          <div className="flex-1 flex flex-col py-4 min-h-0 overflow-hidden">
            {step === 1 && (
              <div className="flex-1 flex flex-col justify-between animate-fade-in">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent-green/10 flex items-center justify-center border border-primary/20 text-2xl shadow-sm mb-2">
                    ⚓️
                  </div>
                  <h3 className="text-lg font-bold text-text tracking-tight">Compare Digital Gaming Goods in Real-Time</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t('onboarding.step1Desc')}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-alt border border-border text-xs text-text-secondary space-y-1.5">
                  <div className="flex items-center gap-2 font-medium text-text">
                    <svg className="w-4 h-4 text-accent-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Instant Price Comparison across 8+ Marketplaces</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-text">
                    <svg className="w-4 h-4 text-accent-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom Currency Conversion & Language Filters</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
                <div className="shrink-0 mb-3">
                  <h3 className="text-base font-bold text-text tracking-tight">{t('onboarding.selectLanguage')}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{t('onboarding.languageDesc')}</p>
                </div>
                
                {/* Scrollable Language Grid */}
                <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 overflow-y-auto pr-1 py-1 custom-scrollbar">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocalLang(l.code)}
                      className={`h-12 px-3 border rounded-xl flex items-center justify-between text-sm transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none ${
                        localLang === l.code 
                          ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm' 
                          : 'border-border text-text hover:border-text-secondary hover:bg-surface-alt font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base shrink-0">{l.flag}</span>
                        <span className="truncate">{l.name}</span>
                      </div>
                      {localLang === l.code && (
                        <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
                <div className="shrink-0 mb-3">
                  <h3 className="text-base font-bold text-text tracking-tight">{t('onboarding.selectCurrency')}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{t('onboarding.currencyDesc')}</p>
                </div>
                
                {/* Scrollable Currency Grid */}
                <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 overflow-y-auto pr-1 py-1 custom-scrollbar">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setLocalCurr(c.code)}
                      className={`h-12 px-3 border rounded-xl flex items-center justify-between text-sm transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none ${
                        localCurr === c.code 
                          ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm' 
                          : 'border-border text-text hover:border-text-secondary hover:bg-surface-alt font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base shrink-0">{c.flag}</span>
                        <span className="font-semibold">{c.code}</span>
                      </div>
                      <span className="text-xs text-text-secondary font-medium shrink-0">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Action Footer */}
          <div className="pt-3 border-t border-border shrink-0 flex flex-col gap-3">
            <div className="flex gap-3">
              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  className="w-full h-11 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none flex items-center justify-center"
                >
                  {t('onboarding.getStarted')}
                </button>
              ) : step === 2 ? (
                <>
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 bg-surface-alt hover:bg-border text-text border border-border text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none flex items-center justify-center"
                  >
                    {t('onboarding.back')}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 h-11 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none flex items-center justify-center"
                  >
                    {t('onboarding.next')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 h-11 bg-surface-alt hover:bg-border text-text border border-border text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none flex items-center justify-center"
                  >
                    {t('onboarding.back')}
                  </button>
                  <button
                    onClick={handleFinish}
                    className="flex-1 h-11 bg-accent-green hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 shadow-sm focus-visible:ring-2 focus-visible:ring-green-400/40 focus:outline-none flex items-center justify-center"
                  >
                    {t('onboarding.finishSetup')}
                  </button>
                </>
              )}
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-primary' : 'w-2 bg-border'}`} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default OnboardingModal;
