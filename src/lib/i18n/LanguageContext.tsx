"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import fr from "./fr.json";
import en from "./en.json";
import ar from "./ar.json";

export type Locale = "fr" | "en" | "ar";

const dictionaries: Record<Locale, Record<string, string>> = { fr, en, ar };

interface LangContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (k: string) => k,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved) setLocaleState(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale === "ar" ? "ar" : locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const dict = dictionaries[locale];
  const t = useCallback((key: string) => dict?.[key] || key, [dict]);

  return (
    <LangContext.Provider value={{ locale, setLocale, t, dir: locale === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLanguage = () => useContext(LangContext);
