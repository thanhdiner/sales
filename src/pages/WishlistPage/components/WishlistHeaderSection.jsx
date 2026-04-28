import WishlistAddAllButton from './WishlistAddAllButton'

function WishlistHeaderSection({ addingAllToCart, canAddAll, inStockCount, onAddAllToCart, t, totalItems }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-gray-100 sm:text-3xl">
            {t('page.title')}
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-gray-400">
            {t('page.loadedTotal', { total: totalItems })} &bull; {t('page.inStockCount', { count: inStockCount })}
          </p>
        </div>

        <WishlistAddAllButton
          className="w-full sm:w-auto sm:min-w-[148px]"
          disabled={!canAddAll}
          loading={addingAllToCart}
          onClick={onAddAllToCart}
          t={t}
        />
      </div>
    </section>
  )
}

export default WishlistHeaderSection
