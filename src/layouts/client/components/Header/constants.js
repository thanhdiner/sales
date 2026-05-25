export const primaryNavItems = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.products', path: '/products' },
  { labelKey: 'nav.flashSale', path: '/flash-sale' },
  { labelKey: 'nav.about', path: '/about' },
  { labelKey: 'nav.contact', path: '/contact' }
]

export const secondaryNavItems = [
  { labelKey: 'nav.blog', path: '/blog' },
  { labelKey: 'nav.faq', path: '/faq' },
  { labelKey: 'nav.shoppingGuide', path: '/shopping-guide' },
  { labelKey: 'nav.coupons', path: '/coupons' },
  { labelKey: 'nav.vip', path: '/vip' }
]

export const navItems = primaryNavItems

export const isNavItemActive = (pathname, path) => {
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(`${path}/`)
}
