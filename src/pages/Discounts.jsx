import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, isDiscounted } from '../data/products'
import { useI18n } from '../context/I18nContext'

export default function Discounts() {
  const { t } = useI18n()

  const saleProducts = useMemo(
    () => PRODUCTS.filter(isDiscounted).sort((a, b) => a.price / a.oldPrice - b.price / b.oldPrice),
    [],
  )

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-rose-600">{t('discountsTitle')}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">{t('discountsSubtitle')}</p>
        </div>
        <Link
          to="/"
          className="text-sm font-bold bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all self-start"
        >
          {t('backToCatalog')}
        </Link>
      </div>

      {saleProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 font-medium">
          {t('discountsEmpty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}