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
    features: Array.isArray(product?.features)
      ? product.features.map(feature => normalizeSearchValue(feature))
      : []
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

export function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0)
      case 'price-high':
        return (b.price || 0) - (a.price || 0)
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
}

export function getCategoryDescription(category) {
  if (!category?.description) {
    return `Khám phá các sản phẩm nổi bật trong danh mục ${category?.title || ''} tại SmartMall.`
  }

  return category.description.replace(/<[^>]*>/g, '').trim()
}

export function flattenCategories(categories = []) {
  return categories.flatMap(category => [
    category,
    ...flattenCategories(category.children || [])
  ])
}
