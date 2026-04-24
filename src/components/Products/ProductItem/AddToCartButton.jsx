import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function AddToCartButton({ loading, outOfStock, onClick }) {
  return (
    <div className="px-4 pb-4 pt-0">
      <button
        onClick={onClick}
        disabled={loading || outOfStock}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(37,99,235,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-[linear-gradient(135deg,#94a3b8_0%,#64748b_100%)] disabled:shadow-none dark:bg-[linear-gradient(135deg,#e2e8f0_0%,#93c5fd_100%)] dark:text-slate-950 dark:shadow-[0_16px_30px_rgba(59,130,246,0.12)] dark:disabled:bg-[linear-gradient(135deg,#475569_0%,#334155_100%)] dark:disabled:text-white"
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
