import { getCart } from '@/services/cartsService'
import { getWishlist } from '@/services/wishlistService'
import { queryClient } from '@/lib/queryClient'
import { queryKeys, AUTHENTICATED_QUERY_SCOPE } from '@/lib/queryKeys'
import { normalizeWishlistItems } from '@/lib/normalizeWishlistItems'
import { setCart } from '@/stores/cart'
import { setUser as setClientUser } from '@/stores/user'
import { setWishlist } from '@/stores/wishlist'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'

const CART_MUTATION_TOOLS = new Set([
  'addToCart',
  'updateCartQuantity',
  'removeFromCart',
  'clearCart'
])

const WISHLIST_MUTATION_TOOLS = new Set([
  'addToWishlist',
  'removeFromWishlist',
  'toggleWishlist',
  'clearWishlist'
])

export const hasClientToken = () => Boolean(getClientAccessToken() || getClientAccessTokenSession())

export const getClientToken = () => getClientAccessToken() || getClientAccessTokenSession()

export const normalizeCartItems = items =>
  (items || []).map(item => ({
    ...item,
    id: item.id || item.productId
  }))

export const setClientUserCache = user => {
  queryClient.setQueryData(queryKeys.clientUser(AUTHENTICATED_QUERY_SCOPE), user || null)
}

export const setClientCartCache = items => {
  const normalizedItems = normalizeCartItems(items)
  queryClient.setQueryData(queryKeys.clientCart(AUTHENTICATED_QUERY_SCOPE), normalizedItems)
  return normalizedItems
}

export const setClientWishlistCache = items => {
  const nextItems = normalizeWishlistItems(items)
  queryClient.setQueryData(queryKeys.clientWishlist(AUTHENTICATED_QUERY_SCOPE), nextItems)
  queryClient.setQueriesData({ queryKey: ['client-wishlist', AUTHENTICATED_QUERY_SCOPE] }, old => ({
    ...(old && !Array.isArray(old) ? old : {}),
    items: nextItems
  }))
  return nextItems
}

export const clearClientPrivateQueryCache = () => {
  queryClient.removeQueries({ queryKey: ['clientUser'] })
  queryClient.removeQueries({ queryKey: ['clientCart'] })
  queryClient.removeQueries({ queryKey: ['clientWishlist'] })
  queryClient.removeQueries({ queryKey: ['client-wishlist'] })
  queryClient.removeQueries({ queryKey: ['client-wishlist-infinite'] })
}

export const syncClientUserState = (dispatch, user) => {
  const token = getClientToken()

  dispatch(
    setClientUser({
      user: user || null,
      token: token || null
    })
  )

  setClientUserCache(user)
}

export const syncCartState = (dispatch, items) => {
  const normalizedItems = setClientCartCache(items)
  dispatch(setCart(normalizedItems))
  return normalizedItems
}

export const syncWishlistState = (dispatch, items) => {
  const nextItems = setClientWishlistCache(items)
  dispatch(setWishlist(nextItems))
  return nextItems
}

export const syncCartFromServer = async dispatch => {
  const cart = await getCart()
  return syncCartState(dispatch, cart?.items || [])
}

export const syncWishlistFromServer = async dispatch => {
  const wishlist = await getWishlist()
  return syncWishlistState(dispatch, wishlist)
}

export const getClientSyncTargetsFromTools = toolsUsed => {
  const normalizedTools = Array.isArray(toolsUsed)
    ? [...new Set(
        toolsUsed
          .filter(tool => typeof tool === 'string')
          .map(tool => tool.trim())
          .filter(Boolean)
      )]
    : []

  return {
    cart: normalizedTools.some(tool => CART_MUTATION_TOOLS.has(tool)),
    wishlist: normalizedTools.some(tool => WISHLIST_MUTATION_TOOLS.has(tool))
  }
}

export const syncClientStateFromBotTools = async (dispatch, toolsUsed) => {
  if (!hasClientToken()) return

  const syncTargets = getClientSyncTargetsFromTools(toolsUsed)
  const syncTasks = []

  if (syncTargets.cart) {
    syncTasks.push(syncCartFromServer(dispatch))
  }

  if (syncTargets.wishlist) {
    syncTasks.push(syncWishlistFromServer(dispatch))
  }

  if (syncTasks.length === 0) return

  await Promise.all(syncTasks)

  if (syncTargets.wishlist) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['client-wishlist', AUTHENTICATED_QUERY_SCOPE] }),
      queryClient.invalidateQueries({ queryKey: ['client-wishlist-infinite', AUTHENTICATED_QUERY_SCOPE] })
    ])
  }
}

export const clearClientSessionState = dispatch => {
  clearClientPrivateQueryCache()
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')
  dispatch(setClientUser({ user: null, token: null }))
  dispatch(setCart([]))
  dispatch(setWishlist([]))
}
