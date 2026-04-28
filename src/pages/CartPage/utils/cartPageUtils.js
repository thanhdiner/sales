const FREE_SHIPPING_THRESHOLD = 100000
const SHIPPING_FEE = 50000

export function formatCartPrice(price, language) {
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price || 0)
}

export function getCartItemSavings(original, current) {
  if (!original || !current || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

export function getAvailableCartIds(cartItems) {
  return (cartItems || []).filter(item => item.inStock).map(item => item.productId)
}

export function getCartSubtotal(cartItems) {
  return (cartItems || []).reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function calculateCartSummary(selectedCartItems, appliedPromo) {
  const subtotal = getCartSubtotal(selectedCartItems)
  const discount = appliedPromo?.discount || 0
  const shipping = appliedPromo?.freeShipping ? 0 : subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal - discount + shipping
  const selectedQuantity = (selectedCartItems || []).reduce((sum, item) => sum + item.quantity, 0)

  return {
    discount,
    selectedQuantity,
    shipping,
    subtotal,
    total
  }
}
