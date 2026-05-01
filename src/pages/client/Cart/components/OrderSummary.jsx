import { ArrowRight } from 'lucide-react'

function OrderSummary({
  discount,
  formatPrice,
  onCheckout,
  selectedCartItems,
  selectedQuantity,
  shipping,
  subtotal,
  t,
  total
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h3 className="mb-4 font-bold text-gray-900 dark:text-gray-100">{t('summary.title')}</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-gray-500 dark:text-gray-400">
          <span>{t('summary.subtotal', { count: selectedQuantity })}</span>

          <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between gap-4 text-emerald-600">
            <span>{t('summary.discount')}</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between gap-4 text-gray-500 dark:text-gray-400">
          <span>{t('summary.shipping')}</span>

          <span className="font-medium text-gray-900 dark:text-gray-100">
            {shipping === 0 ? t('summary.freeShipping') : formatPrice(shipping)}
          </span>
        </div>
      </div>

      <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

      <div className="flex items-end justify-between gap-4">
        <span className="font-bold text-gray-900 dark:text-gray-100">{t('summary.total')}</span>

        <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
      </div>

      <button
        disabled={selectedCartItems.length === 0}
        onClick={onCheckout}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      >
        <span>
          {selectedCartItems.length > 0
            ? t('summary.checkoutWithCount', { count: selectedCartItems.length })
            : t('summary.checkout')}
        </span>

        <ArrowRight className="h-4 w-4" />
      </button>

      {selectedCartItems.length === 0 && (
        <p className="mt-3 text-center text-xs text-gray-400">{t('summary.selectToCheckout')}</p>
      )}
    </div>
  )
}

export default OrderSummary
