import React from 'react'
import { Heart, BarChart2 } from 'lucide-react'

export default function ProductActionsOverlay({
  isInWishlist,
  wishlistLoading,
  handleToggleWishlist,
  isInCompare,
  handleToggleCompare,
}) {
  return (
    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-20">
      <button
        onClick={handleToggleWishlist}
        disabled={wishlistLoading}
        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200
          ${isInWishlist
            ? 'bg-pink-500 text-white scale-110'
            : 'bg-white/90 dark:bg-[#202327]/90 text-gray-400 hover:text-pink-500 opacity-0 group-hover:opacity-100'
          }`}
        title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        {wishlistLoading ? (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 transition-transform duration-150 ${isInWishlist ? 'fill-white scale-110' : ''}`} />
        )}
      </button>

      <button
        onClick={handleToggleCompare}
        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200
          ${isInCompare
            ? 'bg-blue-500 text-white scale-110'
            : 'bg-white/90 dark:bg-[#202327]/90 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100'
          }`}
        title="So sánh sản phẩm"
      >
        <BarChart2 className="w-4 h-4" />
      </button>
    </div>
  )
}
