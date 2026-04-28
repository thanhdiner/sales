import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

export default function AddToCartButton({ loading, outOfStock, onClick }) {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="mt-auto px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
      <button
        onClick={onClick}
        disabled={loading || outOfStock}
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] bg-blue-600 px-2.5 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_22px_rgba(37,99,235,0.24)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:h-11 sm:gap-2 sm:rounded-[12px] sm:px-4 sm:text-sm dark:bg-green-500 dark:text-[#06110a] dark:shadow-[0_8px_18px_rgba(34,197,94,0.16)] dark:hover:bg-green-400 dark:hover:shadow-[0_12px_22px_rgba(34,197,94,0.2)] dark:disabled:bg-[#202327] dark:disabled:text-[#707983]"
      >
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{t('productItem.addingToCart')}</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCartPlus} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {outOfStock ? t('productItem.outOfStock') : t('productItem.addToCart')}
          </>
        )}
      </button>
    </div>
  )
}
