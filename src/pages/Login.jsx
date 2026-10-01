import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { t } = useI18n()
  const { signIn, googleConfigured } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const isRegister = mode === 'register'
  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = isRegister ? form.name.trim() : ''
    const user = signIn({ name: name || form.email, email: form.email, provider: 'password' })
    show(t('toastLoginSuccess'))
    navigate('/')
    return user
  }

  const handleGoogle = (user) => {
    signIn(user)
    show(t('toastGoogleSuccess'))
    navigate('/')
  }

  return (
    <div className="p-4 md:p-12 max-w-md mx-auto w-full grow flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm w-full">
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          {isRegister ? t('authRegisterTitle') : t('authLoginTitle')}
        </h1>
        <p className="text-sm font-medium text-slate-400 mb-6">{t('authSubtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase text-slate-400">{t('authName')}</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={update('name')}
                autoComplete="name"
                className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-slate-400">{t('authEmail')}</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="name@example.com"
              autoComplete="email"
              className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-slate-400">{t('authPassword')}</span>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm shadow-sm transition-colors"
          >
            {isRegister ? t('authRegister') : t('authSignIn')}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-100 h-px w-full" />
          <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase">{t('authOr')}</span>
        </div>

        <GoogleSignInButton onSuccess={handleGoogle} />

        {!googleConfigured && (
          <p className="text-[11px] font-semibold text-slate-400 mt-3 leading-relaxed">{t('authGoogleHint')}</p>
        )}
        <p className="text-[11px] font-semibold text-slate-300 mt-2">{t('authDemoNote')}</p>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setMode(isRegister ? 'login' : 'register')}
            className="text-xs font-bold text-amber-600 hover:underline"
          >
            {isRegister ? t('authToggleToLogin') : t('authToggleToRegister')}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors">
            {t('notFoundCta')}
          </Link>
        </div>
      </div>
    </div>
  )
}