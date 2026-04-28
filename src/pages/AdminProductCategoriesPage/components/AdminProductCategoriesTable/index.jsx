import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { Checkbox, Empty, message, Modal, Skeleton, Table } from 'antd'
import { deleteProductCategory } from '@/services/adminProductCategoryService'
import FieldThumbnail from './FieldThumbnail'
import FieldTitle from './FieldTitle'
import FieldPosition from './FieldPosition'
import FieldStatus from './FieldStatus'
import FieldAction from './FieldAction'
import AdminFieldUserInfo from '@/components/AdminFieldUserInfo'
import {
  getLocalizedProductCategoryParentTitle,
  getLocalizedProductCategoryTitle
} from '../../utils/productCategoryLocalization'
import { useTranslation } from 'react-i18next'

const ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

const getLocale = language => (language?.startsWith('en') ? 'en-US' : 'vi-VN')

const formatCompactDate = (value, fallback, locale) => {
  if (!value) return fallback

  try {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString(locale)
  } catch (err) {
    return fallback
  }
}

const formatDateTime = (value, fallback, locale) => {
  if (!value) return fallback

  try {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString(locale)
  } catch (err) {
    return fallback
  }
}

function getLastUpdate(record) {
  const updates = Array.isArray(record?.updateBy) ? record.updateBy : []
  return updates.length > 0 ? updates[updates.length - 1] : null
}

function ProductCategoryMobileCard({
  record,
  selected,
  onSelectChange,
  setEditedPositions,
  setProductCategories,
  handleDelete
}) {
  const { t, i18n } = useTranslation('adminProductCategories')
  const lastUpdate = getLastUpdate(record)
  const fallbackText = t('common.notAvailable')
  const language = i18n.resolvedLanguage || i18n.language
  const locale = getLocale(language)
  const localizedTitle = getLocalizedProductCategoryTitle(record, language, record.title || fallbackText)
  const parentTitle = getLocalizedProductCategoryParentTitle(record, language, t('table.rootCategory'))

  return (
    <article className={`admin-product-category-card ${selected ? 'admin-product-category-card--selected' : ''}`}>
      <div className="admin-product-category-card__top">
        <Checkbox checked={selected} onChange={event => onSelectChange(record._id, event.target.checked)} />

        <div className="admin-product-category-card__thumb">
          <img src={record.thumbnail} alt={localizedTitle} />
        </div>

        <div className="admin-product-category-card__main">
          <FieldTitle categoryName={localizedTitle} record={record} />
          <p className="admin-product-category-card__slug">{record.slug || record._id}</p>
        </div>

        <FieldStatus status={record.status} record={record} setProductCategories={setProductCategories} />
      </div>

      <div className="admin-product-category-card__meta">
        <div className="admin-product-category-card__meta-item">
          <span>{t('table.parent')}</span>
          <strong>{parentTitle}</strong>
        </div>
        <div className="admin-product-category-card__meta-item">
          <span>{t('table.position')}</span>
          <FieldPosition value={record.position} record={record} setEditedPositions={setEditedPositions} />
        </div>
        <div className="admin-product-category-card__meta-item">
          <span>{t('table.updated')}</span>
          <strong>{formatCompactDate(lastUpdate?.at || record.updatedAt, fallbackText, locale)}</strong>
        </div>
      </div>

      <div className="admin-product-category-card__actions">
        <FieldAction record={record} handleDelete={handleDelete} />
      </div>
    </article>
  )
}

function AdminProductCategoriesTable({
  isLoading,
  productCategories,
  setEditedPositions,
  setProductCategories,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  selectedRowKeys,
  setSelectedRowKeys,
  columnsVisible,
  totalProductCategories,
  currentPage,
  setCurrentPage,
  fetchData
}) {
  const { t, i18n } = useTranslation('adminProductCategories')
  const fallbackText = t('common.notAvailable')
  const language = i18n.resolvedLanguage || i18n.language
  const locale = getLocale(language)
  const safeProductCategories = Array.isArray(productCategories) ? productCategories : []

  const sortableTitle = (label, field) => (
    <div onClick={() => handleSort(field)} className="ant-table-column-sorters sortable" style={{ cursor: 'pointer' }}>
      {label}
      <FontAwesomeIcon className="admin-product-categories-sort-icon" icon={faSort} />
    </div>
  )

  const columns = [
    {
      title: sortableTitle(t('columns.id'), '_id'),
      dataIndex: '_id',
      key: '_id',
      className: 'ant-table-cell-style',
      width: 220,
      responsive: ['xl']
    },
    {
      title: sortableTitle(t('columns.title'), 'title'),
      dataIndex: 'title',
      key: 'title',
      className: 'ant-table-cell-style',
      width: 260,
      render: (_, record) => (
        <FieldTitle
          categoryName={getLocalizedProductCategoryTitle(record, language, record.title || fallbackText)}
          record={record}
        />
      )
    },
    {
      title: t('columns.thumbnail'),
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      className: 'ant-table-cell-style',
      width: 100,
      responsive: ['md'],
      render: (thumbnail, record) => <FieldThumbnail {...{ thumbnail, record }} />
    },
    {
      title: sortableTitle(t('columns.position'), 'position'),
      dataIndex: 'position',
      className: 'ant-table-cell-style position-column',
      key: 'position',
      width: 130,
      responsive: ['sm'],
      render: (value, record) => <FieldPosition {...{ value, record, setEditedPositions }} />
    },
    {
      title: t('columns.updatedBy'),
      dataIndex: 'updateBy',
      className: 'ant-table-cell-style',
      key: 'updateBy',
      width: 180,
      responsive: ['xl'],
      render: (updateByArr = []) => {
        const lastUpdate = updateByArr.length > 0 ? updateByArr[updateByArr.length - 1] : null
        return lastUpdate && lastUpdate.by ? <AdminFieldUserInfo user={lastUpdate.by} /> : fallbackText
      }
    },
    {
      title: t('columns.updatedAt'),
      dataIndex: 'updateBy',
      className: 'ant-table-cell-style',
      key: 'updateAt',
      width: 180,
      responsive: ['lg'],
      render: updateBy => {
        if (!updateBy || updateBy.length === 0) return fallbackText
        const last = updateBy[updateBy.length - 1]
        return formatDateTime(last?.at, fallbackText, locale)
      }
    },
    {
      title: sortableTitle(t('columns.createdBy'), 'createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      className: 'ant-table-cell-style',
      width: 180,
      responsive: ['xl'],
      render: createdBy => (createdBy && createdBy.by ? <AdminFieldUserInfo user={createdBy.by} /> : fallbackText)
    },
    {
      title: sortableTitle(t('columns.createdAt'), 'createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'ant-table-cell-style',
      width: 180,
      responsive: ['xl'],
      render: value => formatDateTime(value, fallbackText, locale)
    },
    {
      title: sortableTitle(t('columns.status'), 'status'),
      dataIndex: 'status',
      className: 'ant-table-cell-style',
      key: 'status',
      width: 100,
      render: (status, record) => <FieldStatus {...{ status, record, setProductCategories }} />
    },
    {
      title: t('columns.actions'),
      key: 'action',
      className: 'ant-table-cell-style',
      width: 100,
      render: (_, record) => <FieldAction {...{ record, handleDelete }} />
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedKeys => {
      setSelectedRowKeys(selectedKeys)
    }
  }

  const handleMobileSelectChange = (id, checked) => {
    setSelectedRowKeys(prev => (checked ? Array.from(new Set([...prev, id])) : prev.filter(key => key !== id)))
  }

  const visibleColumns = columns.filter(col => columnsVisible[col.key] !== false)

  const handleSort = field => {
    if (sortField !== field) {
      setSortField(field)
      setSortOrder('ascend')
      return
    }

    const nextSortOrder = sortOrder === 'ascend' ? 'descend' : sortOrder === 'descend' ? null : 'ascend'
    setSortOrder(nextSortOrder)

    if (!nextSortOrder) {
      setSortField(null)
    }
  }

  const handleDelete = record => {
    const localizedTitle = getLocalizedProductCategoryTitle(record, language, record.title || fallbackText)

    Modal.confirm({
      title: t('table.deleteTitle'),
      content: t('table.deleteContent', { title: localizedTitle }),
      className: 'admin-product-categories-confirm-modal',
      maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
      okText: t('common.yes'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteProductCategory(record._id)
          message.success(t('table.deleteSuccess'))
          const updatedProductCategories = safeProductCategories.filter(p => p._id !== record._id)
          const updatedTotal = totalProductCategories - 1

          if (updatedProductCategories.length === 0 && updatedTotal > 0 && currentPage > 1) {
            setCurrentPage(prev => prev - 1)
          } else {
            fetchData()
          }

          setSelectedRowKeys([])
        } catch (err) {
          message.error(t('table.deleteError'))
        }
      }
    })
  }

  return (
    <>
      <div className="admin-product-categories-table-wrapper overflow-x-auto">
        <Table
          loading={{
            spinning: isLoading,
            tip: t('table.loading')
          }}
          rowKey="_id"
          rowSelection={rowSelection}
          columns={visibleColumns}
          dataSource={safeProductCategories}
          locale={{ emptyText: <Empty description={t('table.empty')} /> }}
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          className="admin-product-categories-table"
        />
      </div>

      <div className="admin-product-categories-card-list" aria-live="polite">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="admin-product-category-card admin-product-category-card--loading">
              <Skeleton active avatar paragraph={{ rows: 3 }} title={{ width: '70%' }} />
            </div>
          ))
        ) : safeProductCategories.length ? (
          safeProductCategories.map(record => (
            <ProductCategoryMobileCard
              key={record._id}
              record={record}
              selected={selectedRowKeys.includes(record._id)}
              onSelectChange={handleMobileSelectChange}
              setEditedPositions={setEditedPositions}
              setProductCategories={setProductCategories}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="admin-product-categories-card-empty">
            <Empty description={t('table.empty')} />
          </div>
        )}
      </div>
    </>
  )
}

export default AdminProductCategoriesTable
