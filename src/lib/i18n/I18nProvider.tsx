"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SupportedLocale = "en" | "es" | "fr";

type Dictionary = Record<string, string>;

interface I18nContextValue {
  locale: SupportedLocale;
  t: (key: string) => string;
  setLocale: (locale: SupportedLocale) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "procur.locale";

function loadInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es" || saved === "fr") return saved;
  } catch {}
  // Fallback to browser language
  if (typeof navigator !== "undefined") {
    const lang = (navigator.language || navigator.languages?.[0] || "en")
      .slice(0, 2)
      .toLowerCase();
    if (lang === "es" || lang === "fr") return lang;
  }
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(loadInitialLocale);
  const [dict, setDict] = useState<Dictionary>({});

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const mod = await import(`./dictionaries/${locale}`);
        if (!mounted) return;
        setDict(mod.dictionary as Dictionary);
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
      } catch {
        setDict({});
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [locale]);

  const t = useCallback(
    (key: string) => {
      return dict[key] ?? key;
    },
    [dict]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t, setLocale }),
    [locale, t, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
