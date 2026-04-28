export function detectPageType(pathname = '') {
  if (/^\/products\/[^/]+/.test(pathname)) return 'product_detail'
  if (/^\/products(?:\/|$)/.test(pathname)) return 'product_list'
  if (/^\/product-category\//.test(pathname)) return 'product_category'
  if (pathname === '/cart') return 'cart'
  if (pathname === '/checkout') return 'checkout'
  if (/^\/orders\//.test(pathname)) return 'order_detail'
  if (pathname === '/orders') return 'orders'
  if (/^\/blog\//.test(pathname)) return 'blog_detail'
  if (pathname === '/') return 'home'
  return 'generic'
}
