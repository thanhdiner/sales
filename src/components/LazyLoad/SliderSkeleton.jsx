import React from 'react'
import './SliderSkeleton.scss'

export default function SliderSkeleton() {
  const skeletonCards = Array(5).fill(0)

  return (
    <div className="product-slider-flash-sale-skeleton">
      {skeletonCards.map((_, idx) => (
        <div key={idx} className="flash-sale-skeleton-item product mt-1 flex h-full flex-col">
          <div className="relative flex flex-1 animate-pulse flex-col overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:rounded-[20px] dark:border-white/10 dark:bg-[#111315]">
            <div className="relative h-[156px] overflow-hidden border-b border-slate-100 bg-slate-50 p-2 sm:h-[190px] sm:p-3 xl:h-[200px] dark:border-white/10 dark:bg-[#17191c]">
              <div className="h-full w-full rounded-[14px] bg-gray-200/80 dark:bg-[#202327]" />
            </div>

            <div className="space-y-3 px-3 pb-4 pt-3 sm:px-4">
              <div className="h-5 w-full rounded bg-gray-200 dark:bg-[#202327]" />
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-[#202327]" />

              <div className="flex gap-2">
                <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-[#202327]" />
                <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-[#202327]" />
              </div>

              <div className="h-7 w-1/2 rounded bg-gray-200 dark:bg-[#202327]" />
              <div className="h-5 w-2/5 rounded bg-gray-200 dark:bg-[#202327]" />
            </div>

            <div className="mt-auto px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
              <div className="h-9 w-full rounded-[10px] bg-gray-200 sm:h-11 sm:rounded-[12px] dark:bg-green-500/25" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
