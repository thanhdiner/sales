import { Tag } from 'lucide-react'

function PromoCodeBox({ appliedPromo, isLoading, onApplyPromo, onClearPromo, promoCode, setPromoCode, t }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4 text-blue-600" />
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('promo.title')}</h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t('promo.placeholder')}
          value={promoCode}
          onChange={event => setPromoCode(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
        />

        <button
          onClick={() => onApplyPromo()}
          disabled={isLoading || !promoCode}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
        >
          {isLoading ? '...' : t('promo.apply')}
        </button>
      </div>

      {appliedPromo && (
        <div className="mt-3 flex items-start justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/30">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{appliedPromo.code}</p>

            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">{appliedPromo.description}</p>
          </div>

          <button
            onClick={onClearPromo}
            className="text-sm font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  )
}

export default PromoCodeBox
