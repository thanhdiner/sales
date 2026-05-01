import { useState } from 'react'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cart/cartLimits'
import { normalizeWishlistItems } from '@/lib/wishlist/normalizeWishlistItems'
import { syncCartFromServer } from '@/lib/client/clientCache'
import { addToCart } from '@/services/client/commerce/cart'
import { toggleWishlist } from '@/services/client/commerce/wishlist'
import { toggleCompareLocal } from '@/stores/client/compare'
import { addToWishlistLocal, removeFromWishlistLocal } from '@/stores/client/wishlist'
import { getStoredClientAccessToken } from '@/utils/auth'

function createWishlistItem(product, salePrice) {
  return {
    productId: product._id || product.id,
    title: product.title,
    name: product.title,
    translations: product.translations || {},
    price: salePrice,
    originalPrice: product.price,
    discountPercentage: 0,
    image: product.thumbnail,
    slug: product.slug,
    stock: product.stock,
    inStock: product.stock > 0,
    rate: product.rate
  }
}

export function useFlashSaleProductActions({ t }) {
  const [buyNowLoading, setBuyNowLoading] = useState({})
  const [wishlistLoading, setWishlistLoading] = useState({})
  const cartItems = useSelector(state => state.cart.items) || []
  const compareItems = useSelector(state => state.compare.items)
  const wishlistItems = useSelector(state => normalizeWishlistItems(state.wishlist.items))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleFlashSaleBuyNow = async (product, sale) => {
    const productId = product._id || product.id

    if (buyNowLoading[productId]) return

    const isLoggedIn = Boolean(getStoredClientAccessToken())

    if (!isLoggedIn) {
      message.info(t('message.loginToBuy'))
      navigate('/user/login')
      return
    }

    if (hasReachedCartUniqueItemLimit(cartItems, productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setBuyNowLoading(prev => ({ ...prev, [productId]: true }))

    try {
      await addToCart({
        productId,
        quantity: 1,
        flashSaleId: sale?._id,
        salePrice: Math.round(product.price * (1 - sale.discountPercent / 100)),
        isFlashSale: true
      })

      await syncCartFromServer(dispatch)

      message.success(t('message.addedToCart'))

      navigate('/cart', {
        state: {
          buyNowProductId: productId
        }
      })
    } catch (err) {
      message.error(err.message || t('message.buyNowFailed'))
    } finally {
      setBuyNowLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleToggleWishlist = async (event, product, salePrice) => {
    event.preventDefault()
    event.stopPropagation()

    const isLoggedIn = Boolean(getStoredClientAccessToken())

    if (!isLoggedIn) {
      message.info(t('message.loginToWishlist'))
      navigate('/user/login')
      return
    }

    const productId = product._id || product.id

    if (wishlistLoading[productId]) return

    const isInWishlist = wishlistItems.some(item => item.productId === productId)
    const wishlistItem = createWishlistItem(product, salePrice)

    if (isInWishlist) {
      dispatch(removeFromWishlistLocal(productId))
    } else {
      dispatch(addToWishlistLocal(wishlistItem))
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }))

    try {
      await toggleWishlist(productId)
    } catch {
      if (isInWishlist) {
        dispatch(addToWishlistLocal(wishlistItem))
      } else {
        dispatch(removeFromWishlistLocal(productId))
      }

      message.error(t('message.wishlistError'))
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleToggleCompare = (event, product, sale, salePrice) => {
    event.preventDefault()
    event.stopPropagation()

    dispatch(
      toggleCompareLocal({
        productId: product._id || product.id,
        name: product.title,
        price: salePrice,
        originalPrice: product.price,
        discountPercentage: sale.discountPercent || 0,
        image: product.thumbnail,
        slug: product.slug,
        rate: product.rate,
        stock: product.stock,
        inStock: product.stock > 0
      })
    )
  }

  return {
    buyNowLoading,
    compareItems,
    handleFlashSaleBuyNow,
    handleToggleCompare,
    handleToggleWishlist,
    wishlistItems,
    wishlistLoading
  }
}
