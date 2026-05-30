import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { message } from 'antd'
import SEO from '@/components/shared/SEO'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { downloadAdminResourceCsv, useAdminResourceColumns } from '@/hooks/shared/adminResourceList'
import { useOrders } from './hooks/useOrders'
import OrdersFilters from './sections/OrdersFilters'
import OrdersHeader from './sections/OrdersHeader'
import OrdersPagination from './sections/OrdersPagination'
import OrdersTable from './sections/OrdersTable'
import { ORDER_COLUMN_KEYS, getOrderExportRows } from './utils'
import './index.scss'

const ORDERS_COLUMNS_STORAGE_KEY = 'adminOrdersColumnsVisible'
const ORDERS_DEFAULT_COLUMNS_VISIBLE = ORDER_COLUMN_KEYS.reduce((columns, key) => ({ ...columns, [key]: true }), {})

export default function Orders() {
  const { t, i18n } = useTranslation('adminOrders')
  const language = i18n.resolvedLanguage || i18n.language
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(true)
  const { columnsVisible, setColumnsVisible } = useAdminResourceColumns({
    storageKey: ORDERS_COLUMNS_STORAGE_KEY,
    defaults: ORDERS_DEFAULT_COLUMNS_VISIBLE
  })
  const {
    orders,
    loading,
    keyword,
    status,
    pagination,
    handleKeywordChange,
    handleStatusChange,
    handleClearFilters,
    handlePageChange,
    refreshCurrentPage
  } = useOrders()

  const visibleColumnCount = useMemo(
    () => ORDER_COLUMN_KEYS.filter(key => key !== 'actions' && columnsVisible[key] !== false).length,
    [columnsVisible]
  )

  const handleColumnsVisibleChange = nextKeys => {
    const visibleKeys = new Set([...nextKeys, 'actions'])
    const nextColumns = ORDER_COLUMN_KEYS.reduce((columns, key) => ({ ...columns, [key]: visibleKeys.has(key) }), {})
    nextColumns.actions = true

    if (!ORDER_COLUMN_KEYS.some(key => key !== 'actions' && nextColumns[key])) {
      message.warning(t('messages.columnRequired'))
      return
    }

    setColumnsVisible(nextColumns)
  }

  const handleExport = () => {
    downloadAdminResourceCsv({
      rows: getOrderExportRows(orders, language, t),
      filename: `orders-${dayjs().format('YYYYMMDD-HHmm')}.csv`,
      onEmpty: () => message.info(t('messages.exportEmpty')),
      onSuccess: () => message.success(t('messages.exportSuccess'))
    })
  }

  return (
    <div className="admin-orders-page text-[var(--admin-text)]">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl space-y-3 sm:space-y-4">
        <OrdersHeader
          columnsVisible={columnsVisible}
          loading={loading}
          onColumnsVisibleChange={handleColumnsVisibleChange}
          onExport={handleExport}
          onRefresh={refreshCurrentPage}
          onToggleFilters={() => setShowFilters(current => !current)}
        />

        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:rounded-2xl sm:p-4 lg:p-5">
          {showFilters ? (
            <OrdersFilters
              keyword={keyword}
              status={status}
              onClearFilters={handleClearFilters}
              onKeywordChange={handleKeywordChange}
              onStatusChange={handleStatusChange}
            />
          ) : null}

          {showFilters ? <div className="admin-orders-section-divider" /> : null}

          <OrdersTable
            loading={loading}
            orders={orders}
            columnsVisible={columnsVisible}
            visibleColumnCount={visibleColumnCount}
            onViewOrder={orderId => navigate(`/admin/orders/${orderId}`)}
          />

          <OrdersPagination
            visible={!loading && orders.length > 0}
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
