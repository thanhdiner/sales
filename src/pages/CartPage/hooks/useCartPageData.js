import { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { syncCartState } from '@/lib/clientCache'
import { getCart } from '@/services/cartsService'

export function useCartPageData({ language, location, navigate, t }) {
  const dispatch = useDispatch()
  const rawCartItems = useSelector(state => state.cart.items)
  const cartItems = useMemo(() => rawCartItems || [], [rawCartItems])
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [cartLoaded, setCartLoaded] = useState(false)

  useEffect(() => {
    async function fetchCart() {
      try {
        const cart = await getCart()
        const items = syncCartState(dispatch, cart?.items || [])

        const buyNowProductId = location.state?.buyNowProductId
        if (buyNowProductId) {
          setSelectedItems(new Set([buyNowProductId]))
          navigate(location.pathname, { replace: true, state: {} })
        } else {
          const availableIds = items.filter(item => item.inStock).map(item => item.productId)

          setSelectedItems(prev => {
            const preservedIds = [...prev].filter(id => availableIds.includes(id))
            return new Set(preservedIds.length > 0 ? preservedIds : availableIds)
          })
        }
      } catch (err) {
        message.error(t('message.fetchCartFailed'))
      } finally {
        setCartLoaded(true)
      }
    }

    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  useEffect(() => {
    setSelectedItems(prev => {
      const newIds = cartItems.filter(item => item.inStock).map(item => item.productId)

      if (!prev.size || [...prev].filter(id => newIds.includes(id)).length === 0) {
        return new Set(newIds)
      }

      return new Set([...prev].filter(id => newIds.includes(id)))
    })
  }, [cartItems])

  return {
    cartItems,
    cartLoaded,
    dispatch,
    selectedItems,
    setSelectedItems
  }
}
