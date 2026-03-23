import { get, post } from '@/utils/clientRequest'

export const getWishlist = () => get('wishlist')

export const addToWishlist = productId => post('wishlist/add', { productId })

export const removeFromWishlist = productId => post('wishlist/remove', { productId })

export const toggleWishlist = productId => post('wishlist/toggle', { productId })

export const clearWishlist = () => post('wishlist/clear')

export const checkWishlist = productId => get(`wishlist/check/${productId}`)
