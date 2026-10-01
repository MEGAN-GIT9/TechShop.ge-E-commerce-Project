import { useEffect, useRef } from 'react'
import { renderGoogleButton } from '../lib/googleAuth'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
)

/**
 * Real Google button when VITE_GOOGLE_CLIENT_ID is set, otherwise a local demo sign-in.
 */
export default function GoogleSignInButton({ onSuccess, className = '' }) {
  const { googleConfigured, signInDemoGoogle } = useAuth()
  const { t } = useI18n()
  const mountRef = useRef(null)

  useEffect(() => {
    if (!googleConfigured || !mountRef.current) return undefined
    let active = true
    let cleanup = null

    renderGoogleButton(mountRef.current, { onCredential: onSuccess })
      .then((fn) => {
        if (active) cleanup = fn
      })
      .catch(() => {
        /* the demo button below stays usable if the script is blocked */
      })

    return () => {
      active = false
      cleanup?.()
    }
  }, [googleConfigured, onSuccess])

  if (googleConfigured) {
    return <div ref={mountRef} className={`flex justify-center min-h-[44px] ${className}`} />
  }

  return (
    <button
      type="button"
      onClick={() => onSuccess(signInDemoGoogle())}
      className={`w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${className}`}
    >
      <GoogleMark />
      <span>{t('authGoogleDemo')}</span>
    </button>
  )
}