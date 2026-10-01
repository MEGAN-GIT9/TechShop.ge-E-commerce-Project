import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'

export default function NotFound() {
  const { t } = useI18n()

  return (
    <div className="p-4 md:p-12 max-w-2xl mx-auto w-full flex items-center justify-center text-center">
      <div className="bg-white border border-slate-200 rounded-3xl p-10 w-full">
        <div className="text-7xl mb-6">🔌</div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">{t('notFoundTitle')}</h1>
        <p className="text-sm font-medium text-slate-400 mb-8">{t('notFoundText')}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors"
        >
          {t('notFoundCta')}
        </Link>
      </div>
    </div>
  )
}