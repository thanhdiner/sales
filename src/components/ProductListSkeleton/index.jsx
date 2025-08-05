export default function ProductListSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow animate-pulse">
          <div className="w-full h-44 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-1"></div>
          <div className="h-8 bg-gray-100 rounded w-full mt-3"></div>
        </div>
      ))}
    </div>
  )
}
