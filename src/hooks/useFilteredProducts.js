import { useMemo } from 'react'
import { CATEGORY_GROUPS, PRODUCTS, getCategory, isDiscounted } from '../data/products'
import { useCatalog } from '../context/CatalogContext'
import { useI18n } from '../context/I18nContext'
import { localText } from '../lib/storage'

const sorters = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.stars - a.stars || b.reviews - a.reviews,
  default: () => 0,
}

export function filterProducts(products, filters, lang) {
  const query = filters.search.trim().toLowerCase()
  const min = filters.priceMin === '' ? 0 : Number(filters.priceMin) || 0
  const max = filters.priceMax === '' ? Infinity : Number(filters.priceMax) || Infinity
  const group = CATEGORY_GROUPS.find((g) => g.key === filters.group)

  const matched = products.filter((product) => {
    if (filters.category !== 'all' && product.cat !== filters.category) return false
    if (group && !group.cats.includes(product.cat)) return false
    if (filters.brand !== 'all' && product.brand !== filters.brand) return false
    if (filters.discountOnly && !isDiscounted(product)) return false
    if (product.price < min || product.price > max) return false
    if (!query) return true

    const haystack = [
      localText(product.name, lang),
      localText(product.desc, lang),
      product.brand,
      product.cat,
      getCategory(product.cat)?.label[lang],
      getCategory(product.cat)?.label.en,
      getCategory(product.cat)?.label.ka,
      ...Object.values(product.specs.ka),
      ...Object.values(product.specs.en),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })

  return matched.sort(sorters[filters.sort] ?? sorters.default)
}

/** Applies every active catalog filter to the product list. */
export function useFilteredProducts() {
  const catalog = useCatalog()
  const { lang } = useI18n()

  return useMemo(
    () => filterProducts(PRODUCTS, catalog, lang),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      catalog.search,
      catalog.category,
      catalog.group,
      catalog.brand,
      catalog.priceMin,
      catalog.priceMax,
      catalog.discountOnly,
      catalog.sort,
      lang,
    ],
  )
}