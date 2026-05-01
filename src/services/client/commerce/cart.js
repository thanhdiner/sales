import { get, post } from '@/utils/clientRequest'

export const getCart = () => {
  return get('cart')
}

export const addToCart = params => {
  return post('cart/add', { ...params })
}

export const updateCartItem = ({ productId, quantity }) => {
  return post('cart/update', { productId, quantity })
}

export const removeCartItem = productId => {
  return post('cart/remove', { productId })
}

export const clearCart = () => {
  return post('cart/clear')
}

export const removeManyCartItems = ({ productIds }) => {
  return post('cart/remove-many', { productIds })
}