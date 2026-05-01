import { Trash2 } from 'lucide-react'
import { OUTLINE_BUTTON } from '../constants'
import { isWishlistItemInStock } from '../utils/wishlistUtils'

function WishlistActionsCell({ addingToCart, item, onAddToCart, onRemove, t, variant = 'desktop' }) {
  const inStock = isWishlistItemInStock(item)
  const isMobile = variant === 'mobile'

  if (isMobile) {
    return (
      <div className="mt-4 grid gap-2">
        <button type="button"
          onClick={() => onAddToCart(item)}
          disabled={addingToCart || !inStock}
          className={`h-10 w-full px-4 text-sm ${OUTLINE_BUTTON}`}
        >
          {addingToCart ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0b74e5] border-t-transparent" />
          ) : (
            t('item.addToCart')
          )}
        </button>

        <button type="button"
          onClick={() => onRemove(item.productId)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-red-100 hover:bg-red-50 hover:text-[#ff424e] active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/20"
          title={t('item.removeTitle')}
          aria-label={t('item.removeTitle')}
        >
          <Trash2 className="h-4 w-4" />
          {t('modal.okRemove')}
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button type="button"
        onClick={() => onAddToCart(item)}
        disabled={addingToCart || !inStock}
        className={`h-9 min-w-[112px] px-4 text-xs ${OUTLINE_BUTTON}`}
      >
        {addingToCart ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0b74e5] border-t-transparent" />
        ) : (
          t('item.addToCart')
        )}
      </button>

      <button type="button"
        onClick={() => onRemove(item.productId)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-[#ff424e] dark:hover:bg-red-900/20"
        title={t('item.removeTitle')}
        aria-label={t('item.removeTitle')}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default WishlistActionsCell
