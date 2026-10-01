import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Rating from '../components/Rating'
import { PRODUCTS, discountPercent, getCategory, getProduct, isDiscounted } from '../data/products'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/I18nContext'
import { useToast } from '../context/ToastContext'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { DELIVERY_MIN_FEE, DELIVERY_RATE_PER_KG, formatPrice, formatWeight, getItemWeight } from '../lib/pricing'
import { localText } from '../lib/storage'

const RELATED_BY_CATEGORY = {
  Mobile: 'Wearables',
  Laptops: 'Audio',
  Cameras: 'Mobile',
}

export default function ProductDetail() {
  const { id } = useParams()
  const { t, lang } = useI18n()
  const { show } = useToast()
  const { addToCart, ensureInCart } = useCart()
  const { ids: recentIds, track } = useRecentlyViewed()
  const navigate = useNavigate()

  const [qty, setQty] = useState(1)
  const product = getProduct(id)

  useEffect(() => {
    if (product) track(product.id)
  }, [product, track])

  const similar = useMemo(() => {
    if (!product) return []
    const relatedCat = RELATED_BY_CATEGORY[product.cat] ?? product.cat
    const list = PRODUCTS.filter((item) => item.cat === relatedCat && item.id !== product.id)
    return (list.length ? list : PRODUCTS.filter((item) => item.id !== product.id)).slice(0, 3)
  }, [product])

  const recentlyViewed = useMemo(
    () => recentIds.filter((rid) => rid !== product?.id).map(getProduct).filter(Boolean).slice(0, 4),
    [recentIds, product?.id],
  )

  if (!product) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-400 font-medium mb-6">{t('notFoundText')}</p>
        <Link to="/" className="inline-block bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-sm">
          {t('notFoundCta')}
        </Link>
      </div>
    )
  }

  const name = localText(product.name, lang)
  const specs = product.specs[lang] ?? product.specs.ka
  const category = getCategory(product.cat)
  const unitWeight = getItemWeight(product)
  const singleDelivery = Math.max(DELIVERY_MIN_FEE, Math.round(unitWeight * DELIVERY_RATE_PER_KG))

  const add = () => {
    for (let i = 0; i < qty; i += 1) addToCart(product.id)
    show(t('toastAdded', name))
  }

  const buy = () => {
    for (let i = 0; i < qty; i += 1) addToCart(product.id)
    show(t('toastAdded', name))
    navigate('/cart')
  }

  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto w-full">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all"
      >
        {t('backToCatalog')}
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="relative">
          <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-[140px] select-none">
            {product.emoji}
          </div>
          {discountPercent(product) > 0 && (
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
              {t('discountUpTo', discountPercent(product))}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{category.emoji} {category.label[lang]}</span>
            <span className="text-slate-200">•</span>
            <span>{product.brand}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3 leading-tight">{name}</h1>
          <Rating stars={product.stars} reviews={product.reviews} className="mb-6" />

          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl font-black text-slate-900">{formatPrice(product.price)}</span>
            {isDiscounted(product) && (
              <span className="text-lg font-bold text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <p className="text-sm font-bold text-emerald-600 mb-6">{t('stock', product.stock)}</p>

          <p className="text-slate-600 text-sm leading-relaxed mb-8">{localText(product.desc, lang)}</p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">{t('deliveryEstimate')}</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">
                  {formatPrice(singleDelivery + (qty - 1) * Math.round(unitWeight * DELIVERY_RATE_PER_KG))}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {formatWeight(unitWeight)} · {t('deliveryEstimateHint')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase text-slate-400">{t('itemWeight')}</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{formatWeight(product.weight)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('quantity')}</span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="px-4 py-2 font-bold text-slate-500 hover:bg-white transition-colors"
                aria-label="-"
              >
                −
              </button>
              <span className="px-3 text-sm font-black text-slate-800 min-w-8 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((v) => Math.min(product.stock, v + 1))}
                className="px-4 py-2 font-bold text-slate-500 hover:bg-white transition-colors"
                aria-label="+"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={add}
              className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl text-sm transition-all"
            >
              🛒 {t('addToCart')}
            </button>
            <button
              type="button"
              onClick={buy}
              className="flex-1 px-6 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md"
            >
              ⚡ {t('buyNow')}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              ensureInCart(product.id)
              show(t('toastAdded', name))
              navigate('/checkout')
            }}
            className="w-full mt-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            {t('addToCartAndCheckout')} →
          </button>

          <p className="mt-6 text-xs font-semibold text-slate-400">🛡️ {t('warrantyNote')}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">{t('specs')}</h2>
          <table className="w-full">
            <tbody>
              {Object.entries(specs).map(([key, value]) => (
                <tr key={key} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 text-slate-400 text-sm w-2/5">{key}</td>
                  <td className="py-3 text-slate-800 text-sm font-semibold">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-3">{t('description')}</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{localText(product.desc, lang)}</p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{t('similarProducts')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {similar.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="mt-16 border-t border-slate-100 pt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('recentlyViewed')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}