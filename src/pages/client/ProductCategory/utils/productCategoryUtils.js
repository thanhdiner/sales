import { removeVietnameseTones } from '@/utils/removeVietnameseTones'

export function normalizeSearchValue(value = '') {
  return removeVietnameseTones(String(value)).toLowerCase().trim()
}

export function isFuzzySubsequenceMatch(query, text) {
  if (!query) return true
  if (!text) return false

  let queryIndex = 0

  for (const character of text) {
    if (character === query[queryIndex]) {
      queryIndex += 1
    }

    if (queryIndex === query.length) {
      return true
    }
  }

  return false
}

export function createProductSearchIndex(products = []) {
  return products.map(product => ({
    product,
    title: normalizeSearchValue(product?.title),
    description: normalizeSearchValue(product?.description),
    features: Array.isArray(product?.features) ? product.features.map(feature => normalizeSearchValue(feature)) : []
  }))
}

export function matchesProductSearch(searchItem, normalizedQuery) {
  if (!normalizedQuery) return true

  return (
    searchItem.title.includes(normalizedQuery) ||
    searchItem.description.includes(normalizedQuery) ||
    isFuzzySubsequenceMatch(normalizedQuery, searchItem.title) ||
    isFuzzySubsequenceMatch(normalizedQuery, searchItem.description)
  )
}

export function matchesProductFeatures(searchItem, selectedFeatures = []) {
  if (!selectedFeatures.length) return true

  return selectedFeatures.every(feature => {
    switch (feature) {
      case 'auto-delivery':
        return Number(searchItem.product?.deliveryEstimateDays || 0) <= 0
      case 'licensed':
        return searchItem.features.some(item => item.includes('ban quyen') || item.includes('chinh hang') || item.includes('license'))
      case 'support':
        return searchItem.features.some(item => item.includes('ho tro') || item.includes('support'))
      case 'featured':
        return Boolean(searchItem.product?.isFeatured)
      default:
        return true
    }
  })
}

export function matchesProductFilters(product, filters = {}) {
  const price = getProductSalePrice(product)

  if (filters.minPrice > 0 && price < filters.minPrice) return false
  if (filters.maxPrice > 0 && price > filters.maxPrice) return false
  if (filters.rating > 0 && (product?.rate || 0) < filters.rating) return false
  if (filters.inStock && (product?.stock || 0) <= 0) return false
  if (filters.isTopDeal && !product?.isTopDeal) return false
  if (filters.isFeatured && !product?.isFeatured) return false

  return true
}

export function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
      case 'price_asc':
        return (a.price || 0) - (b.price || 0)
      case 'price-high':
      case 'price_desc':
        return (b.price || 0) - (a.price || 0)
      case 'newest':
        return getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
      case 'sold_desc':
        return (b.soldQuantity || 0) - (a.soldQuantity || 0)
      case 'rate_desc':
        return (b.rate || 0) - (a.rate || 0)
      case 'name_asc':
      case 'name':
        return (a.title || '').localeCompare(b.title || '')
      case 'name_desc':
        return (b.title || '').localeCompare(a.title || '')
      case 'recommended':
      default:
        return compareRecommendedProducts(a, b)
    }
  })
}

export function getCategoryDescription(category, fallbackDescription = '') {
  if (!category?.description) {
    return fallbackDescription
  }

  return category.description.replace(/<[^>]*>/g, '').trim()
}

export function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, '').trim()
}

export function flattenCategories(categories = []) {
  return categories.flatMap(category => [category, ...flattenCategories(category.children || [])])
}

export function findCategoryBySlug(categories = [], slug) {
  for (const category of categories) {
    if (category?.slug === slug) {
      return category
    }

    const found = findCategoryBySlug(category?.children || [], slug)

    if (found) {
      return found
    }
  }

  return null
}

export function getCategoryId(category) {
  if (!category) return ''

  return String(category.value || category._id || category.id || '')
}

export function getProductCategoryId(product) {
  const productCategory = product?.productCategory

  if (!productCategory) return ''
  if (typeof productCategory === 'string') return productCategory

  return String(productCategory._id || productCategory.value || productCategory.id || productCategory)
}

export function collectCategoryIds(category) {
  if (!category) return []

  return [
    getCategoryId(category),
    ...(category.children || []).flatMap(child => collectCategoryIds(child))
  ].filter(Boolean)
}

export function createChildCategoryProductCountMap(children = [], products = []) {
  return children.reduce((counts, child) => {
    const childCategoryIds = new Set(collectCategoryIds(child))
    const count = products.filter(product => childCategoryIds.has(getProductCategoryId(product))).length

    counts[getCategoryId(child)] = count
    return counts
  }, {})
}

function compareRecommendedProducts(a, b) {
  const comparisons = [
    Number(Boolean(b.isTopDeal)) - Number(Boolean(a.isTopDeal)),
    Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)),
    (b.recommendScore || 0) - (a.recommendScore || 0),
    (b.soldQuantity || 0) - (a.soldQuantity || 0),
    (b.viewsCount || 0) - (a.viewsCount || 0),
    (b.rate || 0) - (a.rate || 0),
    getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
  ]

  return comparisons.find(value => value !== 0) || 0
}

function getTimestamp(value) {
  const time = new Date(value || 0).getTime()

  return Number.isFinite(time) ? time : 0
}

function getProductSalePrice(product) {
  if (!product) return 0
  if (product.salePrice !== undefined && product.salePrice !== null) return Number(product.salePrice) || 0

  const price = Number(product.price) || 0
  const discount = Number(product.discountPercentage || product.discountPercent) || 0

  return discount > 0 ? (price * (100 - discount)) / 100 : price
}
