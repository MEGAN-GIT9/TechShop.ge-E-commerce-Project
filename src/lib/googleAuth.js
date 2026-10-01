/**
 * Google Identity Services integration — browser only, no backend needed.
 *
 * The Google ID token is a JWT that already contains the user's name, email and
 * picture, so it can be decoded on the client. A real deployment would verify the
 * token on a server; this front-end demo simply decodes it locally.
 */

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

export const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID ?? ''

export const isGoogleConfigured = Boolean(googleClientId)

let scriptPromise = null

function loadScript() {
  if (typeof document === 'undefined') return Promise.reject(new Error('no document'))
  if (window.google?.accounts?.id) return Promise.resolve(window.google)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google))
      existing.addEventListener('error', reject)
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    script.onerror = () => reject(new Error('Google Identity Services failed to load'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

/** Decodes the payload of a JWT without verifying its signature. */
function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.')
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return {}
  }
}

/**
 * Renders the official Google button into `element`.
 * @returns {Promise<() => void>} resolves with a cleanup function
 */
export async function renderGoogleButton(element, { onCredential } = {}) {
  const google = await loadScript()
  google.accounts.id.initialize({
    client_id: googleClientId,
    callback: (response) => {
      const payload = decodeJwtPayload(response.credential)
      onCredential?.({
        name: payload.name || payload.email?.split('@')[0] || 'Google User',
        email: payload.email || '',
        photo: payload.picture || '',
        provider: 'google',
      })
    },
  })

  element.innerHTML = ''
  google.accounts.id.renderButton(element, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    width: 320,
    text: 'continue_with',
    logo_alignment: 'left',
  })

  return () => {
    element.innerHTML = ''
  }
}