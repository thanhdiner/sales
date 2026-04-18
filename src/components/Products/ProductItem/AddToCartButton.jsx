import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function AddToCartButton({ loading, outOfStock, onClick }) {
  return (
    <div className="px-3 pb-3 pt-0">
      <button
        onClick={onClick}
        disabled={loading || outOfStock}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
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
