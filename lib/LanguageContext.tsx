'use client';
import {
  createContext, useContext,
  useState, useEffect, ReactNode
} from 'react';
import { translations } from './i18n';

type LangContextType = {
  lang: string;
  setLang: (l: string) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: 'fr',
  setLang: () => {},
  t: (k) => k,
});

export const LanguageProvider = ({
  children
}: { children: ReactNode }) => {
  const [lang, setLangState] = useState('fr');

  useEffect(() => {
    // Charge la langue sauvegardée
    const prefs = JSON.parse(
      localStorage.getItem('mf_prefs') || '{}'
    );
    if (prefs.lang) setLangState(prefs.lang);

    // Écoute les changements de langue
    const handleLangChange = (e: Event) => {
      const newLang =
        (e as CustomEvent).detail?.lang;
      if (newLang) setLangState(newLang);
    };

    window.addEventListener(
      'mf_lang_change', handleLangChange
    );

    return () => window.removeEventListener(
      'mf_lang_change', handleLangChange
    );
  }, []);

  const setLang = (l: string) => {
    setLangState(l);
    // Sauvegarde dans localStorage
    const prefs = JSON.parse(
      localStorage.getItem('mf_prefs') || '{}'
    );
    localStorage.setItem('mf_prefs',
      JSON.stringify({ ...prefs, lang: l })
    );
    // Diffuse l'événement à tous les composants
    window.dispatchEvent(
      new CustomEvent('mf_lang_change', {
        detail: { lang: l }
      })
    );
  };

  const t = (key: string): string => {
    return translations[lang]?.[key]
      || translations['fr']?.[key]
      || key;
  };

  return (
    <LangContext.Provider
      value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLanguage = () =>
  useContext(LangContext);
