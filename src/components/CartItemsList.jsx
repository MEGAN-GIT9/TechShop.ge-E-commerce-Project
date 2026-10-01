import { useCart } from '../context/CartContext'
import { useI18n } from '../context/I18nContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../lib/pricing'
import { localText } from '../lib/storage'

export default function CartItemsList({ compact = false }) {
  const { items, changeQty, removeFromCart } = useCart()
  const { t, lang } = useI18n()
  const { show } = useToast()

  const handleRemove = (product) => {
    removeFromCart(product.id)
    show(t('toastRemoved'))
  }

  return (
    <div className="divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {item.emoji}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-slate-900 truncate">{localText(item.name, lang)}</p>
              <p className="text-xs font-bold text-amber-600 mt-0.5">{formatPrice(item.price)}</p>
              {!compact && <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{item.brand}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => changeQty(item.id, -1)}
                aria-label="-"
                className="px-3 py-1 font-bold text-slate-500 hover:bg-white transition-colors"
              >
                −
              </button>
              <span className="px-2 text-xs font-bold text-slate-800 min-w-[1.5rem] text-center">{item.qty}</span>
              <button
                type="button"
                onClick={() => changeQty(item.id, 1)}
                aria-label="+"
                className="px-3 py-1 font-bold text-slate-500 hover:bg-white transition-colors"
              >
                +
              </button>
            </div>
            <span className="w-20 text-right text-sm font-black text-slate-900">
              {formatPrice(item.price * item.qty)}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(item)}
              aria-label={t('remove')}
              className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}