import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItemsList from '../components/CartItemsList'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/I18nContext'
import { useToast } from '../context/ToastContext'
import {
  calcCartTotalWeight,
  calcDelivery,
  calcSubtotal,
  formatPrice,
  formatWeight,
} from '../lib/pricing'
import { writeStorage } from '../lib/storage'

const BANKS = [
  { key: 'BOG', labelKey: 'bankBOG', accent: 'accent-orange-500', ring: 'border-orange-500', text: 'text-orange-600' },
  { key: 'TBC', labelKey: 'bankTBC', accent: 'accent-blue-600', ring: 'border-blue-600', text: 'text-blue-600' },
  { key: 'CREDO', labelKey: 'bankCredo', accent: 'accent-amber-600', ring: 'border-amber-600', text: 'text-amber-600' },
]

const emptyForm = { firstName: '', lastName: '', phone: '', address: '' }

export default function Checkout() {
  const { t } = useI18n()
  const { items, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()

  const [method, setMethod] = useState('card')
  const [bank, setBank] = useState('')
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    firstName: user?.name?.split(' ')[0] ?? '',
    lastName: user?.name?.split(' ').slice(1).join(' ') ?? '',
    phone: '',
    address: '',
  }))
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })
  const [submitting, setSubmitting] = useState(false)

  const subtotal = calcSubtotal(items)
  const delivery = calcDelivery(items)
  const total = subtotal + delivery
  const weight = calcCartTotalWeight(items)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim()

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  const placeOrder = (event) => {
    event.preventDefault()
    if (items.length === 0) {
      show(t('toastEmptyCart'))
      return
    }

    const missing = ['firstName', 'lastName', 'phone', 'address'].some((field) => !form[field].trim())
    if (missing) {
      show(t('toastFillRequired'))
      return
    }

    if (method === 'card' && card.number.replace(/\D/g, '').length < 16) {
      show(t('toastCardInvalid'))
      return
    }

    if (method === 'installment' && !bank) {
      show(t('toastSelectBank'))
      return
    }

    setSubmitting(true)
    show(method === 'card' ? t('toastProcessing') : t('toastRedirecting', bank))

    const order = {
      ref: `TS-${Date.now().toString(36).toUpperCase()}`,
      customer: { ...form, email: user?.email ?? '' },
      items: items.map((item) => ({ id: item.id, name: item.name, emoji: item.emoji, price: item.price, qty: item.qty })),
      subtotal,
      delivery,
      total,
      weight,
      method,
      bank: method === 'installment' ? bank : null,
      createdAt: new Date().toISOString(),
    }
    writeStorage('last_order', order)

    window.setTimeout(() => {
      clearCart()
      show(method === 'card' ? t('toastOrderConfirmed') : t('toastInstallmentSent'))
      setSubmitting(false)
      navigate('/order-confirmed')
    }, 1800)
  }

  if (items.length === 0) {
    return (
      <div className="p-4 md:p-12 max-w-3xl mx-auto w-full">
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl px-8">
          <div className="text-6xl mb-6">🧾</div>
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
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{t('checkoutTitle')}</h1>
        <Link to="/cart" className="text-sm font-bold bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all">
          ← {t('cartTitle')}
        </Link>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-4 text-sm font-semibold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span>{t('toastLoginRequired')}</span>
          <Link to="/login" className="text-amber-900 underline underline-offset-4 font-black whitespace-nowrap">
            {t('navLogin')} →
          </Link>
        </div>
      )}

      <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">{t('checkoutStep1')}</h2>
            <CartItemsList compact />
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">{t('checkoutStep2')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'firstName', label: t('formFirstName'), type: 'text', autoComplete: 'given-name' },
                { key: 'lastName', label: t('formLastName'), type: 'text', autoComplete: 'family-name' },
                { key: 'phone', label: t('formPhone'), type: 'tel', autoComplete: 'tel' },
                { key: 'address', label: t('formAddress'), type: 'text', autoComplete: 'street-address', full: true },
              ].map((field) => (
                <label key={field.key} className={field.full ? 'sm:col-span-2 flex flex-col gap-1' : 'flex flex-col gap-1'}>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    {field.label} <span className="text-rose-500">*</span>
                  </span>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={update(field.key)}
                    autoComplete={field.autoComplete}
                    required
                    className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-100 pb-3">{t('checkoutStep3')}</h2>

            <div className="flex border-b border-slate-200 mb-4 text-sm font-bold">
              {[
                { key: 'card', label: t('tabCard') },
                { key: 'installment', label: t('tabInstallment') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMethod(tab.key)}
                  className={`py-2 px-4 -mb-px border-b-2 transition-colors ${
                    method === tab.key ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {method === 'card' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <label className="flex flex-col gap-1 mb-4">
                  <span className="text-xs font-bold uppercase text-slate-400">{t('cardNumber')}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={card.number}
                    onChange={(event) => setCard((prev) => ({ ...prev, number: formatCardNumber(event.target.value) }))}
                    placeholder="4242 •••• •••• 4242"
                    className="p-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-amber-500"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={card.expiry}
                    onChange={(event) => setCard((prev) => ({ ...prev, expiry: formatExpiry(event.target.value) }))}
                    placeholder={t('cardExpiry')}
                    aria-label={t('cardExpiry')}
                    className="p-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={card.cvc}
                    maxLength={3}
                    onChange={(event) => setCard((prev) => ({ ...prev, cvc: event.target.value.replace(/\D/g, '') }))}
                    placeholder={t('cardCvc')}
                    aria-label={t('cardCvc')}
                    className="p-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-400 mt-4">🔒 {t('cardNote')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-400">{t('chooseBankText')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BANKS.map((option) => (
                    <label
                      key={option.key}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white transition-all ${
                        bank === option.key ? option.ring : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bank"
                        value={option.key}
                        checked={bank === option.key}
                        onChange={() => setBank(option.key)}
                        className={option.accent}
                      />
                      <span className={`text-sm font-extrabold ${option.text}`}>{t(option.labelKey)}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-slate-400">{t('installmentNote')}</p>
              </div>
            )}
          </section>
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
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black py-4 rounded-xl transition-all"
            >
              {submitting ? t('loading') : method === 'card' ? t('placeOrder') : t('requestInstallment')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}