import { get, post } from '@/utils/clientRequest'

export const getCart = () => get('cart')

export const addToCart = params => post('cart/add', { ...params })

export const updateCartItem = ({ productId, quantity }) => post('cart/update', { productId, quantity })

export const removeCartItem = productId => post('cart/remove', { productId })

export const clearCart = () => post('cart/clear')

export const removeManyCartItems = ({ productIds }) => post('cart/remove-many', { productIds })
