"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { getT, LANGUAGES } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };

const LanguageContext = createContext<Ctx>({
  lang: "en", setLang: () => {}, t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("humana-lang") as Lang | null;
    if (saved && LANGUAGES.find(l => l.code === saved)) apply(saved);
  }, []);

  function apply(l: Lang) {
    const info = LANGUAGES.find(x => x.code === l)!;
    setLangState(l);
    localStorage.setItem("humana-lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = info.dir;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: apply, t: getT(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
