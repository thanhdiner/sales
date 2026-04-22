import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { clearClientSessionState, getClientToken, hasClientToken } from '@/lib/clientCache'
import { normalizeWishlistItems } from '@/lib/normalizeWishlistItems'
import { AUTHENTICATED_QUERY_SCOPE, GUEST_QUERY_SCOPE } from '@/lib/queryKeys'
import {
  useCategoriesQuery,
  useClientCartQuery,
  useClientMeQuery,
  useClientWishlistQuery,
  useWebsiteConfigQuery
} from '@/hooks/queries/useSharedAppQueries'
import { setCart } from '@/stores/cart'
import { setUser as setClientUser } from '@/stores/user'
import { setWebsiteConfig } from '@/stores/websiteConfigSlice'
import { setWishlist } from '@/stores/wishlist'

export function useClientBootstrap() {
  const dispatch = useDispatch()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isLoggedIn = hasClientToken()
  const privateScope = isLoggedIn ? AUTHENTICATED_QUERY_SCOPE : GUEST_QUERY_SCOPE

  const { data: websiteConfig } = useWebsiteConfigQuery()

  useCategoriesQuery({
    enabled: !isAdminRoute
  })

  const { data: clientUser } = useClientMeQuery({
    scope: privateScope,
    enabled: !isAdminRoute && isLoggedIn,
    refetchOnMount: 'always'
  })

  const { data: cartItems } = useClientCartQuery({
    scope: privateScope,
    enabled: !isAdminRoute && isLoggedIn
  })

  const { data: wishlistData } = useClientWishlistQuery({
    scope: privateScope,
    enabled: !isAdminRoute && isLoggedIn
  })

  useEffect(() => {
    if (websiteConfig !== undefined) {
      dispatch(setWebsiteConfig(websiteConfig))
    }
  }, [dispatch, websiteConfig])

  useEffect(() => {
    if (isAdminRoute) return

    if (!isLoggedIn) {
      clearClientSessionState(dispatch)
      return
    }

    if (clientUser === undefined) return
    if (clientUser === null) return

    const token = getClientToken()

    dispatch(
      setClientUser({
        user: clientUser || null,
        token: token || null
      })
    )

    if (token === localStorage.getItem('clientAccessToken')) {
      localStorage.setItem('user', JSON.stringify(clientUser))
    }

    if (token === sessionStorage.getItem('clientAccessToken')) {
      sessionStorage.setItem('user', JSON.stringify(clientUser))
    }
  }, [clientUser, dispatch, isAdminRoute, isLoggedIn])

  useEffect(() => {
    if (isAdminRoute || !isLoggedIn || cartItems === undefined) return
    dispatch(setCart(cartItems))
  }, [cartItems, dispatch, isAdminRoute, isLoggedIn])

  useEffect(() => {
    if (isAdminRoute || !isLoggedIn || wishlistData === undefined) return
    dispatch(setWishlist(normalizeWishlistItems(wishlistData)))
  }, [dispatch, isAdminRoute, isLoggedIn, wishlistData])
}
