export const AUTHENTICATED_QUERY_SCOPE = 'authenticated'
export const GUEST_QUERY_SCOPE = 'guest'

export const queryKeys = {
  websiteConfig: ['websiteConfig'],
  categories: ['productCategories', 'tree'],
  clientUser: scope => ['clientUser', scope],
  clientCart: scope => ['clientCart', scope],
  clientWishlist: scope => ['clientWishlist', scope]
}
