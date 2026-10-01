import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, discountPercent, isDiscounted } from '../data/products'
import { useI18n } from '../context/I18nContext'
import { formatPrice } from '../lib/pricing'
import { localText } from '../lib/storage'

export default function PromoMarquee() {
  const { lang } = useI18n()

  const promos = useMemo(() => PRODUCTS.filter((p) => isDiscounted(p)), [])
  const loop = [...promos, ...promos]

  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl py-4 overflow-hidden shadow-sm">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <div className="overflow-hidden w-full">
        <div className="animate-marquee-track flex w-max gap-4">
          {loop.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              to={`/product/${product.id}`}
              className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 hover:bg-rose-50 transition-colors flex-shrink-0 select-none"
            >
              <span className="text-2xl">{product.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-black text-rose-600 truncate max-w-[150px]">
                  {localText(product.name, lang)}
                </p>
                <p className="text-[11px] font-extrabold text-slate-900">
                  {formatPrice(product.price)}
                  {isDiscounted(product) && (
                    <span className="ml-1.5 text-amber-600">−{discountPercent(product)}%</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}