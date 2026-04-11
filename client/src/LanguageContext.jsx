import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

const LanguageContext = createContext(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// In-memory translation cache to avoid hitting the API for same text+lang
const translationCache = new Map();

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const [targetLanguage, setTargetLanguage] = useState(() => {
    // initialize from local storage or default to english
    return localStorage.getItem('pricescout_language') || 'en';
  });

  // Keep track of if we're saving to prevent loops
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync from DB when user signs in
  useEffect(() => {
    async function loadUserLanguage() {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('language_pref').eq('id', user.id).single();
      if (data && data.language_pref) {
        setTargetLanguage(data.language_pref);
        localStorage.setItem('pricescout_language', data.language_pref);
      }
    }
    loadUserLanguage();
  }, [user]);

  const updateLanguage = useCallback(async (lang) => {
    setTargetLanguage(lang);
    localStorage.setItem('pricescout_language', lang);
    if (user && !isSyncing) {
      setIsSyncing(true);
      await supabase.from('profiles').update({ language_pref: lang }).eq('id', user.id);
      setIsSyncing(false);
    }
  }, [user, isSyncing]);

  const translate = useCallback(async (text, forceTargetLang = null) => {
    const lang = forceTargetLang || targetLanguage;
    if (!text || text.trim() === '') return text;
    // Don't translate if the target is english and we assume mostly english content, 
    // but the API can autodetect. Let's just always use the cache.
    const cacheKey = `${text}::${lang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${lang}`);
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const translated = data.responseData.translatedText;
        translationCache.set(cacheKey, translated);
        return translated;
      }
    } catch (e) {
      console.error('Translation failed', e);
    }
    return text;
  }, [targetLanguage]);

  return (
    <LanguageContext.Provider value={{ targetLanguage, updateLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}
