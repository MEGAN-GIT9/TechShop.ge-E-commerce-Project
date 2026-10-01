import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import translations, { SUPPORTED_LANGUAGES } from '../data/translations'
import { readStorage, writeStorage } from '../lib/storage'

const I18nContext = createContext(null)

const STORAGE_KEY = 'lang'

const getInitialLang = () => {
  const stored = readStorage(STORAGE_KEY)
  if (stored && SUPPORTED_LANGUAGES.some((l) => l.key === stored)) return stored
  if (typeof navigator !== 'undefined' && navigator.language?.startsWith('ka')) return 'ka'
  return 'ka'
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.key === next)) return
    setLangState(next)
    writeStorage(STORAGE_KEY, next)
  }, [])

  const dictionary = translations[lang]

  /** `t('toastAdded', 'iPhone')` — extra arguments are forwarded to function values. */
  const t = useCallback((key, ...args) => {
    const value = dictionary?.[key]
    if (typeof value === 'function') return value(...args)
    if (value === undefined) return key
    return value
  }, [dictionary])

  const value = useMemo(
    () => ({ lang, setLang, t, languages: SUPPORTED_LANGUAGES }),
    [lang, setLang, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}