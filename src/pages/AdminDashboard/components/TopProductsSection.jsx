import React from 'react'
import { Empty, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import { Folder, Package, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../utils/dashboardTransforms'

const formatNumber = value => (Number(value) || 0).toLocaleString('vi-VN')

function ProductThumb({ product }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className="dashboard-product-thumb" />
  }

  return (
    <span className="dashboard-product-thumb dashboard-product-thumb--empty">
      <Package size={20} />
    </span>
  )
}

function ProductList({ loading, topProducts }) {
  if (loading) {
    return (
      <div className="dashboard-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton.Input key={index} active block className="dashboard-row-skeleton" />
        ))}
      </div>
    )
  }

  if (!topProducts?.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu sản phẩm nổi bật" />
  }

  return (
    <div className="dashboard-list">
      {topProducts.slice(0, 5).map((product, index) => {
        const trendState = product.trend === 'down' ? 'down' : product.trend === 'equal' ? 'equal' : 'up'
        const TrendIcon = trendState === 'down' ? TrendingDown : TrendingUp
        const trendClass = trendState === 'down' ? 'danger' : trendState === 'equal' ? 'neutral' : 'success'
        const trendLabel = trendState === 'down' ? 'Giảm' : trendState === 'equal' ? 'Ổn định' : 'Tăng'

        return (
          <div className="dashboard-list-row dashboard-product-row" key={product._id || `${product.name}-${index}`}>
            <ProductThumb product={product} />
            <div className="dashboard-row-copy">
              <strong>{product.name}</strong>
              <span>Đã bán: {formatNumber(product.sales)} - {formatCurrency(product.revenue)}</span>
            </div>
            <span className={`dashboard-status-badge ${trendClass}`}>
              <TrendIcon size={13} />
              {trendLabel}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function CategoryList({ categoryData, loading }) {
  if (loading) {
    return (
      <div className="dashboard-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton.Input key={index} active block className="dashboard-row-skeleton" />
        ))}
      </div>
    )
  }

  if (!categoryData?.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu danh mục" />
  }

  return (
    <div className="dashboard-list">
      {categoryData.slice(0, 5).map((category, index) => (
        <div className="dashboard-list-row dashboard-category-row" key={`${category.name}-${index}`}>
          <span className="dashboard-square-icon">
            <Folder size={17} />
          </span>
          <div className="dashboard-row-copy">
            <strong>{category.name || `Danh mục ${index + 1}`}</strong>
            <span>Sản phẩm: {formatNumber(category.value)}</span>
          </div>
          <span className="dashboard-status-badge success">Hiển thị</span>
        </div>
      ))}
    </div>
  )
}

export default function TopProductsSection({ categoryData, categoryLoading, loading, topProducts }) {
  return (
    <section className="dashboard-bottom-grid dashboard-bottom-grid--half">
      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>Sản phẩm nổi bật</h2>
          <Link to="/admin/products">Xem tất cả</Link>
        </div>
        <ProductList loading={loading} topProducts={topProducts} />
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>Phân bổ danh mục</h2>
          <Link to="/admin/product-categories">Xem tất cả</Link>
        </div>
        <CategoryList categoryData={categoryData} loading={categoryLoading} />
      </div>
    </section>
  )
}
