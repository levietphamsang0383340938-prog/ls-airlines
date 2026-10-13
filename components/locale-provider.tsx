"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { getLocale, LOCALE_STORAGE_KEY, DEFAULT_LANGUAGE, type Language, type LocaleData } from "@/lib/i18n"

type LocaleContextValue = {
  language: Language
  locale: LocaleData
  setLanguage: (language: Language) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Language | null
    if (stored === "en" || stored === "vi") {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, language)
  }, [language])

  const locale = useMemo(() => getLocale(language), [language])

  return (
    <LocaleContext.Provider value={{ language, locale, setLanguage }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
