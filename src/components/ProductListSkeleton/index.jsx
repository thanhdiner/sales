function ProductListSkeleton({ count = 10, className = '' }) {
  const items = Array.from({ length: count })
  return (
    <div className={`w-full ${className}`}>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-3 animate-pulse">
            <div className="aspect-square rounded-xl bg-gray-200" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="mt-3 h-6 bg-gray-200 rounded w-1/2" />
            <div className="mt-3 h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductListSkeleton
