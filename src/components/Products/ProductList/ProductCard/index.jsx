import React from 'react'
import { Rate } from 'antd'
import { Heart, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDeliveryDate } from '@/utils/formatDeliveryDate'
import { useProductActions } from '@/hooks/useProductActions'

function ProductCard({ product }) {
  const priceNew = (product.price * (100 - product.discountPercentage)) / 100
  const price = product.price
  const deliveryText = formatDeliveryDate(product.deliveryEstimateDays || 0)
  const actions = useProductActions(product)

  return (
    <Link to={`/products/${product.slug}`} className="block">
      <div className="product-card shadow relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-300 transition-all duration-300 group h-full flex flex-col transform hover:-translate-y-1 dark:border-white/10 dark:bg-[linear-gradient(180deg,#101213_0%,#151719_100%)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.24)] dark:hover:border-white/20 dark:hover:shadow-[0_22px_48px_rgba(0,0,0,0.34)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 dark:from-green-500/10 dark:via-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10 dark:via-white/5" />

        <div className="relative h-[210px] bg-gradient-to-br from-gray-50 to-white p-2.5 dark:from-[#202327] dark:to-[#151719]">
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

          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-40">
            <button
              onClick={actions.handleToggleWishlist}
              disabled={actions.wishlistLoading}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200 ${
                actions.isInWishlist
                  ? 'bg-pink-500 text-white border-pink-500 scale-110'
                  : 'bg-white/95 text-gray-400 border-white/70 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-300 opacity-0 group-hover:opacity-100 dark:bg-[#202327]/90 dark:text-[#a8b0ba] dark:border-white/10 dark:hover:bg-pink-500/10 dark:hover:text-pink-300 dark:hover:border-pink-500/30'
              }`}
              title={actions.isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              {actions.wishlistLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 transition-all duration-150 ${actions.isInWishlist ? 'fill-white scale-110' : ''}`} />
              )}
            </button>

            <button
              onClick={actions.handleToggleCompare}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200 ${
                actions.isInCompare
                  ? 'bg-blue-500 text-white border-blue-500 scale-110'
                  : 'bg-white/95 text-gray-400 border-white/70 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300 opacity-0 group-hover:opacity-100 dark:bg-[#202327]/90 dark:text-[#a8b0ba] dark:border-white/10 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 dark:hover:border-blue-500/30'
              }`}
              title="So sánh sản phẩm"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={actions.handleAddToCart}
            className="absolute bottom-2 right-2 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-xl hover:scale-110 z-30 dark:bg-[#202327]/95 dark:text-[#a8b0ba] dark:border-white/10 dark:hover:bg-green-500 dark:hover:text-[#06110a] dark:hover:border-green-500 dark:hover:shadow-[0_12px_24px_rgba(34,197,94,0.22)]"
            title="Thêm vào giỏ hàng"
            disabled={actions.addCartLoading || product.stock <= 0}
          >
            {actions.addCartLoading ? (
              <svg className="w-4 h-4 animate-spin text-blue-500 hover:text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
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
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 filter group-hover:brightness-110 dark:group-hover:brightness-105"
            loading="lazy"
          />
        </div>

        <div className="p-2.5 flex-1 flex flex-col bg-gradient-to-b from-white via-white to-gray-50/50 dark:from-[#151719] dark:via-[#151719] dark:to-[#101213]">
          <div className="h-[54px]">
            <h3 className="text-[15px] font-medium text-gray-800 leading-[19px] line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors dark:text-[#f4f6f8] dark:group-hover:text-green-300">
              {product.title}
            </h3>

            <div className="leading-none">
              <Rate disabled allowHalf value={product.rate} className="text-xs" style={{ fontSize: '14px' }} />
            </div>
          </div>

          <div className="space-y-0.5 h-[36px]">
            <div className="text-red-500 font-bold text-[17px] leading-5 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              {priceNew.toLocaleString('vi-VN')} <span className="text-sm text-red-500">₫</span>
            </div>

            {product.discountPercentage > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm line-through">{price.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center text-xs text-green-600 bg-gradient-to-r from-green-50/50 to-emerald-50/50 px-2 py-1 rounded-md dark:from-green-500/10 dark:to-emerald-500/10 dark:text-green-300">
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
