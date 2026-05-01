export const AUTHENTICATED_QUERY_SCOPE = 'authenticated'
export const GUEST_QUERY_SCOPE = 'guest'

export const clientQueryKeys = {
  user: scope => ['clientUser', scope],
  cart: scope => ['clientCart', scope],
  wishlist: scope => ['clientWishlist', scope]
}
