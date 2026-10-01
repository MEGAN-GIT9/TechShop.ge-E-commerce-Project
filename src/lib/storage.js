const PREFIX = 'techshop'

export function readStorage(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(`${PREFIX}_${key}`)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(`${PREFIX}_${key}`, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — the app keeps working in memory */
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(`${PREFIX}_${key}`)
  } catch {
    /* ignore */
  }
}

/** Minimal i18n key lookup: `tr('heroTitle')`. */
export function translate(dictionary, key, ...args) {
  const value = dictionary?.[key]
  if (typeof value === 'function') return value(...args)
  if (value === undefined) return key
  return value
}

export const localText = (field, lang) => field?.[lang] ?? field?.ka ?? ''