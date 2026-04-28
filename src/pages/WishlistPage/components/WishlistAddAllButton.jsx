import { ShoppingCart } from 'lucide-react'

function WishlistAddAllButton({ className = '', disabled, loading, onClick, t }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#0b74e5] px-4 text-[13px] font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:bg-[#0969d8] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white dark:disabled:bg-gray-700 ${className}`}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <ShoppingCart className="h-3.5 w-3.5" />
      )}
      {t('page.addAllToCart')}
    </button>
  )
}

export default WishlistAddAllButton
