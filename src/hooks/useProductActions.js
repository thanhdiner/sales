import { useState } from 'react'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { syncCartFromServer, syncWishlistState } from '@/lib/clientCache'
import { normalizeWishlistItems } from '@/lib/normalizeWishlistItems'
import { addToCart } from '@/services/cartsService'
import { getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cartLimits'
import { toggleWishlist } from '@/services/wishlistService'
import { toggleCompareLocal } from '../stores/compare'
import { flyToCartAnimation } from '@/utils/animations'
import { getStoredClientAccessToken } from '@/utils/auth'

export function useProductActions(product) {
  const [addCartLoading, setAddCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(state => state.cart.items) || []
  const wishlistItems = useSelector(state => normalizeWishlistItems(state.wishlist.items))
  const compareItems = useSelector(state => state.compare.items) || []

  const productId = product._id || product.id
  const isInWishlist = wishlistItems.some(item => item.productId === productId)
  const isInCompare = compareItems.some(item => item.productId === productId)

  const handleAddToCart = async event => {
    if (event?.preventDefault) event.preventDefault()
    if (event?.stopPropagation) event.stopPropagation()

    if (addCartLoading) return

    const isLoggedIn = Boolean(getStoredClientAccessToken())

    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!')
      navigate('/user/login')
      return
    }

    if (hasReachedCartUniqueItemLimit(cartItems, productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setAddCartLoading(true)

    try {
      const cartItem = cartItems.find(item => item.productId === productId)
      const currentQtyInCart = cartItem ? cartItem.quantity : 0
      const available = Math.max(0, product.stock - currentQtyInCart)

      if (available <= 0) {
        message.warning('Bạn đã thêm hết số lượng sản phẩm này vào giỏ hàng!')
        return
      }

      let payload = {
        productId,
        quantity: 1
      }

      if (product.isFlashSale) {
        payload = {
          ...payload,
          salePrice: product.salePrice,
          discountPercent: product.discountPercent,
          flashSaleId: product.flashSaleId,
          isFlashSale: true
        }
      }

      await addToCart(payload)
      await syncCartFromServer(dispatch)
      flyToCartAnimation(event, product.thumbnail)
      message.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      message.error(err.message || 'Thêm sản phẩm vào giỏ hàng thất bại!')
    } finally {
      setAddCartLoading(false)
    }
  }

  const handleToggleWishlist = async event => {
    event.preventDefault()
    event.stopPropagation()

    const isLoggedIn = Boolean(getStoredClientAccessToken())

    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm vào danh sách yêu thích!')
      navigate('/user/login')
      return
    }

    if (wishlistLoading) return

    const localProduct = {
      productId,
      name: product.title,
      price: product.price * (1 - (product.discountPercentage || 0) / 100),
      originalPrice: product.price,
      discountPercentage: product.discountPercentage || 0,
      image: product.thumbnail,
      slug: product.slug,
      stock: product.stock,
      inStock: product.stock > 0,
      rate: product.rate
    }

    const nextWishlist = isInWishlist
      ? wishlistItems.filter(item => item.productId !== productId)
      : [localProduct, ...wishlistItems]

    syncWishlistState(dispatch, nextWishlist)
    setWishlistLoading(true)

    try {
      await toggleWishlist(productId)
    } catch {
      syncWishlistState(dispatch, wishlistItems)
      message.error('Có lỗi xảy ra, thử lại!')
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleToggleCompare = event => {
    event.preventDefault()
    event.stopPropagation()

    dispatch(
      toggleCompareLocal({
        productId,
        name: product.title,
        price: product.price * (1 - (product.discountPercentage || 0) / 100),
        originalPrice: product.price,
        discountPercentage: product.discountPercentage || 0,
        image: product.thumbnail,
        slug: product.slug,
        rate: product.rate,
        stock: product.stock,
        inStock: product.stock > 0
      })
    )
  }

  return {
    addCartLoading,
    wishlistLoading,
    isInWishlist,
    isInCompare,
    handleAddToCart,
    handleToggleWishlist,
    handleToggleCompare
  }
}
