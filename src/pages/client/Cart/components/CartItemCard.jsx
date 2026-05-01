import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCartItemSavings } from '../utils/cartUtils'

function CartItemCard({
  editingQty,
  formatPrice,
  isSelected,
  item,
  onQtyBlur,
  onQtyChange,
  onQuantityStep,
  onRemove,
  onSelect,
  t
}) {
  const savingPercent = getCartItemSavings(item.originalPrice, item.price)
  const productPath = item.slug ? `/products/${item.slug}` : null

  return (
    <div
      className={`rounded-lg border bg-white p-4 shadow-sm transition dark:bg-gray-950 ${
        isSelected ? 'border-blue-300 dark:border-blue-900' : 'border-gray-200 dark:border-gray-800'
      } ${!item.inStock ? 'opacity-70' : ''}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="pt-8 sm:pt-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(item.productId)}
            disabled={!item.inStock}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        {productPath ? (
          <Link
            to={productPath}
            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition hover:border-blue-400 sm:h-28 sm:w-28 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
            aria-label={item.name}
          >
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />

            {savingPercent > 0 && (
              <div className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                -{savingPercent}%
              </div>
            )}
          </Link>
        ) : (
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:h-28 sm:w-28 dark:border-gray-800 dark:bg-gray-900">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />

            {savingPercent > 0 && (
              <div className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                -{savingPercent}%
              </div>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              {item.category && <p className="mb-1 text-xs font-medium text-gray-400">{item.category}</p>}

              {productPath ? (
                <Link
                  to={productPath}
                  className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 transition hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 sm:text-base"
                >
                  {item.name}
                </Link>
              ) : (
                <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 dark:text-gray-100 sm:text-base">
                  {item.name}
                </h3>
              )}

              <div className="mt-2">
                {item.inStock ? (
                  <span className="text-xs font-medium text-emerald-600">{t('item.inStock')}</span>
                ) : (
                  <span className="text-xs font-medium text-red-500">{t('item.outOfStock')}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onRemove(item.productId)}
              className="h-9 w-9 flex-shrink-0 rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
              title={t('item.removeTitle')}
              aria-label={t('item.removeTitle')}
            >
              <Trash2 className="mx-auto h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-lg font-bold text-blue-600">{formatPrice(item.price)}</span>

                {item.originalPrice > item.price && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
                <button
                  onClick={() => onQuantityStep(item.productId, item.quantity - 1)}
                  className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <input
                  type="number"
                  min={1}
                  className="qtyInput h-9 w-11 border-x border-gray-200 bg-transparent text-center text-sm font-semibold text-gray-900 outline-none dark:border-gray-700 dark:text-gray-100"
                  value={editingQty[item.productId] !== undefined ? editingQty[item.productId] : item.quantity}
                  onChange={event => onQtyChange(item.productId, event.target.value)}
                  onBlur={() => onQtyBlur(item.productId, item)}
                  onKeyDown={event => {
                    if (event.key === 'Enter') event.target.blur()
                  }}
                />

                <button
                  onClick={() => onQuantityStep(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= (item.stock || 1)}
                  className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-300 dark:hover:bg-gray-900 dark:disabled:text-gray-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="hidden min-w-[110px] text-right sm:block">
                <p className="text-xs text-gray-400">{t('item.lineTotal')}</p>
                <p className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>

            <div className="sm:hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {t('item.lineTotalMobile', {
                  amount: formatPrice(item.price * item.quantity)
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItemCard
