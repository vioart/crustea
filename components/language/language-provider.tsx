"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type Language = "id" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

type LanguageProviderProps = {
  children: ReactNode;
};

const LANGUAGE_STORAGE_KEY = "crustea_language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "id";
  }

  const savedLanguage = localStorage.getItem(
    LANGUAGE_STORAGE_KEY,
  );

  if (savedLanguage === "id" || savedLanguage === "en") {
    return savedLanguage;
  }

  return "id";
}

export default function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    getInitialLanguage,
  );

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage harus digunakan di dalam LanguageProvider.",
    );
  }

  return context;
}