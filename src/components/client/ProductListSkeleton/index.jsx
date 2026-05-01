function ProductListSkeleton({ count = 10, className = '' }) {
  const items = Array.from({ length: count })
  return (
    <div className={`w-full ${className}`}>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-3 animate-pulse dark:border-white/10 dark:bg-[linear-gradient(180deg,#101213_0%,#151719_100%)]">
            <div className="aspect-square rounded-xl bg-gray-200 dark:bg-[#202327]" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-[#202327]" />
              <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-[#202327]" />
            </div>
            <div className="mt-3 h-6 bg-gray-200 rounded w-1/2 dark:bg-[#202327]" />
            <div className="mt-3 h-8 bg-gray-200 rounded dark:bg-green-500/25" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductListSkeleton
