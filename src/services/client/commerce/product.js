import { del, get, post } from '@/utils/clientRequest'

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return query ? `?${query}` : ''
}

export const getProducts = (params = {}) => {
  const query = buildQueryString(params)
  return get(`products${query}`)
}

export const trackProductView = async slug => {
  try {
    return await post(`products/${slug}/view`)
  } catch {
    // Lỗi view tracking không nên ảnh hưởng UX
  }
}

export const getProductDetail = slug => {
  return get(`products/${slug}`)
}

export const subscribeBackInStock = (productId, payload = {}) => {
  return post(`products/${productId}/notify-when-back-in-stock`, payload)
}

export const unsubscribeBackInStock = (productId, payload = {}) => {
  return del(`products/${productId}/notify-when-back-in-stock`, payload)
}

export const notifyWhenBackInStock = subscribeBackInStock

export const getExploreMoreProducts = (productId, params = {}) => {
  return get(`products/${productId}/explore-more${buildQueryString(params)}`)
}

export const getProductSuggestions = (params = {}) => {
  return get(`products/suggest${buildQueryString(params)}`)
}

export const getProductSearchSuggestions = (params = {}) => {
  return get(`products/search-suggestions${buildQueryString(params)}`)
}

export const getRecommendations = (params = {}) => {
  return get(`products/recommendations${buildQueryString(params)}`)
}