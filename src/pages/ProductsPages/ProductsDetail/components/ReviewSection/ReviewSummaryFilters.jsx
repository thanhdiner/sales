import { Star, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StarDisplay } from './ReviewShared'

export const ReviewSectionHeader = ({ summary }) => {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 dark:border-gray-700 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">{t('productDetail.reviewSummary.title')}</h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('productDetail.reviewSummary.description')}</p>
      </div>

      {summary.totalCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <StarDisplay value={summary.avgRating} size={15} />
          <span>{summary.avgRating.toFixed(1)} / 5</span>
        </div>
      )}
    </div>
  )
}

export const RatingSummary = ({ summary, activeFilter, onFilter }) => {
  const { t } = useTranslation('clientProducts')
  const { avgRating, totalCount, ratingDist } = summary

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="md:w-44">
          <div className="flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
            <span className="pb-1 text-sm text-gray-500 dark:text-gray-400">/ 5</span>
          </div>

          <div className="mt-2">
            <StarDisplay value={avgRating} size={18} />
          </div>

          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('productDetail.reviewSummary.reviewCount', { count: totalCount })}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingDist[star] || 0
            const percent = totalCount ? (count / totalCount) * 100 : 0
            const isActive = activeFilter === String(star)

            return (
              <button
                key={star}
                type="button"
                onClick={() => onFilter(isActive ? '' : String(star))}
                aria-label={t('productDetail.reviewSummary.starFilter', { count: star })}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex min-w-[46px] items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  <span>{star}</span>
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                </div>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isActive ? 'bg-gray-900 dark:bg-white' : 'bg-yellow-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="min-w-[32px] text-right text-xs text-gray-500 dark:text-gray-400">{count}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const ReviewSortFilters = ({ sortOptions, sort, onSortChange, ratingFilter, onClearRatingFilter }) => {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="flex flex-wrap items-center gap-2">
      {sortOptions.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSortChange(option.value)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            sort === option.value
              ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white'
          }`}
        >
          {option.labelKey ? t(option.labelKey) : option.label}
        </button>
      ))}

      {ratingFilter && (
        <button
          type="button"
          onClick={onClearRatingFilter}
          className="inline-flex items-center gap-1.5 rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300"
        >
          <Star size={13} className="fill-yellow-500 text-yellow-500" />
          {t('productDetail.reviewSummary.starFilter', { count: ratingFilter })}
          <X size={13} />
        </button>
      )}
    </div>
  )
}
