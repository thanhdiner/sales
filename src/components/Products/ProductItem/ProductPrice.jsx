import React from 'react'
import { formatVND } from '../../../helpers/formatCurrency'

export default function ProductPrice({ priceNew, price, discountVal, savings, deliveryEstimateDays }) {
  return (
    <div className="space-y-1 mt-auto">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-red-600">{priceNew}₫</span>
        {discountVal > 0 && <span className="text-sm text-gray-400 line-through">{price}₫</span>}
      </div>
      <div className="min-h-[20px] flex flex-col justify-end">
        <div>
          {savings > 0 && <span className="mt-0 text-green-600 font-medium text-xs">Tiết kiệm {formatVND(savings)}₫</span>}
        </div>
        <div>
          {deliveryEstimateDays > 0 && (
            <p className="text-xs text-green-600 font-medium">🚚 Giao hàng trong {deliveryEstimateDays} ngày</p>
          )}
        </div>
      </div>
    </div>
  )
}
