import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function AddToCartButton({ loading, outOfStock, onClick }) {
  return (
    <div className="px-4 pb-4 pt-0">
      <button
        onClick={onClick}
        disabled={loading || outOfStock}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_16px_28px_rgba(37,99,235,0.3)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:bg-green-500 dark:text-[#06110a] dark:shadow-[0_12px_24px_rgba(34,197,94,0.18)] dark:hover:bg-green-400 dark:hover:shadow-[0_16px_28px_rgba(34,197,94,0.24)] dark:disabled:bg-[#202327] dark:disabled:text-[#707983]"
      >
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
            <span>Đang thêm...</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCartPlus} className="w-4 h-4" />
            {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          </>
        )}
      </button>
    </div>
  )
}
