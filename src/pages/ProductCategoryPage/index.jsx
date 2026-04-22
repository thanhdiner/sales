import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductsByCategory } from '@/services/productCategoryService'
import ProductItem from '@/components/Products/ProductItem'
import { Select } from 'antd'
import SEO from '@/components/SEO'

const { Option } = Select

function ProductCategoryPage() {
  const { slug } = useParams()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    setLoading(true)
    setError('')
    setCategory(null)
    setProducts([])

    getProductsByCategory(slug)
      .then(res => {
        if (res?.code === 200) {
          setCategory(res.category)
          setProducts(res.data)
        } else {
          setError('Không tìm thấy danh mục hoặc có lỗi xảy ra.')
        }
      })
      .catch(() => setError('Không tìm thấy danh mục hoặc có lỗi xảy ra.'))
      .finally(() => setLoading(false))
  }, [slug])

  const filteredProducts = products
    .filter(
      product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
        <SEO title="Danh mục sản phẩm" />

        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="mb-3 h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-9 w-72 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mb-8 h-5 w-full max-w-xl rounded bg-gray-200 dark:bg-gray-700" />

            <div className="mb-6 h-16 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-3 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
        <SEO title="Danh mục sản phẩm" />

        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Danh mục
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white">
            Có lỗi xảy ra
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {error || 'Không tìm thấy danh mục!'}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-gray-900 md:py-10">
      <SEO
        title={category?.title || 'Danh mục sản phẩm'}
        description={
          category?.description
            ? category.description.replace(/<[^>]*>/g, '').slice(0, 160)
            : `Xem tất cả sản phẩm trong danh mục ${category?.title || ''} tại SmartMall.`
        }
        url={`https://smartmall.site/categories/${slug}`}
      />

      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
            Danh mục sản phẩm
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-3xl">
                {category.title}
              </h1>

              {category.description && (
                <div
                  className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300 md:text-base"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              )}
            </div>

            <div className="w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {filteredProducts.length} sản phẩm
            </div>
          </div>
        </header>

        {category.thumbnail && (
          <section className="mb-6 rounded-[28px] border border-gray-200 bg-[#f4f4f7] p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/70 md:p-4">
            <div className="overflow-hidden rounded-[22px] bg-white dark:bg-gray-900">
              <img
                src={category.thumbnail}
                alt={`Banner danh mục ${category.title}`}
                className="h-[180px] w-full object-cover md:h-[240px] lg:h-[300px]"
              />
            </div>
          </section>
        )}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400 md:max-w-md"
            />

            <Select
              value={sortBy}
              onChange={value => setSortBy(value)}
              className="w-full md:w-[190px]"
              size="large"
            >
              <Option value="name">Sắp xếp theo tên</Option>
              <Option value="price-low">Giá thấp đến cao</Option>
              <Option value="price-high">Giá cao đến thấp</Option>
            </Select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm'}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác.' : 'Danh mục này chưa có sản phẩm nào.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map(product => (
              <ProductItem key={product._id} product={product} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCategoryPage
