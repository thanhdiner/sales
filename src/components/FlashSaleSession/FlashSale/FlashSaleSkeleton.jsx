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
          <div className="product flex flex-col" style={{ width: 'calc(20% - 10px)' }} key={idx}>
            <div className="rounded-2xl border border-gray-200 bg-white p-3 animate-pulse flex-1 flex flex-col h-[380px] dark:bg-gray-800 dark:border-gray-700">
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 w-full" />
              <div className="mt-3 space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
              <div className="mt-auto pt-4 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
