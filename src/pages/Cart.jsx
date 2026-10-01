import { Link } from 'react-router-dom'
import CartItemsList from '../components/CartItemsList'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/I18nContext'
import { calcCartTotalWeight, calcDelivery, calcSubtotal, formatPrice, formatWeight } from '../lib/pricing'

export default function Cart() {
  const { items, count } = useCart()
  const { t } = useI18n()

  const subtotal = calcSubtotal(items)
  const delivery = calcDelivery(items)
  const weight = calcCartTotalWeight(items)
  const total = subtotal + delivery

  if (items.length === 0) {
    return (
      <div className="p-4 md:p-12 max-w-3xl mx-auto w-full">
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl px-8">
          <div className="text-6xl mb-6">🛒</div>
          <p className="font-bold text-slate-900 text-lg mb-8">{t('cartEmpty')}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors">
            {t('cartGoShopping')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {t('cartTitle')} <span className="text-slate-400 font-bold">({t('itemsCount', count)})</span>
        </h1>
        <Link to="/" className="text-sm font-bold bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all">
          {t('continueShopping')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
            {t('checkoutStep1')}
          </h2>
          <CartItemsList />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{t('orderSummary')}</h2>
            <div className="space-y-3 text-sm font-medium border-b border-slate-100 pb-4">
              <div className="flex justify-between text-slate-500">
                <span>{t('summaryProducts')}</span>
                <span className="text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t('summaryDelivery')}</span>
                <span className="text-slate-900 font-bold">{formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t('summaryWeight')}</span>
                <span className="text-slate-900 font-bold">{formatWeight(weight)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center my-4">
              <span className="text-base font-bold text-slate-900">{t('summaryTotal')}</span>
              <span className="text-2xl font-black text-slate-900">{formatPrice(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4 rounded-xl transition-all text-center block"
            >
              {t('checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}