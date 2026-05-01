import WishlistProductRow from '../components/WishlistProductRow'

function WishlistTable({
  addingToCart,
  filteredWishlist,
  formatPrice,
  language,
  loadedCount,
  onAddToCart,
  onRemove,
  t,
  totalItems
}) {
  return (
    <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:block">
      <div className="grid grid-cols-[minmax(0,1fr)_160px_140px_170px] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
        <span>{t('table.productName')}</span>
        <span>{t('table.unitPrice')}</span>
        <span>{t('table.stockStatus')}</span>
        <span className="text-right">{t('table.action')}</span>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-gray-700">
        {filteredWishlist.map(item => (
          <WishlistProductRow
            key={item.productId}
            addingToCart={addingToCart[item.productId]}
            formatPrice={formatPrice}
            item={item}
            language={language}
            onAddToCart={onAddToCart}
            onRemove={onRemove}
            t={t}
          />
        ))}
      </div>

      <div className="border-t border-slate-200 bg-white px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">
          {t('page.showing', {
            visible: filteredWishlist.length,
            loaded: loadedCount,
            total: totalItems
          })}
        </p>
      </div>
    </section>
  )
}

export default WishlistTable
