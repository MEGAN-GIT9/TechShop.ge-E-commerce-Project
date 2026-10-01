import { Link, useNavigate } from 'react-router-dom'
import { BADGE_STYLES, discountPercent, isDiscounted } from '../data/products'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/I18nContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../lib/pricing'
import { localText } from '../lib/storage'
import Rating from './Rating'

export default function ProductCard({ product, onAddToCart, onBuyNow, showCategory = true }) {
  const { t, lang } = useI18n()
  const { addToCart, ensureInCart, items } = useCart()
  const { show } = useToast()
  const navigate = useNavigate()

  const inCartQty = items.find((item) => item.id === product.id)?.qty ?? 0
  const name = localText(product.name, lang)
  const discount = discountPercent(product)

  const handleAdd = () => {
    addToCart(product.id)
    show(t('toastAdded', name))
    onAddToCart?.(product)
  }

  const handleBuy = () => {
    ensureInCart(product.id)
    show(t('toastAdded', name))
    onBuyNow?.(product)
    navigate('/cart')
  }

  return (
    <article className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
      <div className="relative aspect-square bg-slate-50 flex items-center justify-center border-b border-slate-100 select-none">
        <Link to={`/product/${product.id}`} className="absolute inset-0" aria-label={name} />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2 py-1 rounded-md shadow-sm ${
              BADGE_STYLES[product.badge] ?? 'bg-slate-900 text-white'
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-1 rounded-md bg-amber-500 text-slate-950 shadow-sm">
            −{discount}%
          </span>
        )}
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300 pointer-events-none">
          {product.emoji}
        </span>
        {inCartQty > 0 && (
          <span className="absolute bottom-3 right-3 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg">
            ×{inCartQty}
          </span>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
        <div>
          {showCategory && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
              <span className="text-slate-200">•</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.cat}</span>
            </div>
          )}
          <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
            <Link to={`/product/${product.id}`} className="hover:text-amber-600 transition-colors line-clamp-2">
              {name}
            </Link>
          </h3>
          <Rating stars={product.stars} reviews={product.reviews} className="mt-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-base font-black text-slate-900">{formatPrice(product.price)}</span>
            {isDiscounted(product) && (
              <span className="text-xs font-bold text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBuy}
              className="flex-1 h-9 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition-all shadow-sm"
            >
              {t('buyNow')}
            </button>
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`${t('addToCart')}: ${name}`}
              className="h-9 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-sm"
            >
              🛒 {t('addToCartShort')}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}