export default function FlashSaleSkeleton() {
  const skeletonCards = Array(5).fill(0)

  return (
    <>
      <div className="home__flash-sale__countdown">
        <span>Kết thúc sau:</span>
        <span className="countdown-timer skeleton-timer"></span>
      </div>
      <div className="product-slider-flash-sale-skeleton">
        {skeletonCards.map((_, idx) => (
          <div className="product mt-1 flex h-full flex-col" style={{ width: 'calc(20% - 10px)' }} key={idx}>
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-[16px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] shadow-[0_16px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#101213_0%,#151719_100%)] animate-pulse">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-50/80 to-transparent opacity-80 dark:from-green-500/10" />

              <div className="relative aspect-square overflow-hidden rounded-b-[16px] p-3">
                <div className="h-full w-full rounded-[12px] border border-white/80 bg-gray-200/80 dark:border-transparent dark:bg-[#202327]" />
              </div>

              <div className="space-y-3 px-4 pb-4 pt-3">
                <div className="h-5 w-full rounded bg-gray-200 dark:bg-[#202327]" />
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-[#202327]" />

                <div className="flex gap-2">
                  <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-[#202327]" />
                  <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-[#202327]" />
                </div>

                <div className="h-7 w-1/2 rounded bg-gray-200 dark:bg-[#202327]" />
                <div className="h-5 w-2/5 rounded bg-gray-200 dark:bg-[#202327]" />
              </div>

              <div className="px-4 pb-4 pt-0">
                <div className="h-[46px] w-full rounded-[12px] bg-gray-200 dark:bg-green-500/25" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
