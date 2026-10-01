import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProduct } from '../data/products'
import { readStorage, writeStorage } from '../lib/storage'

const CartContext = createContext(null)

const STORAGE_KEY = 'cart'

const readInitialLines = () => {
  const stored = readStorage(STORAGE_KEY, [])
  if (!Array.isArray(stored)) return []
  return stored.filter((line) => getProduct(line.id)).map((line) => ({ id: line.id, qty: Math.max(1, Number(line.qty) || 1) }))
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(readInitialLines)

  useEffect(() => {
    writeStorage(STORAGE_KEY, lines)
  }, [lines])

  /** Cart lines joined with the current catalog data. */
  const items = useMemo(
    () => lines.map((line) => ({ ...getProduct(line.id), qty: line.qty })).filter((p) => p.id),
    [lines],
  )

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.qty, 0), [lines])

  const addToCart = useCallback((id, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.id === id)
      if (existing) {
        return prev.map((line) => (line.id === id ? { ...line, qty: line.qty + qty } : line))
      }
      return [...prev, { id, qty }]
    })
  }, [])

  /** Adds the product and makes sure it is in the cart, without touching quantities. */
  const ensureInCart = useCallback((id) => {
    setLines((prev) => (prev.some((line) => line.id === id) ? prev : [...prev, { id, qty: 1 }]))
  }, [])

  const changeQty = useCallback((id, delta) => {
    setLines((prev) =>
      prev
        .map((line) => (line.id === id ? { ...line, qty: line.qty + delta } : line))
        .filter((line) => line.qty > 0),
    )
  }, [])

  const removeFromCart = useCallback((id) => {
    setLines((prev) => prev.filter((line) => line.id !== id))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const value = useMemo(
    () => ({
      items,
      lines,
      count,
      addToCart,
      ensureInCart,
      changeQty,
      removeFromCart,
      clearCart,
      isInCart: (id) => lines.some((line) => line.id === id),
    }),
    [items, lines, count, addToCart, ensureInCart, changeQty, removeFromCart, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}