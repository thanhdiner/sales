import React from 'react'
import { Dropdown } from 'antd'
import { ArrowRight, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDashboardLowStock } from '../hooks/useDashboardQueries'
import { getDashboardLocale } from '../utils/dashboardTransforms'
import DashboardRowSkeleton from './DashboardRowSkeleton'

export default function StockPanel({ onThresholdChange, threshold }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const { lowStockProducts: products, lowStockProductsLoading } = useDashboardLowStock(threshold)
  const locale = getDashboardLocale(i18n.language)
  const stockTotal = products?.length || 0
  const outOfStockTotal = products?.filter(product => product.stock <= 0).length || 0
  const lowStockTotal = Math.max(0, stockTotal - outOfStockTotal)
  const thresholdItems = [3, 5, 10].map(value => ({
    key: String(value),
    label: t('charts.stock.thresholdOption', { count: value }),
    onClick: () => onThresholdChange(value)
  }))

  return (
    <div className="dashboard-panel dashboard-stock-widget">
      <div className="dashboard-panel-header dashboard-panel-header--action">
        <h2>{t('charts.stock.title')}</h2>
        <Dropdown menu={{ items: thresholdItems, selectedKeys: [String(threshold)] }} trigger={['click']} placement="bottomRight" overlayClassName="dashboard-threshold-dropdown">
          <button type="button" className="dashboard-panel-icon-btn" aria-label={t('charts.stock.changeThreshold')}>
            <MoreHorizontal size={16} />
          </button>
        </Dropdown>
      </div>

      {lowStockProductsLoading ? (
        <DashboardRowSkeleton />
      ) : products?.length ? (
        <div className="dashboard-stock-widget-body">
          <div className="dashboard-stock-widget-summary">
            <div className="dashboard-stock-total">
              <strong>{stockTotal.toLocaleString(locale)}</strong>
              <span>{t('charts.stock.total')}</span>
            </div>

            <div className="dashboard-stock-breakdown dashboard-stock-breakdown--compact">
              <span>{outOfStockTotal.toLocaleString(locale)} {t('charts.stock.out')}</span>
              <span>{lowStockTotal.toLocaleString(locale)} {t('charts.stock.low')}</span>
            </div>
          </div>

          <div className="dashboard-stock-items">
            <h3>{t('charts.stock.items')}</h3>
            {products.slice(0, 3).map(product => (
              <div className="dashboard-stock-item" key={product.id || product.name}>
                <span className="dashboard-stock-thumb">
                  {product.thumbnail ? <img src={product.thumbnail} alt={product.name} /> : product.name?.charAt(0)?.toUpperCase() || 'P'}
                </span>
                <span className="dashboard-stock-copy">
                  <strong>{product.name}</strong>
                </span>
                <span className={`dashboard-stock-count ${product.stock <= 0 ? 'danger' : 'warning'}`}>
                  {product.stock <= 0 ? t('charts.stock.out') : t('charts.stock.left', { count: product.stock.toLocaleString(locale) })}
                </span>
              </div>
            ))}

            <Link className="dashboard-stock-view-link" to="/admin/products">
              {t('charts.stock.viewInventory', { defaultValue: 'View inventory' })}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="dashboard-stock-empty">{t('charts.stock.empty')}</div>
      )}
    </div>
  )
}
