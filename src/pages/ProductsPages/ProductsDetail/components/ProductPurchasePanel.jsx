import { Minus, Plus, ShoppingCart, Zap } from 'lucide-react'

function LoadingIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function ProductPurchasePanel({
  quantity,
  maxAvailable,
  addCartLoading,
  buyNowLoading,
  onQuantityChange,
  onQuantityBlur,
  onDecrease,
  onIncrease,
  onAddToCart,
  onBuyNow
}) {
  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Số lượng
          </span>

          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
              disabled={+quantity <= 1 || maxAvailable <= 0}
            >
              <Minus className="h-4 w-4" />
            </button>

            <input
              type="number"
              className="qtyInput h-9 w-12 border-0 bg-white text-center text-sm text-gray-900 outline-none dark:bg-gray-900 dark:text-gray-100"
              value={quantity}
              onChange={onQuantityChange}
              onBlur={onQuantityBlur}
              min={1}
              max={maxAvailable}
              disabled={maxAvailable <= 0}
            />

            <button
              type="button"
              onClick={onIncrease}
              className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
              disabled={maxAvailable <= 0 || +quantity >= maxAvailable}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {maxAvailable !== null && maxAvailable <= 0 && (
            <span className="text-sm text-red-500">
              Bạn đã thêm hết số lượng còn lại vào giỏ
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          onClick={onBuyNow}
          disabled={buyNowLoading || maxAvailable <= 0}
        >
          {buyNowLoading ? (
            <LoadingIcon className="h-4 w-4 animate-spin text-white dark:text-gray-900" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          <span>Mua ngay</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          onClick={onAddToCart}
          disabled={addCartLoading || maxAvailable <= 0}
        >
          {addCartLoading ? (
            <LoadingIcon className="h-4 w-4 animate-spin text-gray-900 dark:text-gray-100" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </>
  )
}

export default ProductPurchasePanel