import { CURRENCY } from '../data/products'

/** ₾ per kilogram */
export const DELIVERY_RATE_PER_KG = 2
/** Minimum delivery fee in ₾ */
export const DELIVERY_MIN_FEE = 5
/** Divisor used to turn cm³ into a volumetric weight in kg */
export const VOLUMETRIC_DIVISOR = 6000

/**
 * Chargeable weight of a single unit: the heavier of the real weight
 * and the volumetric weight (w × h × d in cm).
 */
export const getItemWeight = (product) => {
  const real = product?.weight ?? 0
  const { w = 0, h = 0, d = 0 } = product?.dims ?? {}
  const volumetric = (w * h * d) / VOLUMETRIC_DIVISOR
  return Math.max(real, volumetric)
}

export const roundWeight = (weight) => Math.round(weight * 100) / 100

/** Delivery price for a list of cart lines (`{ ...product, qty }`). */
export const calcDelivery = (lines) => {
  if (!lines?.length) return 0
  const totalWeight = lines.reduce((sum, line) => sum + getItemWeight(line) * (line.qty ?? 1), 0)
  return Math.max(DELIVERY_MIN_FEE, Math.round(totalWeight * DELIVERY_RATE_PER_KG))
}

export const calcSubtotal = (lines) =>
  (lines ?? []).reduce((sum, line) => sum + line.price * (line.qty ?? 1), 0)

export const calcCartTotalWeight = (lines) =>
  roundWeight((lines ?? []).reduce((sum, line) => sum + getItemWeight(line) * (line.qty ?? 1), 0))

export const formatPrice = (value) => `${CURRENCY}${Math.round(value).toLocaleString('en-US')}`

export const formatWeight = (weight) => `${roundWeight(weight).toLocaleString('en-US')} kg`