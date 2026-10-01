import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CatalogContext = createContext(null)

const initialFilters = {
  search: '',
  category: 'all',
  group: 'all',
  brand: 'all',
  priceMin: '',
  priceMax: '',
  discountOnly: false,
  sort: 'default',
}

export function CatalogProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters)

  const patch = useCallback((next) => setFilters((prev) => ({ ...prev, ...next })), [])

  const setSearch = useCallback((search) => patch({ search }), [patch])
  const setCategory = useCallback((category) => patch({ category, group: 'all' }), [patch])
  const setGroup = useCallback((group) => patch({ group, category: 'all' }), [patch])
  const setBrand = useCallback((brand) => patch({ brand }), [patch])
  const setPriceRange = useCallback((priceMin, priceMax) => patch({ priceMin, priceMax }), [patch])
  const setDiscountOnly = useCallback((discountOnly) => patch({ discountOnly }), [patch])
  const setSort = useCallback((sort) => patch({ sort }), [patch])

  const reset = useCallback(() => setFilters(initialFilters), [])

  const value = useMemo(
    () => ({
      ...filters,
      patch,
      setSearch,
      setCategory,
      setGroup,
      setBrand,
      setPriceRange,
      setDiscountOnly,
      setSort,
      reset,
      hasActiveFilters:
        filters.category !== 'all' ||
        filters.group !== 'all' ||
        filters.brand !== 'all' ||
        filters.priceMin !== '' ||
        filters.priceMax !== '' ||
        filters.discountOnly,
    }),
    [filters, patch, setSearch, setCategory, setGroup, setBrand, setPriceRange, setDiscountOnly, setSort, reset],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>')
  return ctx
}