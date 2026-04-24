import { get, post } from '@/utils/request'

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const url = query ? `products?${query}` : 'products'
  return await get(url)
}

export const trackProductView = async slug => {
  try {
    return await post(`products/${slug}/view`)
  } catch {
    // Lỗi view tracking không nên ảnh hưởng UX
  }
}

export const getProductDetail = async slug => {
  return await get(`products/${slug}`)
}

export const getExploreMoreProducts = async (productId, params = {}) => {
  const query = new URLSearchParams(params).toString()
  return await get(`products/${productId}/explore-more${query ? `?${query}` : ''}`)
}

export const getProductSuggestions = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return await get(`products/suggest?${query}`)
}

export const getRecommendations = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return await get(`products/recommendations?${query}`)
}
