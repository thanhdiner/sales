import { isValidElement } from 'react'
import { Empty, Pagination, Skeleton, Table } from 'antd'
import { cn } from '@/lib/utils'
import AdminPageShell from './AdminPageShell'
import AdminTablePanel from './AdminTablePanel'
import AdminToolbar from './AdminToolbar'

const defaultRowKey = record => record?._id || record?.id || record?.key

function renderSlot(slot, slotProps) {
  if (!slot) return null

  if (isValidElement(slot)) return slot

  if (typeof slot === 'function') {
    return slot(slotProps)
  }

  if (Array.isArray(slot) || typeof slot !== 'object') return slot

  return null
}

function getRows(dataSource) {
  return Array.isArray(dataSource) ? dataSource : []
}

function getItemKey(rowKey, item, index) {
  if (typeof rowKey === 'function') return rowKey(item) ?? index
  if (typeof rowKey === 'string') return item?.[rowKey] ?? index

  return defaultRowKey(item) ?? index
}

export function AdminResourceTable({
  bodyClassName,
  className,
  columns = [],
  dataSource = [],
  description,
  emptyText,
  extra,
  loading,
  rowKey = defaultRowKey,
  tableProps = {},
  title
}) {
  const { className: tableClassName, locale, pagination = false, ...restTableProps } = tableProps
  const rows = getRows(dataSource)
  const tableLocale = {
    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />,
    ...locale
  }

  return (
    <AdminTablePanel
      title={title}
      description={description}
      extra={extra}
      className={cn('admin-resource-table-section', className)}
      bodyClassName={cn('admin-resource-table-section__body', bodyClassName)}
    >
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={pagination}
        locale={tableLocale}
        className={cn('admin-resource-table', tableClassName)}
        {...restTableProps}
      />
    </AdminTablePanel>
  )
}

export function AdminResourceMobileList({
  className,
  dataSource = [],
  description,
  emptyIcon,
  emptyText,
  loading,
  renderItem,
  rowKey = defaultRowKey,
  skeletonCount = 3,
  skeletonRows = 4,
  title
}) {
  const rows = getRows(dataSource)

  if (!renderItem) return null

  return (
    <section className={cn('admin-resource-mobile-section', className)}>
      {title || description ? (
        <div className="admin-resource-mobile-section__header">
          {title ? <h2 className="admin-resource-mobile-section__title">{title}</h2> : null}
          {description ? <p className="admin-resource-mobile-section__description">{description}</p> : null}
        </div>
      ) : null}

      {loading ? (
        <div className="admin-resource-mobile-section__list">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={`admin-resource-mobile-skeleton-${index}`} className="admin-resource-mobile-section__skeleton">
              <Skeleton active paragraph={{ rows: skeletonRows }} />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="admin-resource-mobile-section__empty">
          <Empty image={emptyIcon || Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
        </div>
      ) : (
        <div className="admin-resource-mobile-section__list">
          {rows.map((item, index) => (
            <div key={getItemKey(rowKey, item, index)} className="admin-resource-mobile-section__item">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function AdminResourcePagination({
  className,
  pagination,
  paginationClassName,
  summary,
  summaryClassName
}) {
  if (!pagination) return null

  const {
    current,
    onChange,
    pageSize,
    pageSizeOptions = [10, 20, 50],
    showSizeChanger = true,
    total,
    ...restPaginationProps
  } = pagination
  const normalizedTotal = Number(total) || 0
  const resolvedSummary = typeof summary === 'function' ? summary(pagination) : summary

  return (
    <section className={cn('admin-resource-pagination-section', className)}>
      {resolvedSummary ? (
        <p className={cn('admin-resource-pagination-section__summary', summaryClassName)}>
          {resolvedSummary}
        </p>
      ) : null}

      {normalizedTotal > 0 ? (
        <Pagination
          current={current}
          pageSize={pageSize}
          total={normalizedTotal}
          showSizeChanger={showSizeChanger}
          pageSizeOptions={pageSizeOptions.map(option => String(option))}
          onChange={onChange}
          className={cn('admin-resource-pagination', paginationClassName)}
          {...restPaginationProps}
        />
      ) : null}
    </section>
  )
}

export default function AdminResourcePage({
  actions,
  children,
  className,
  columns,
  contentClassName,
  dataSource,
  description,
  filters,
  filtersProps,
  header,
  headerProps,
  loading,
  maxWidth = '1280px',
  mobileList,
  mobileListProps,
  noIndex = true,
  pagination,
  paginationProps,
  panel = false,
  panelClassName,
  resource,
  rowKey,
  seoTitle,
  stats,
  statsProps,
  table,
  tableProps,
  title
}) {
  const slotProps = {
    dataSource,
    loading,
    resource
  }
  const actionNode = renderSlot(actions, slotProps)
  const headerNode =
    renderSlot(header, { ...slotProps, ...headerProps }) ||
    (title || description || actionNode ? (
      <AdminToolbar title={title} description={description} actions={actionNode} {...headerProps} />
    ) : null)
  const statsNode = renderSlot(stats, { ...slotProps, ...statsProps })
  const filtersNode = renderSlot(filters, { ...slotProps, ...filtersProps })
  const customTableNode = renderSlot(table, { ...slotProps, ...tableProps })
  const tableNode =
    customTableNode ||
    (columns ? (
      <AdminResourceTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        {...tableProps}
      />
    ) : null)
  const customMobileNode = renderSlot(mobileList, { ...slotProps, ...mobileListProps })
  const mobileNode =
    customMobileNode ||
    (mobileListProps?.renderItem ? (
      <AdminResourceMobileList
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        {...mobileListProps}
      />
    ) : null)
  const customPaginationNode = renderSlot(pagination, { ...slotProps, ...paginationProps })
  const paginationNode =
    customPaginationNode ||
    (!isValidElement(pagination) && typeof pagination === 'object' ? (
      <AdminResourcePagination pagination={pagination} {...paginationProps} />
    ) : null)

  return (
    <AdminPageShell
      seoTitle={seoTitle}
      noIndex={noIndex}
      maxWidth={maxWidth}
      panel={panel}
      panelClassName={panelClassName}
      className={cn(
        'admin-resource-page',
        resource && `admin-resource-page--${resource}`,
        mobileNode && 'admin-resource-page--has-mobile-list',
        className
      )}
      contentClassName={cn('admin-resource-page__inner', contentClassName)}
    >
      {headerNode}
      {statsNode}
      {filtersNode}
      {tableNode}
      {mobileNode}
      {paginationNode}
      {children}
    </AdminPageShell>
  )
}
