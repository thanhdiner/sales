import { get, post } from '@/utils/clientRequest'

export const getWishlist = ({ page = 1, limit = 12 } = {}) => {
  return get(`wishlist?page=${page}&limit=${limit}`)
}

export const addToWishlist = productId => {
  return post('wishlist/add', { productId })
}

export const removeFromWishlist = productId => {
  return post('wishlist/remove', { productId })
}

export const toggleWishlist = productId => {
  return post('wishlist/toggle', { productId })
}

export const clearWishlist = () => {
  return post('wishlist/clear')
}

export const checkWishlist = productId => {
  return get(`wishlist/check/${productId}`)
}
