import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import policies from '../data/policies'
import { useI18n } from './I18nContext'

const UiContext = createContext(null)

export function UiProvider({ children }) {
  const [policyType, setPolicyType] = useState(null)
  const { lang } = useI18n()

  const openPolicy = useCallback((type) => {
    if (policies[type]) setPolicyType(type)
  }, [])

  const closePolicy = useCallback(() => setPolicyType(null), [])

  const activePolicy = policyType ? policies[policyType] : null

  const value = useMemo(
    () => ({ openPolicy, closePolicy, policyType, activePolicy, title: activePolicy?.title[lang], paragraphs: activePolicy?.body[lang] ?? [] }),
    [openPolicy, closePolicy, policyType, activePolicy, lang],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used inside <UiProvider>')
  return ctx
}