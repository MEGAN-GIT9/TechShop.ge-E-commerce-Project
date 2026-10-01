import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import PromoMarquee from '../components/PromoMarquee'
import { CATEGORY_GROUPS, PRODUCTS, getCategory } from '../data/products'
import { useCatalog } from '../context/CatalogContext'
import { useI18n } from '../context/I18nContext'
import { useFilteredProducts } from '../hooks/useFilteredProducts'

const PROMO_CARDS = [
  { group: 'home', emoji: '🧊', titleKey: 'promoHomeTitle', textKey: 'promoHomeText', gradient: 'from-amber-500 to-orange-600', textDark: true },
  { group: 'small', emoji: '🔌', titleKey: 'promoSmallTitle', textKey: 'promoSmallText', gradient: 'from-cyan-500 to-blue-600', textDark: false },
  { group: 'digital', emoji: '📱', titleKey: 'promoMobileTitle', textKey: 'promoMobileText', gradient: 'from-violet-500 to-fuchsia-600', textDark: false },
]

const SHOWCASE_TABS = [
  { key: 'Home Appliances', titleKey: 'showcaseHomeAppliances', textKey: 'showcaseHomeAppliancesText' },
  { key: 'Small Appliances', titleKey: 'showcaseSmallAppliances', textKey: 'showcaseSmallAppliancesText' },
  { key: 'Mobile', titleKey: 'showcaseMobile', textKey: 'showcaseMobileText' },
  { key: 'Audio', titleKey: 'showcaseAudio', textKey: 'showcaseAudioText' },
]

export default function Home() {
  const { t, lang } = useI18n()
  const catalog = useCatalog()
  const products = useFilteredProducts()
  const catalogRef = useRef(null)
  const [tab, setTab] = useState(SHOWCASE_TABS[0].key)

  const showcaseProducts = PRODUCTS.filter((p) => p.cat === tab).slice(0, 4)
  const activeTab = SHOWCASE_TABS.find((item) => item.key === tab)

  const showCategory = (key) => {
    catalog.setCategory(key)
    catalog.setGroup('all')
    catalog.setSearch('')
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto w-full">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shadow-md group min-h-[320px]">
          <div className="absolute right-0 bottom-0 text-[160px] md:text-[200px] opacity-20 select-none pointer-events-none translate-x-10 translate-y-10 group-hover:scale-110 transition-transform duration-500">
            ⚡
          </div>
          <div className="relative z-10 max-w-md">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
              {t('heroBadge')}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-4 mb-3 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-slate-300 text-sm md:text-base font-medium mb-6">{t('heroText')}</p>
          </div>
          <div className="relative z-10">
            <Link
              to="/discounts"
              className="inline-block bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-900 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
            >
              {t('heroCta')}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          {PROMO_CARDS.map((card) => (
            <button
              key={card.group}
              type="button"
              onClick={() => {
                catalog.setGroup(card.group)
                catalog.setSearch('')
                catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`flex-1 bg-gradient-to-r ${card.gradient} rounded-2xl p-6 flex items-center justify-between relative overflow-hidden shadow-sm group min-h-[100px] text-left`}
            >
              <span className="absolute -right-4 -bottom-6 text-7xl opacity-20 group-hover:rotate-12 transition-transform select-none">
                {card.emoji}
              </span>
              <span className="relative z-10 max-w-[68%]">
                <span className={`block text-lg font-extrabold leading-snug ${card.textDark ? 'text-slate-950' : 'text-white'}`}>
                  {t(card.titleKey)}
                </span>
                <span className={`block text-xs font-semibold mt-1 ${card.textDark ? 'text-slate-900/80' : 'text-white/80'}`}>
                  {t(card.textKey)}
                </span>
                <span className={`inline-block mt-3 text-xs font-black underline underline-offset-4 ${card.textDark ? 'text-slate-950' : 'text-white'}`}>
                  {t('shopNow')}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <PromoMarquee />
      </div>

      {/* Category showcase */}
      <section className="mb-12">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {SHOWCASE_TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === item.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {getCategory(item.key).emoji} {t(item.titleKey)}
            </button>
          ))}
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">{t(activeTab.titleKey)}</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">{t(activeTab.textKey)}</p>
          </div>
          <button
            type="button"
            onClick={() => showCategory(tab)}
            className="shrink-0 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition-all"
          >
            {t('viewAll')} →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {showcaseProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Catalog */}
      <section ref={catalogRef} className="grid grid-cols-1 lg:grid-cols-4 gap-8 scroll-mt-24">
        <FilterSidebar className="lg:col-span-1 lg:sticky lg:top-24" />

        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-black text-slate-900">{t('resultsCount', products.length)}</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('sortBy')}
              </label>
              <select
                id="sort"
                value={catalog.sort}
                onChange={(event) => catalog.setSort(event.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-amber-500"
              >
                <option value="default">{t('sortDefault')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="rating">{t('sortRating')}</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 font-medium">
              {t('noProducts')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category quick links */}
      <section className="mt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORY_GROUPS.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() => {
                catalog.setGroup(group.key)
                catalog.setSearch('')
                catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{group.emoji}</div>
              <p className="text-sm font-black text-slate-900">{group.label[lang]}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {group.cats.map((cat) => getCategory(cat).label[lang]).join(' · ')}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}