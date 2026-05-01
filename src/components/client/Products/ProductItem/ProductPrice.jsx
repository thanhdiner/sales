import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatVND } from '@/utils/formatCurrency'

export default function ProductPrice({ priceNew, price, discountVal, savings, deliveryEstimateDays }) {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="mt-auto min-h-[58px] space-y-1.5 pt-1">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[15px] font-bold leading-tight text-red-600 sm:text-lg">
          {priceNew}
          {'\u20ab'}
        </span>

        {discountVal > 0 && (
          <span className="text-[11px] text-slate-400 line-through sm:text-xs">
            {price}
            {'\u20ab'}
          </span>
        )}
      </div>

      <div className="flex min-h-[20px] flex-col justify-end">
        <div>
          {savings > 0 && (
            <span className="mt-0 text-[11px] font-medium leading-4 text-slate-500 sm:text-xs dark:text-slate-400">
              {t('productItem.saving', { amount: formatVND(savings) })}
            </span>
          )}
        </div>

        <div>
          {deliveryEstimateDays > 0 && (
            <p className="text-[11px] font-medium leading-4 text-slate-500 sm:text-xs dark:text-slate-400">
              {t('productItem.deliveryInDays', { count: deliveryEstimateDays })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
