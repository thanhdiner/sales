import React from 'react'
import { Heart, BarChart2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ProductActionsOverlay({
  isInWishlist,
  wishlistLoading,
  handleToggleWishlist,
  isInCompare,
  handleToggleCompare,
}) {
  const { t } = useTranslation('clientProducts')
  const wishlistLabel = isInWishlist ? t('productItem.removeWishlist') : t('productItem.addWishlist')

  return (
    <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5 sm:right-3 sm:top-3">
      <button
        onClick={handleToggleWishlist}
        disabled={wishlistLoading}
        className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all duration-200 sm:h-8 sm:w-8
          ${isInWishlist
            ? 'bg-pink-500 text-white scale-110'
            : 'bg-white/85 text-gray-400 opacity-100 hover:text-pink-500 sm:opacity-0 sm:group-hover:opacity-100 dark:bg-[#202327]/85'
          }`}
        title={wishlistLabel}
        aria-label={wishlistLabel}
      >
        {wishlistLoading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Heart className={`h-3.5 w-3.5 transition-transform duration-150 sm:h-4 sm:w-4 ${isInWishlist ? 'fill-white scale-110' : ''}`} />
        )}
      </button>

      <button
        onClick={handleToggleCompare}
        className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all duration-200 sm:h-8 sm:w-8
          ${isInCompare
            ? 'bg-blue-500 text-white scale-110'
            : 'bg-white/85 text-gray-400 opacity-100 hover:text-blue-500 sm:opacity-0 sm:group-hover:opacity-100 dark:bg-[#202327]/85'
          }`}
        title={t('productItem.compare')}
        aria-label={t('productItem.compare')}
      >
        <BarChart2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  )
}
