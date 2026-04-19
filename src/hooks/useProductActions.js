import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { setCart } from '../stores/cart'
import { addToWishlistLocal, removeFromWishlistLocal } from '../stores/wishlist'
import { toggleCompareLocal } from '../stores/compare'
import { addToCart, getCart } from '@/services/cartsService'
import { toggleWishlist } from '@/services/wishlistService'

import { flyToCartAnimation } from '@/utils/animations'

export function useProductActions(product) {
  const [addCartLoading, setAddCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  const wishlistItems = useSelector(state => state.wishlist.items)
  const compareItems = useSelector(state => state.compare.items)
  
  const productId = product._id || product.id
  const isInWishlist = wishlistItems.some(i => i.productId === productId)
  const isInCompare = compareItems.some(i => i.productId === productId)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleAddToCart = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (e && e.stopPropagation) e.stopPropagation()
    
    if (addCartLoading) return
    const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken'))
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!')
      navigate('/user/login')
      return
    }

    setAddCartLoading(true)

    try {
      const cart = await getCart()
      const cartItem = cart.items.find(item => item.productId === productId)
      const currentQtyInCart = cartItem ? cartItem.quantity : 0
      const available = Math.max(0, product.stock - currentQtyInCart)

      if (available <= 0) {
        message.warning('Bạn đã thêm hết số lượng sản phẩm này vào giỏ hàng!')
        return
      }

      let body = {
        productId: productId,
        quantity: 1
      }
      if (product.isFlashSale) {
        body = {
          ...body,
          salePrice: product.salePrice,
          discountPercent: product.discountPercent,
          flashSaleId: product.flashSaleId,
          isFlashSale: true
        }
      }
      await addToCart(body)
      const updatedCart = await getCart()
      dispatch(setCart(updatedCart.items))
      
      // Trigger flying animation
      flyToCartAnimation(e, product.thumbnail)
      
      message.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      message.error('Thêm sản phẩm vào giỏ hàng thất bại!')
    } finally {
      setAddCartLoading(false)
    }
  }

  const handleToggleWishlist = async e => {
    e.preventDefault()
    e.stopPropagation()
    const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken'))
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm vào danh sách yêu thích!')
      navigate('/user/login')
      return
    }
    if (wishlistLoading) return

    const wasInWishlist = isInWishlist
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

    if (wasInWishlist) {
      dispatch(removeFromWishlistLocal(productId))
    } else {
      dispatch(addToWishlistLocal(localProduct))
    }

    setWishlistLoading(true)
    try {
      await toggleWishlist(productId)
    } catch {
      if (wasInWishlist) {
        dispatch(addToWishlistLocal(localProduct))
      } else {
        dispatch(removeFromWishlistLocal(productId))
      }
      message.error('Có lỗi xảy ra, thử lại!')
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleToggleCompare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleCompareLocal({
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
    }))
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
