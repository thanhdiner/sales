import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Checkbox, Empty, message, Modal, Skeleton, Table } from 'antd'
import { Link } from 'react-router-dom'
import { deleteProduct } from '@/services/adminProductService'
import FieldTitle from './FieldTitle'
import FieldThumbnail from './FieldThumbnail'
import FieldPosition from './FieldPosition'
import FieldStatus from './FieldStatus'
import FieldAction from './FieldAction'
import FieldCategory from './FieldCategory'
import AdminFieldUserInfo from '@/components/AdminFieldUserInfo'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import {
  getLocalizedProductCategoryTitle,
  getLocalizedProductTitle
} from '../../utils/productLocalization'
import { useTranslation } from 'react-i18next'

const ADMIN_PRODUCTS_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

const getProductLocale = language => (String(language || '').startsWith('en') ? 'en-US' : 'vi-VN')

const formatProductPrice = (value, t, locale) => {
  if (value === undefined || value === null || value === '') return t('common.notAvailable')

  const numericValue = Number(value)
  return Number.isNaN(numericValue) ? value : `${numericValue.toLocaleString(locale)}đ`
}

const formatProductPercent = (value, locale) => {
  if (value === undefined || value === null || value === '') return '0%'
  if (typeof value === 'string' && value.includes('%')) return value

  const numericValue = Number(value)
  return Number.isNaN(numericValue) ? `${value}%` : `${numericValue.toLocaleString(locale)}%`
}

const getProductCategoryTitle = (product, t, language) =>
  getLocalizedProductCategoryTitle(product, language, t('table.uncategorized'))

function ProductTableTitle({ productName, record, showThumbnail, showCategory, showDiscount, t, locale, language }) {
  const extraItems = [
    showCategory && getProductCategoryTitle(record, t, language),
    showDiscount && formatProductPercent(record.discountPercentage, locale)
  ].filter(Boolean)

  return (
    <div className="admin-products-table-product">
      <div className="admin-products-table-product__body">
        {showThumbnail && (
          <div className="admin-products-table-product__thumb">
            <img src={record.thumbnail} alt={productName || record.title} />
          </div>
        )}
        <div className="admin-products-table-product__copy">
          <FieldTitle productName={productName} record={record} />
          {extraItems.length > 0 && <div className="admin-products-table-product__extra">{extraItems.join('  •  ')}</div>}
        </div>
      </div>
    </div>
  )
}

function ProductMobileActions({ record, handleDelete, t }) {
  const permissions = useAdminPermissions()

  return (
    <div className="admin-product-card__actions">
      <Link to={`/admin/products/details/${record._id}`} target="_blank" className="admin-product-card__action-link">
        <Button className="admin-products-action-btn admin-product-card__action-btn" icon={<EyeOutlined />}>
          {t('common.view')}
        </Button>
      </Link>

      {permissions.includes('edit_product') && (
        <Link to={`/admin/products/edit/${record._id}`} className="admin-product-card__action-link">
          <Button className="admin-products-action-btn admin-product-card__action-btn" icon={<EditOutlined />}>
            {t('common.edit')}
          </Button>
        </Link>
      )}

      {permissions.includes('delete_product') && (
        <Button
          className="admin-products-action-btn admin-products-action-btn--delete admin-product-card__action-btn"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          {t('common.delete')}
        </Button>
      )}
    </div>
  )
}

function ProductMobileCard({ record, selected, onSelectChange, setProducts, handleDelete, t, locale, language }) {
  const productTitle = getLocalizedProductTitle(record, language, record.title || t('details.untitledProduct'))
  const categoryTitle = getProductCategoryTitle(record, t, language)

  return (
    <article className={`admin-product-card ${selected ? 'admin-product-card--selected' : ''}`}>
      <div className="admin-product-card__top">
        <Checkbox checked={selected} onChange={event => onSelectChange(record._id, event.target.checked)} />

        <div className="admin-product-card__thumb">
          <img src={record.thumbnail} alt={productTitle} />
        </div>

        <div className="admin-product-card__main">
          <FieldTitle productName={productTitle} record={record} />
          <p className="admin-product-card__category">{categoryTitle}</p>
        </div>

        <FieldStatus status={record.status} record={record} setProducts={setProducts} />
      </div>

      <div className="admin-product-card__stats">
        <div className="admin-product-card__stat">
          <span>{t('columns.price')}</span>
          <strong>{formatProductPrice(record.price, t, locale)}</strong>
        </div>
        <div className="admin-product-card__stat">
          <span>{t('columns.discount')}</span>
          <strong>{formatProductPercent(record.discountPercentage, locale)}</strong>
        </div>
        <div className="admin-product-card__stat">
          <span>{t('columns.stock')}</span>
          <strong>{record.stock ?? t('common.notAvailable')}</strong>
        </div>
      </div>

      <ProductMobileActions record={record} handleDelete={handleDelete} t={t} />
    </article>
  )
}

function AdminProductsTable({
  isLoading,
  products,
  setEditedPositions,
  setProducts,
  sortField,
  setSortField,
  setSortOrder,
  selectedRowKeys,
  setSelectedRowKeys,
  columnsVisible,
  totalProducts,
  currentPage,
  setCurrentPage,
  fetchData
}) {
  const { t, i18n } = useTranslation('adminProducts')
  const language = i18n.resolvedLanguage || i18n.language
  const locale = getProductLocale(language)
  const fallbackText = t('common.notAvailable')

  const sortableTitle = (label, field) => (
    <div onClick={() => handleSort(field)} className="ant-table-column-sorters sortable" style={{ cursor: 'pointer' }}>
      {label}
      <FontAwesomeIcon className="admin-products-sort-icon" icon={faSort} />
    </div>
  )

  const columns = [
    {
      title: sortableTitle(t('columns.id'), '_id'),
      dataIndex: '_id',
      key: '_id',
      className: 'ant-table-cell-style admin-products-id-column',
      responsive: ['xl']
    },
    {
      title: sortableTitle(t('columns.title'), 'title'),
      dataIndex: 'title',
      key: 'title',
      className: 'ant-table-cell-style',
      width: 240,
      render: (productName, record) => (
        <ProductTableTitle
          productName={getLocalizedProductTitle(record, language, productName || fallbackText)}
          record={record}
          showThumbnail={columnsVisible.thumbnail !== false}
          showCategory={columnsVisible.productCategory !== false}
          showDiscount={columnsVisible.discountPercentage !== false}
          t={t}
          locale={locale}
          language={language}
        />
      )
    },
    {
      title: sortableTitle(t('columns.category'), 'productCategory'),
      dataIndex: 'productCategory',
      key: 'productCategory',
      className: 'ant-table-cell-style admin-products-category-column',
      width: 160,
      responsive: ['xl'],
      render: category => <FieldCategory {...{ category }} />
    },
    {
      title: t('columns.thumbnail'),
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      className: 'ant-table-cell-style admin-products-thumbnail-column',
      width: 96,
      responsive: ['xl'],
      render: (thumbnail, record) => <FieldThumbnail {...{ thumbnail, record }} />
    },
    {
      title: sortableTitle(t('columns.position'), 'position'),
      dataIndex: 'position',
      className: 'ant-table-cell-style position-column admin-products-position-column',
      key: 'position',
      width: 120,
      responsive: ['xl'],
      render: (value, record) => <FieldPosition {...{ value, record, setEditedPositions }} />
    },
    {
      title: sortableTitle(t('columns.price'), 'price'),
      dataIndex: 'price',
      className: 'ant-table-cell-style',
      key: 'price',
      width: 120,
      responsive: ['sm'],
      render: value => formatProductPrice(value, t, locale)
    },
    {
      title: sortableTitle(t('columns.discountPercentage'), 'discountPercentage'),
      dataIndex: 'discountPercentage',
      className: 'ant-table-cell-style admin-products-discount-column',
      key: 'discountPercentage',
      width: 150,
      responsive: ['xl'],
      render: value => formatProductPercent(value, locale)
    },

    {
      title: sortableTitle(t('columns.stock'), 'stock'),
      dataIndex: 'stock',
      className: 'ant-table-cell-style',
      key: 'stock',
      width: 100,
      responsive: ['md']
    },
    {
      title: t('columns.updatedBy'),
      dataIndex: 'updateBy',
      className: 'ant-table-cell-style admin-products-admin-meta-column',
      key: 'updateBy',
      width: 180,
      responsive: ['xl'],
      render: (updateByArr = []) => {
        const lastUpdate = updateByArr.length > 0 ? updateByArr[updateByArr.length - 1] : null
        return lastUpdate && lastUpdate.by ? <AdminFieldUserInfo user={lastUpdate.by} /> : t('common.notAvailable')
      }
    },
    {
      title: t('columns.updatedAt'),
      dataIndex: 'updateBy',
      className: 'ant-table-cell-style admin-products-admin-meta-column',
      key: 'updateAt',
      width: 180,
      responsive: ['xl'],
      render: updateBy => {
        if (!updateBy || updateBy.length === 0) return t('common.notAvailable')
        const last = updateBy[updateBy.length - 1]
        return last?.at ? new Date(last.at).toLocaleString(locale) : t('common.notAvailable')
      }
    },
    {
      title: sortableTitle(t('columns.createdBy'), 'createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      className: 'ant-table-cell-style admin-products-admin-meta-column',
      width: 180,
      responsive: ['xl'],
      render: createdBy => (createdBy && createdBy.by ? <AdminFieldUserInfo user={createdBy.by} /> : t('common.notAvailable'))
    },
    {
      title: sortableTitle(t('columns.createdAt'), 'createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'ant-table-cell-style admin-products-admin-meta-column',
      width: 180,
      responsive: ['xl'],
      render: v => (v ? new Date(v).toLocaleString(locale) : t('common.notAvailable'))
    },
    {
      title: sortableTitle(t('columns.status'), 'status'),
      dataIndex: 'status',
      className: 'ant-table-cell-style',
      key: 'status',
      width: 100,
      render: (status, record) => <FieldStatus {...{ status, record, setProducts }} />
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
  const safeProducts = Array.isArray(products) ? products : []

  //# handler
  const handleSort = field => {
    if (sortField !== field) {
      setSortField(field)
      setSortOrder('ascend')
      return
    }

    let nextSortOrder = null

    setSortOrder(currentSortOrder => {
      nextSortOrder = currentSortOrder === 'ascend' ? 'descend' : currentSortOrder === 'descend' ? null : 'ascend'
      return nextSortOrder
    })

    if (!nextSortOrder) {
      setSortField(null)
    }
  }

  const handleDelete = record => {
    const localizedTitle = getLocalizedProductTitle(record, language, record.title || fallbackText)

    Modal.confirm({
      className: 'admin-products-confirm-modal',
      maskStyle: ADMIN_PRODUCTS_CONFIRM_MASK_STYLE,
      title: <span>{t('table.deleteTitle')}</span>,
      content: <span>{t('table.deleteContent', { title: localizedTitle })}</span>,
      okText: t('common.yes'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteProduct(record._id)
          message.success(t('table.deleteSuccess'))
          const updatedProducts = safeProducts.filter(p => p._id !== record._id)
          const updatedTotal = totalProducts - 1

          if (updatedProducts.length === 0 && updatedTotal > 0 && currentPage > 1) {
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
  //# End handler

  return (
    <>
      <div className="mt-[10px] admin-products-table-wrapper overflow-x-auto">
        <Table
          loading={{
            spinning: isLoading,
            tip: t('table.loading')
          }}
          rowKey="_id"
          rowSelection={rowSelection}
          columns={visibleColumns}
          dataSource={safeProducts}
          locale={{ emptyText: <Empty description={t('table.empty')} /> }}
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          className="admin-products-table"
        />
      </div>

      <div className="admin-products-card-list" aria-live="polite">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="admin-product-card admin-product-card--loading">
              <Skeleton active avatar paragraph={{ rows: 3 }} title={{ width: '72%' }} />
            </div>
          ))
        ) : safeProducts.length ? (
          safeProducts.map(record => (
            <ProductMobileCard
              key={record._id}
              record={record}
              selected={selectedRowKeys.includes(record._id)}
              onSelectChange={handleMobileSelectChange}
              setProducts={setProducts}
              handleDelete={handleDelete}
              t={t}
              locale={locale}
              language={language}
            />
          ))
        ) : (
          <div className="admin-products-card-empty">
            <Empty description={t('table.empty')} />
          </div>
        )}
      </div>
    </>
  )
}

export default AdminProductsTable
