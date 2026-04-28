import { PAGE_SIZE } from '../constants'

export const getWishlistInfiniteQueryKey = scope => ['client-wishlist-infinite', scope, PAGE_SIZE, 'v1']

export function isWishlistItemInStock(item) {
  if (item?.stock !== undefined && item?.stock !== null) {
    const stock = Number(item.stock)

    if (Number.isFinite(stock)) {
      return stock > 0
    }
  }

  return Boolean(item?.inStock)
}

const hasText = value => typeof value === 'string' && value.trim().length > 0

export function getWishlistItemName(item, language) {
  const translatedTitle = String(language || '').toLowerCase().startsWith('en')
    ? item?.translations?.en?.title
    : null

  if (hasText(translatedTitle)) return translatedTitle
  if (hasText(item?.title)) return item.title
  if (hasText(item?.name)) return item.name

  return ''
}

export function getWishlistDiscountPercentage(item) {
  const discountPercentage = Number(item?.discountPercentage || 0)
  const price = Number(item?.price || 0)
  const originalPrice = Number(item?.originalPrice || 0)

  if (discountPercentage > 0) {
    return Math.round(discountPercentage)
  }

  if (originalPrice > 0 && price > 0 && originalPrice > price) {
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  return 0
}

export function isWishlistItemOnSale(item) {
  return getWishlistDiscountPercentage(item) > 0
}

export function getWishlistSummaryCounts(wishlistItems) {
  const items = wishlistItems || []

  return {
    total: items.length,
    inStock: items.filter(isWishlistItemInStock).length,
    onSale: items.filter(isWishlistItemOnSale).length,
    outOfStock: items.filter(item => !isWishlistItemInStock(item)).length
  }
}

export function formatWishlistPrice(price, language) {
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price || 0)
}

export function filterAndSortWishlistItems(wishlistItems, activeFilter, sortBy) {
  let result = [...(wishlistItems || [])]

  if (activeFilter === 'inStock') {
    result = result.filter(isWishlistItemInStock)
  }

  if (activeFilter === 'deal') {
    result = result.filter(isWishlistItemOnSale)
  }

  if (activeFilter === 'outStock') {
    result = result.filter(item => !isWishlistItemInStock(item))
  }

  result.sort((a, b) => {
    if (sortBy === 'priceAsc') return Number(a.price || 0) - Number(b.price || 0)
    if (sortBy === 'priceDesc') return Number(b.price || 0) - Number(a.price || 0)

    if (sortBy === 'discountDesc') {
      return Number(b.discountPercentage || 0) - Number(a.discountPercentage || 0)
    }

    return 0
  })

  return result
}

export function getWishlistTotalPages(totalItems, limit) {
  if (totalItems <= 0) return 0
  return Math.ceil(totalItems / Math.max(limit || PAGE_SIZE, 1))
}

export function decrementWishlistPagination(pagination) {
  if (!pagination) return pagination

  const limit = Math.max(Number(pagination.limit) || PAGE_SIZE, 1)
  const totalItems = Math.max(Number(pagination.totalItems) - 1 || 0, 0)
  const totalPages = getWishlistTotalPages(totalItems, limit)

  return {
    ...pagination,
    totalItems,
    totalPages,
    hasMore: pagination.page < totalPages
  }
}

export function clearWishlistPagination(pagination) {
  if (!pagination) return pagination

  return {
    ...pagination,
    totalItems: 0,
    totalPages: 0,
    hasMore: false
  }
}

export function removeWishlistItemFromCache(queryClient, scope, productId) {
  queryClient.setQueriesData({ queryKey: ['client-wishlist', scope] }, old => {
    if (!old || Array.isArray(old) || !Array.isArray(old.items)) return old

    return {
      ...old,
      items: old.items.filter(item => item.productId !== productId),
      pagination: decrementWishlistPagination(old.pagination)
    }
  })

  queryClient.setQueryData(getWishlistInfiniteQueryKey(scope), old => {
    if (!old?.pages?.length) return old

    return {
      ...old,
      pages: old.pages.map(page => ({
        ...page,
        items: Array.isArray(page?.items) ? page.items.filter(item => item.productId !== productId) : [],
        pagination: decrementWishlistPagination(page?.pagination)
      }))
    }
  })
}

export function clearWishlistCache(queryClient, scope) {
  queryClient.setQueriesData({ queryKey: ['client-wishlist', scope] }, old => {
    if (!old || Array.isArray(old) || !Array.isArray(old.items)) return old

    return {
      ...old,
      items: [],
      pagination: clearWishlistPagination(old.pagination)
    }
  })

  queryClient.setQueryData(getWishlistInfiniteQueryKey(scope), old => {
    if (!old?.pages?.length) return old

    return {
      ...old,
      pages: [
        {
          ...old.pages[0],
          items: [],
          pagination: clearWishlistPagination(old.pages[0]?.pagination)
        }
      ],
      pageParams: old.pageParams?.length ? [old.pageParams[0]] : [1]
    }
  })
}
