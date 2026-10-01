import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isGoogleConfigured } from '../lib/googleAuth'
import { readStorage, removeStorage, writeStorage } from '../lib/storage'

const AuthContext = createContext(null)

const STORAGE_KEY = 'user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage(STORAGE_KEY, null))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) writeStorage(STORAGE_KEY, user)
    else removeStorage(STORAGE_KEY)
  }, [user])

  /** Stores the account locally. `payload` comes from Google or from the login form. */
  const signIn = useCallback((payload) => {
    const next = {
      name: payload.name?.trim() || payload.email?.split('@')[0] || 'User',
      email: (payload.email || '').trim(),
      photo: payload.photo || '',
      provider: payload.provider || 'password',
    }
    setUser(next)
    return next
  }, [])

  /** Offline stand-in for a Google account when no client ID is configured. */
  const signInDemoGoogle = useCallback(() => {
    const demo = {
      name: 'Google User',
      email: 'google.user@gmail.com',
      photo: '',
      provider: 'google-demo',
    }
    setUser(demo)
    return demo
  }, [])

  const signOut = useCallback(() => setUser(null), [])

  const value = useMemo(
    () => ({
      user,
      loading,
      setLoading,
      isAuthenticated: Boolean(user),
      googleConfigured: isGoogleConfigured,
      signIn,
      signInDemoGoogle,
      signOut,
    }),
    [user, loading, signIn, signInDemoGoogle, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}