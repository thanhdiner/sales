import { useEffect, useState } from 'react'
import ProductCard from '@/components/Products/ProductList/ProductCard'
import { getExploreMoreProducts } from '@/services/productService'

function ExploreMoreSection({ productId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!productId) {
      setProducts([])
      setLoading(false)
      return
    }

    let isCancelled = false

    const fetchExploreMore = async () => {
      setLoading(true)

      try {
        const data = await getExploreMoreProducts(productId, { limit: 8 })

        if (!isCancelled) {
          setProducts(Array.isArray(data?.products) ? data.products : [])
        }
      } catch {
        if (!isCancelled) {
          setProducts([])
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchExploreMore()

    return () => {
      isCancelled = true
    }
  }, [productId])

  if (!productId) return null
  if (!loading && products.length === 0) return null

  return (
    <section className="mt-12 space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Khám phá thêm
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sản phẩm tương tự và nổi bật dành cho bạn
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 animate-pulse dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="mt-3 space-y-2">
                <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="mt-4 h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((item, index) => (
            <div key={item._id || item.id || `explore-more-${index}`}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ExploreMoreSection
