import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

export default function AddToCartButton({ loading, outOfStock, onClick }) {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="mt-auto px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
      <button
        onClick={onClick}
        disabled={loading || outOfStock}
        className="relative flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-4 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:drop-shadow-[0_10px_18px_rgba(37,99,235,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-65 sm:h-11"
        aria-label={outOfStock ? t('productItem.outOfStock') : t('productItem.addToCart')}
      >
        <span className="relative z-10 inline-flex items-center gap-2 font-semibold text-white">
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <FontAwesomeIcon icon={faCartShopping} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
          {loading ? t('productItem.addingToCart') : outOfStock ? t('productItem.outOfStock') : t('productItem.addToCart')}
        </span>
      </button>
    </div>
  )
}
