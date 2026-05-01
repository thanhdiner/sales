import { FILTERS } from '../constants'

const FILTER_COUNT_KEY = {
  all: 'total',
  inStock: 'inStock',
  deal: 'onSale',
  outStock: 'outOfStock'
}

function WishlistFilters({ activeFilter, counts, onChangeFilter, onClearAll, t }) {
  return (
    <section className="mb-5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(filter => {
            const isActive = activeFilter === filter.id
            const count = counts?.[FILTER_COUNT_KEY[filter.id]] ?? 0

            return (
              <button type="button"
                key={filter.id}
                onClick={() => onChangeFilter(filter.id)}
                className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-[13px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0b74e5] text-white shadow-md shadow-blue-500/15'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span>{t(filter.labelKey)}</span>
                <span
                  className={`rounded px-1.5 py-[2px] text-[10px] font-bold leading-none ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <button type="button"
          onClick={onClearAll}
          className="h-9 self-start rounded-md bg-slate-100 px-3.5 text-[13px] font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-[#ff424e] active:scale-95 dark:bg-gray-700 dark:text-gray-300 sm:self-auto"
        >
          {t('page.clearAll')}
        </button>
      </div>
    </section>
  )
}

export default WishlistFilters
