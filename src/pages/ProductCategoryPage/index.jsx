import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductsByCategory } from '@/services/productCategoryService'
import ProductItem from '@/components/Products/ProductItem'
import { Search, Grid, List } from 'lucide-react'
import { Select } from 'antd'
import titles from '@/utils/titles'
const { Option } = Select

function ProductCategoryPage() {
  titles('Danh mục sản phẩm')
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid')
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center dark:from-gray-800 dark:to-gray-800 rounded-xl">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 dark:text-gray-100">Oops! Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6 dark:text-gray-300">{error || 'Không tìm thấy danh mục!'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white rounded-tl-xl rounded-tr-xl">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {category.title}
            </h1>
            {category.description && (
              <div
                className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            )}
            <div className="mt-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm">{products.length} sản phẩm có sẵn</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid dark:text-gray-100"
              />
            </div>
            <div className="flex gap-3 items-center">
              <Select
                value={sortBy}
                onChange={value => setSortBy(value)}
                className="min-w-[180px]" // giữ style cho giống nếu muốn
                size="large"
                style={{ borderRadius: 12 }}
              >
                <Option value="name">Sắp xếp theo tên</Option>
                <Option value="price-low">Giá thấp đến cao</Option>
                <Option value="price-high">Giá cao đến thấp</Option>
              </Select>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm'}</h3>
            <p className="text-gray-500">{searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Danh mục này chưa có sản phẩm nào'}</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredProducts.map(product => (
              <ProductItem key={product._id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCategoryPage
