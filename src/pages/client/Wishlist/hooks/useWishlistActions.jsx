import { useCallback, useState } from 'react'
import { message, Modal } from 'antd'
import { MAX_CART_UNIQUE_ITEMS, getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cart/cartLimits'
import { syncCartFromServer } from '@/lib/client/clientCache'
import { addToCart } from '@/services/client/commerce/cart'
import { clearWishlist, removeFromWishlist } from '@/services/client/commerce/wishlist'
import { clearWishlistLocal, removeFromWishlistLocal } from '@/stores/client/wishlist'
import { clearWishlistCache, isWishlistItemInStock, removeWishlistItemFromCache } from '../utils/wishlistUtils'

export function useWishlistActions({ cartItems, dispatch, filteredWishlist, queryClient, queryScope, resetVisiblePageCount, t }) {
  const [addingToCart, setAddingToCart] = useState({})
  const [addingAllToCart, setAddingAllToCart] = useState(false)

  const handleRemove = useCallback(
    productId => {
      Modal.confirm({
        title: <span className="text-gray-800 dark:text-gray-100">{t('modal.removeTitle')}</span>,
        okText: t('modal.okRemove'),
        cancelText: t('modal.cancel'),
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await removeFromWishlist(productId)
            removeWishlistItemFromCache(queryClient, queryScope, productId)
            dispatch(removeFromWishlistLocal(productId))
            message.success(t('message.removeSuccess'))
          } catch {
            message.error(t('message.removeFailed'))
          }
        }
      })
    },
    [dispatch, queryClient, queryScope, t]
  )

  const handleClearAll = useCallback(() => {
    Modal.confirm({
      title: <span className="text-gray-800 dark:text-gray-100">{t('modal.clearTitle')}</span>,
      content: t('modal.clearContent'),
      okText: t('modal.okClear'),
      cancelText: t('modal.cancel'),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await clearWishlist()
          clearWishlistCache(queryClient, queryScope)
          dispatch(clearWishlistLocal())
          resetVisiblePageCount()
          message.success(t('message.clearSuccess'))
        } catch {
          message.error(t('message.genericError'))
        }
      }
    })
  }, [dispatch, queryClient, queryScope, resetVisiblePageCount, t])

  const handleAddToCart = useCallback(
    async item => {
      if (!isWishlistItemInStock(item)) {
        message.warning(t('message.outOfStock'))
        return
      }

      if (hasReachedCartUniqueItemLimit(cartItems, item.productId)) {
        message.warning(getCartUniqueItemLimitMessage())
        return
      }

      setAddingToCart(prev => ({ ...prev, [item.productId]: true }))

      try {
        await addToCart({ productId: item.productId, quantity: 1 })
        await syncCartFromServer(dispatch)
        message.success(t('message.addToCartSuccess'))
      } catch (err) {
        message.error(err.message || t('message.addToCartFailed'))
      } finally {
        setAddingToCart(prev => ({ ...prev, [item.productId]: false }))
      }
    },
    [cartItems, dispatch, t]
  )

  const handleAddAllToCart = useCallback(async () => {
    if (addingAllToCart) return

    const inStockItems = filteredWishlist.filter(isWishlistItemInStock)

    if (inStockItems.length === 0) {
      message.warning(t('message.noInStockItems'))
      return
    }

    const nextCartProductIds = new Set(cartItems.map(item => item.productId))
    const itemsToAdd = []
    let skippedDueToLimit = 0

    for (const item of inStockItems) {
      if (nextCartProductIds.has(item.productId)) {
        itemsToAdd.push(item)
        continue
      }

      if (nextCartProductIds.size < MAX_CART_UNIQUE_ITEMS) {
        nextCartProductIds.add(item.productId)
        itemsToAdd.push(item)
      } else {
        skippedDueToLimit += 1
      }
    }

    if (itemsToAdd.length === 0) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setAddingAllToCart(true)

    try {
      for (const item of itemsToAdd) {
        await addToCart({ productId: item.productId, quantity: 1 })
      }

      await syncCartFromServer(dispatch)

      if (skippedDueToLimit > 0) {
        message.warning(
          t('message.addAllPartial', {
            added: itemsToAdd.length,
            skipped: skippedDueToLimit,
            limit: MAX_CART_UNIQUE_ITEMS
          })
        )
        return
      }

      message.success(t('message.addAllSuccess', { count: itemsToAdd.length }))
    } catch (err) {
      message.error(err.message || t('message.addAllFailed'))
    } finally {
      setAddingAllToCart(false)
    }
  }, [addingAllToCart, cartItems, dispatch, filteredWishlist, t])

  return {
    addingAllToCart,
    addingToCart,
    handleAddAllToCart,
    handleAddToCart,
    handleClearAll,
    handleRemove
  }
}
