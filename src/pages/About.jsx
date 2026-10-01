import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { useI18n } from '../context/I18nContext'

const FEATURES = [
  { key: 'aboutFeature1', emoji: '📦' },
  { key: 'aboutFeature2', emoji: '🏦' },
  { key: 'aboutFeature3', emoji: '🛡️' },
]

export default function About() {
  const { t, lang } = useI18n()

  return (
    <div className="p-4 md:p-12 max-w-4xl mx-auto w-full">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">{t('aboutKicker')}</span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-2 mb-6">{t('aboutTitle')}</h1>

        <div className="space-y-5 text-slate-600 leading-relaxed font-medium">
          <p>{t('aboutP1')}</p>
          <p>{t('aboutP2')}</p>
          <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-4 rounded-xl font-bold">
            {t('aboutNotice')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-100">
          {[
            { label: t('aboutStatProducts'), value: PRODUCTS.length },
            { label: t('aboutStatCategories'), value: CATEGORIES.length },
            { label: t('aboutStatBanks'), value: 3 },
            { label: t('aboutStatCities'), value: '100%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {FEATURES.map((feature) => (
            <div key={feature.key} className="bg-slate-50 p-4 rounded-2xl">
              <div className="text-2xl mb-1">{feature.emoji}</div>
              <h2 className="font-bold text-slate-900 text-sm">{t(`${feature.key}Title`)}</h2>
              <p className="text-xs text-slate-400 mt-1">{t(`${feature.key}Text`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100">
          <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-4">{t('filterCategories')}</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <span
                key={category.key}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                {category.emoji} {category.label[lang]}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 text-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors"
          >
            {t('heroCta')}
          </Link>
          <Link
            to="/discounts"
            className="flex-1 text-center px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            {t('navDiscounts')}
          </Link>
        </div>
      </div>
    </div>
  )
}