import React from 'react'
import { Empty, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Folder, Package, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency, getDashboardLocale } from '../utils/dashboardTransforms'

const formatNumber = (value, locale) => (Number(value) || 0).toLocaleString(locale)

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

function ProductList({ loading, locale, topProducts, t }) {
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
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('topProducts.emptyProducts')} />
  }

  return (
    <div className="dashboard-list">
      {topProducts.slice(0, 5).map((product, index) => {
        const trendState = product.trend === 'down' ? 'down' : product.trend === 'equal' ? 'equal' : 'up'
        const TrendIcon = trendState === 'down' ? TrendingDown : TrendingUp
        const trendClass = trendState === 'down' ? 'danger' : trendState === 'equal' ? 'neutral' : 'success'
        const trendLabel = t(`topProducts.trends.${trendState}`)
        const soldCount = formatNumber(product.sales, locale)
        const revenue = formatCurrency(product.revenue, locale)

        return (
          <div className="dashboard-list-row dashboard-product-row" key={product._id || `${product.name}-${index}`}>
            <ProductThumb product={product} />
            <div className="dashboard-row-copy">
              <strong>{product.name}</strong>
              <span>{t('topProducts.sold', { count: soldCount, revenue })}</span>
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

function CategoryList({ categoryData, loading, locale, t }) {
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
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('topProducts.emptyCategories')} />
  }

  return (
    <div className="dashboard-list">
      {categoryData.slice(0, 5).map((category, index) => (
        <div className="dashboard-list-row dashboard-category-row" key={`${category.name}-${index}`}>
          <span className="dashboard-square-icon">
            <Folder size={17} />
          </span>
          <div className="dashboard-row-copy">
            <strong>{category.name || t('topProducts.categoryFallback', { number: index + 1 })}</strong>
            <span>{t('topProducts.categoryProductCount', { count: formatNumber(category.value, locale) })}</span>
          </div>
          <span className="dashboard-status-badge success">{t('status.visible')}</span>
        </div>
      ))}
    </div>
  )
}

export default function TopProducts({ categoryData, categoryLoading, loading, topProducts }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const locale = getDashboardLocale(i18n.language)

  return (
    <section className="dashboard-bottom-grid dashboard-bottom-grid--half">
      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>{t('topProducts.productsTitle')}</h2>
          <Link to="/admin/products">{t('common.viewAll')}</Link>
        </div>
        <ProductList loading={loading} locale={locale} topProducts={topProducts} t={t} />
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>{t('topProducts.categoriesTitle')}</h2>
          <Link to="/admin/product-categories">{t('common.viewAll')}</Link>
        </div>
        <CategoryList categoryData={categoryData} loading={categoryLoading} locale={locale} t={t} />
      </div>
    </section>
  )
}
