import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { useCurrency } from '../CurrencyContext';
import { LANGUAGES } from './LanguageSelector';
import { supabase } from '../supabase';

function OnboardingModal() {
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

      {/* Modal */}
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
        <div className="bg-surface border border-border shadow-2xl rounded-2xl p-6 w-full max-w-md relative overflow-hidden animate-fade-scale-up">
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-text">Welcome to LootReef</h2>
            </div>
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="text-sm text-text-secondary hover:text-text transition-colors border border-border px-3 py-1.5 rounded-lg hover:border-primary/50"
            >
              Skip
            </button>
          </div>

          <div className="min-h-[200px]">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-text-secondary">
                  Compare prices across the top gaming marketplaces instantly. Let's set up your preferences for the best experience.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-text">Select your Language</h3>
                <p className="text-sm text-text-secondary">We'll automatically translate deal titles to match.</p>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocalLang(l.code)}
                      className={`flex items-center gap-2 p-3 border rounded-xl transition-colors ${
                        localLang === l.code ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text hover:border-text-secondary'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span className="font-medium">{l.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 bg-surface-alt hover:bg-border text-text py-3 rounded-xl transition-colors">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors">Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-text">Select your Currency</h3>
                <p className="text-sm text-text-secondary">We'll convert all prices using live exchange rates.</p>
                
                <div className="grid grid-cols-2 gap-2 mt-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setLocalCurr(c.code)}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${
                        localCurr === c.code ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text hover:border-text-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="font-medium">{c.code}</span>
                      </div>
                      <span className="text-sm text-text-secondary">{c.symbol}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 bg-surface-alt hover:bg-border text-text py-3 rounded-xl transition-colors">Back</button>
                  <button onClick={handleFinish} className="flex-1 bg-accent-green hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors">Finish Setup</button>
                </div>
              </div>
            )}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-1 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-primary' : 'w-2 bg-border'}`} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default OnboardingModal;
