import en from "./locales/en.json"
import vi from "./locales/vi.json"

export type Language = "en" | "vi"

export const DEFAULT_LANGUAGE: Language = "en"
export const LOCALE_STORAGE_KEY = "azure-air-language"

export const locales = {
  en,
  vi,
} as const

export type LocaleData = (typeof locales)[keyof typeof locales]

export function getLocale(language: Language): LocaleData {
  return locales[language]
}
