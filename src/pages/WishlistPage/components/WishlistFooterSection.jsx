function WishlistFooterSection({ className = '', filteredCount, loadedCount, t, totalItems }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <p className="text-sm font-semibold leading-6 text-slate-500 dark:text-gray-400">
        {t('page.showing', {
          visible: filteredCount,
          loaded: loadedCount,
          total: totalItems
        })}
      </p>
    </section>
  )
}

export default WishlistFooterSection
