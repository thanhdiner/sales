export const MAX_CART_UNIQUE_ITEMS = 50

export const getDistinctCartItemCount = cartItems => {
  if (!Array.isArray(cartItems)) return 0
  return new Set(cartItems.map(item => item.productId)).size
}

export const getCartRemainingSlots = cartItems =>
  Math.max(MAX_CART_UNIQUE_ITEMS - getDistinctCartItemCount(cartItems), 0)

export const isNewDistinctCartItem = (cartItems, productId) => {
  if (!productId) return false
  return !Array.isArray(cartItems) || !cartItems.some(item => item.productId === productId)
}

export const hasReachedCartUniqueItemLimit = (cartItems, productId) =>
  isNewDistinctCartItem(cartItems, productId) && getDistinctCartItemCount(cartItems) >= MAX_CART_UNIQUE_ITEMS

export const getCartUniqueItemLimitMessage = () =>
  `Bạn chỉ có thể thêm tối đa ${MAX_CART_UNIQUE_ITEMS} sản phẩm khác nhau vào giỏ hàng.`
