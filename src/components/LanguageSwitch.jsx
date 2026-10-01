import { useI18n } from '../context/I18nContext'

export default function LanguageSwitch({ className = '' }) {
  const { lang, setLang, languages } = useI18n()

  return (
    <div
      className={`flex items-center gap-1 bg-slate-100 border border-slate-200/60 p-1 rounded-xl h-9 shrink-0 ${className}`}
      role="group"
      aria-label="Language"
    >
      {languages.map((item) => {
        const active = item.key === lang
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setLang(item.key)}
            aria-pressed={active}
            title={item.label}
            className={`px-2.5 h-full text-xs font-extrabold rounded-lg transition-all ${
              active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            {item.short}
          </button>
        )
      })}
    </div>
  )
}