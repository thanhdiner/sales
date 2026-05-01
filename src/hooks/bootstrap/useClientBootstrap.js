import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearClientSessionState, getClientToken, hasClientToken } from '@/lib/client/clientCache'
import { normalizeWishlistItems } from '@/lib/wishlist/normalizeWishlistItems'
import { AUTHENTICATED_QUERY_SCOPE, GUEST_QUERY_SCOPE } from '@/lib/query/queryKeys/index.js'
import {
  useCategoriesQuery,
  useClientCartQuery,
  useClientMeQuery,
  useClientWishlistQuery,
  useWebsiteConfigQuery
} from '@/hooks/queries/useSharedAppQueries'
import { setCart } from '@/stores/client/cart'
import { setUser as setClientUser } from '@/stores/client/user'
import { setWebsiteConfig } from '@/stores/app/websiteConfigSlice'
import { setWishlist } from '@/stores/client/wishlist'

export function useClientBootstrap() {
  const dispatch = useDispatch()
  const isLoggedIn = hasClientToken()
  const privateScope = isLoggedIn ? AUTHENTICATED_QUERY_SCOPE : GUEST_QUERY_SCOPE

  const { data: websiteConfig } = useWebsiteConfigQuery()

  useCategoriesQuery()

  const { data: clientUser } = useClientMeQuery({
    scope: privateScope,
    enabled: isLoggedIn,
    refetchOnMount: 'always'
  })

  const { data: cartItems } = useClientCartQuery({
    scope: privateScope,
    enabled: isLoggedIn
  })

  const { data: wishlistData } = useClientWishlistQuery({
    scope: privateScope,
    enabled: isLoggedIn
  })

  useEffect(() => {
    if (websiteConfig !== undefined) {
      dispatch(setWebsiteConfig(websiteConfig))
    }
  }, [dispatch, websiteConfig])

  useEffect(() => {
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
  }, [clientUser, dispatch, isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || cartItems === undefined) return
    dispatch(setCart(cartItems))
  }, [cartItems, dispatch, isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || wishlistData === undefined) return
    dispatch(setWishlist(normalizeWishlistItems(wishlistData)))
  }, [dispatch, isLoggedIn, wishlistData])
}
