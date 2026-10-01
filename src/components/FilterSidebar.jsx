import { CATEGORIES, getBrands, getCategory } from '../data/products'
import { useCatalog } from '../context/CatalogContext'
import { useI18n } from '../context/I18nContext'

function RadioRow({ name, value, current, onChange, label }) {
  return (
    <li className="flex items-center gap-3 py-0.5">
      <input
        type="radio"
        name={name}
        id={`${name}-${value}`}
        checked={current === value}
        onChange={() => onChange(value)}
        className="w-4 h-4 accent-slate-900 cursor-pointer"
      />
      <label htmlFor={`${name}-${value}`} className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
        {label}
      </label>
    </li>
  )
}

export default function FilterSidebar({ className = '' }) {
  const { t, lang } = useI18n()
  const catalog = useCatalog()
  const brands = getBrands()

  return (
    <aside className={`bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 h-fit ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">{t('filtersTitle')}</h2>
        {catalog.hasActiveFilters && (
          <button
            type="button"
            onClick={catalog.reset}
            className="text-[11px] font-bold text-amber-600 hover:underline"
          >
            {t('resetFilters')}
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{t('filterCategories')}</h3>
        <ul className="space-y-2 text-sm font-medium text-slate-600">
          <RadioRow
            name="category"
            value="all"
            current={catalog.category}
            onChange={catalog.setCategory}
            label={t('allCategories')}
          />
          {CATEGORIES.map((category) => (
            <RadioRow
              key={category.key}
              name="category"
              value={category.key}
              current={catalog.category}
              onChange={catalog.setCategory}
              label={`${category.emoji} ${getCategory(category.key).label[lang]}`}
            />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{t('filterBrands')}</h3>
        <ul className="space-y-2 text-sm font-medium text-slate-600 max-h-56 overflow-y-auto pr-1">
          <RadioRow name="brand" value="all" current={catalog.brand} onChange={catalog.setBrand} label={t('allBrands')} />
          {brands.map((brand) => (
            <RadioRow key={brand} name="brand" value={brand} current={catalog.brand} onChange={catalog.setBrand} label={brand} />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{t('filterPrice')}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={catalog.priceMin}
            onChange={(event) => catalog.setPriceRange(event.target.value, catalog.priceMax)}
            placeholder="Min"
            aria-label="Min price"
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-500"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={catalog.priceMax}
            onChange={(event) => catalog.setPriceRange(catalog.priceMin, event.target.value)}
            placeholder="Max"
            aria-label="Max price"
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={catalog.discountOnly}
            onChange={(event) => catalog.setDiscountOnly(event.target.checked)}
            className="w-4 h-4 accent-rose-600 cursor-pointer"
          />
          <span>{t('filterDiscountOnly')}</span>
        </label>
      </div>
    </aside>
  )
}