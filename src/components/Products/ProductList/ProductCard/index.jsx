import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Rate } from 'antd'
import { formatDeliveryDate } from '@/utils/formatDeliveryDate'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import { addToCart, getCart } from '@/services/cartsService'
import { setCart } from '@/stores/cart'

function ProductCard(props) {
  const { product } = props
  const [addCartLoading, setAddCartLoading] = useState(false)

  const priceNew = (product.price * (100 - product.discountPercentage)) / 100
  const price = product.price
  const deliveryText = formatDeliveryDate(product.deliveryEstimateDays || 0)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddToCart = async e => {
    e.preventDefault()
    e.stopPropagation()

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
      const cartItem = cart.items.find(item => item.productId === (product._id || product.id))
      const currentQtyInCart = cartItem ? cartItem.quantity : 0
      const available = Math.max(0, product.stock - currentQtyInCart)

      if (available <= 0) {
        message.warning('Bạn đã thêm hết số lượng sản phẩm này vào giỏ hàng!')
        return
      }

      await addToCart({ productId: product._id || product.id, quantity: 1 })
      const updatedCart = await getCart()
      dispatch(setCart(updatedCart.items))
      message.success(`Đã thêm sản phẩm ${product.title} vào giỏ hàng!`)
    } catch (err) {
      message.error('Thêm sản phẩm vào giỏ hàng thất bại!')
    } finally {
      setAddCartLoading(false)
    }
  }

  return (
    <Link to={`/products/${product.slug}`} className="block">
      <div className="shadow relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-300 transition-all duration-300 group h-full flex flex-col transform hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10"></div>

        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white p-3">
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-30">
            {product.isTopDeal && (
              <span className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-[11px] font-bold px-2 py-[2px] rounded shadow badge-topdeal uppercase tracking-wide">
                Top Deal
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[11px] font-bold px-2 py-[2px] rounded shadow badge-featured uppercase tracking-wide">
                Nổi bật
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-lg">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="absolute top-2 right-2 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-xl hover:scale-110 z-30"
            title="Thêm vào giỏ hàng"
            disabled={addCartLoading || product.stock <= 0}
          >
            {addCartLoading ? (
              <svg className="w-4 h-4 animate-spin text-blue-500 hover:text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10"
                />
              </svg>
            )}
          </button>

          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 filter group-hover:brightness-110"
            loading="lazy"
          />
        </div>

        <div className="p-3 flex-1 flex flex-col bg-gradient-to-b from-white via-white to-gray-50/50">
          <div className="h-16">
            <h3 className="text-[16px] font-medium text-gray-800 leading-5 line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>

            <div>
              <Rate disabled allowHalf value={product.rate} className="text-xs" style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div className="space-y-1 h-[40px]">
            <div className="text-red-500 font-bold text-lg bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              {priceNew.toLocaleString('vi-VN')} <span className="text-sm text-red-500">₫</span>
            </div>

            {product.discountPercentage > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm line-through">{price.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center text-xs text-green-600 bg-gradient-to-r from-green-50/50 to-emerald-50/50 px-2 py-1 rounded-md">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {deliveryText}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
