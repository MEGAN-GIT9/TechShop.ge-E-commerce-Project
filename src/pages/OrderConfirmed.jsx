import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { formatPrice, formatWeight } from '../lib/pricing'
import { localText, readStorage } from '../lib/storage'

export default function OrderConfirmed() {
  const { t, lang } = useI18n()
  const order = readStorage('last_order', null)

  if (!order) {
    return (
      <div className="p-4 md:p-12 max-w-3xl mx-auto w-full text-center">
        <div className="bg-white border border-slate-200 rounded-3xl px-8 py-16">
          <p className="font-bold text-slate-900 text-lg mb-8">{t('cartEmpty')}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm">
            {t('notFoundCta')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-12 max-w-3xl mx-auto w-full">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{t('orderPlaced')}</h1>
        <p className="text-sm font-semibold text-emerald-600 mb-8">
          {order.method === 'card' ? t('toastOrderConfirmed') : t('toastInstallmentSent')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-8">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('orderSummaryRef')}</p>
            <p className="font-black text-slate-900">{order.ref}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('tabInstallment').replace('🏦 ', '')}</p>
            <p className="font-black text-slate-900">
              {order.method === 'card' ? t('tabCard').replace('💳 ', '') : `${order.bank}`}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('formAddress')}</p>
            <p className="font-bold text-slate-900">
              {order.customer.firstName} {order.customer.lastName} · {order.customer.phone}
            </p>
            <p className="text-slate-600 mt-0.5">{order.customer.address}</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border-y border-slate-100 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-bold text-slate-900 truncate">{localText(item.name, lang)}</span>
                <span className="text-xs font-bold text-slate-400">×{item.qty}</span>
              </div>
              <span className="text-sm font-black text-slate-900 whitespace-nowrap">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm font-medium mb-8">
          <div className="flex justify-between text-slate-500">
            <span>{t('summaryProducts')}</span>
            <span className="text-slate-900">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>{t('summaryDelivery')} ({formatWeight(order.weight)})</span>
            <span className="text-slate-900 font-bold">{formatPrice(order.delivery)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-base font-bold text-slate-900">{t('summaryTotal')}</span>
            <span className="text-2xl font-black text-slate-900">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1 text-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors">
            {t('continueShopping')}
          </Link>
          <Link to="/about" className="flex-1 text-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors">
            {t('navAbout')}
          </Link>
        </div>
      </div>
    </div>
  )
}