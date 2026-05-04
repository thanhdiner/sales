import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Select,
  Table,
  Tag,
  Tooltip,
  message
} from 'antd'
import {
  Boxes,
  Calculator,
  ClipboardList,
  Coins,
  Filter,
  MoreHorizontal,
  PackageCheck,
  Plus,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  StickyNote,
  Table2,
  UserRound,
  XCircle
} from 'lucide-react'
import { PageShell, StatCard, StatGrid, TableShell, Toolbar } from '@/components/admin/ui'
import SearchInput from '@/components/shared/SearchInput'
import { stringFilter, useListSearchParams } from '@/hooks/shared/useListSearchParams'
import { getProducts } from '@/services/admin/commerce/product'
import { cancelPurchaseReceipt, createPurchaseReceipt, getPurchaseReceipts } from '@/services/admin/commerce/purchaseReceipt'
import { useTranslation } from 'react-i18next'
import './index.scss'

const DEFAULT_PAGE_SIZE = 20
const PAGE_SIZE_OPTIONS = ['10', '20', '50']
const { RangePicker } = DatePicker

const PURCHASE_RECEIPT_FILTER_PARSERS = {
  search: stringFilter,
  productId: stringFilter,
  supplierName: stringFilter,
  dateFrom: stringFilter,
  dateTo: stringFilter,
  status: stringFilter
}

const DEFAULT_FILTERS = {
  search: '',
  productId: '',
  supplierName: '',
  dateRange: null,
  status: ''
}

const DEFAULT_VISIBLE_COLUMN_KEYS = ['product', 'status', 'quantity', 'unitCost', 'totalCost', 'supplier', 'createdBy', 'note', 'createdAt', 'actions']

const VISIBLE_COLUMNS_STORAGE_KEY = 'purchaseReceipts.visibleColumns'

const getStoredVisibleColumnKeys = () => {
  try {
    const rawValue = localStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY)
    if (!rawValue) return DEFAULT_VISIBLE_COLUMN_KEYS

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue)) return DEFAULT_VISIBLE_COLUMN_KEYS

    const nextKeys = parsedValue.filter(key => DEFAULT_VISIBLE_COLUMN_KEYS.includes(key))
    const migratedKeys = ['status', 'actions'].reduce(
      (keys, key) => (keys.includes(key) ? keys : [...keys, key]),
      nextKeys.length > 0 ? nextKeys : DEFAULT_VISIBLE_COLUMN_KEYS
    )

    persistVisibleColumnKeys(migratedKeys)
    return migratedKeys
  } catch {
    return DEFAULT_VISIBLE_COLUMN_KEYS
  }
}

const persistVisibleColumnKeys = keys => {
  try {
    localStorage.setItem(VISIBLE_COLUMNS_STORAGE_KEY, JSON.stringify(keys))
  } catch {}
}

const isEnglishLanguage = language =>
  String(language || '')
    .toLowerCase()
    .startsWith('en')
const getReceiptLocale = language => (isEnglishLanguage(language) ? 'en-US' : 'vi-VN')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const firstText = (...values) => values.find(hasText) || ''

const toNumber = value => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

const getLocalizedProductTitle = (product, language, fallback = '') => {
  if (!product) return fallback

  if (isEnglishLanguage(language)) {
    return firstText(product.translations?.en?.title, product.title, fallback)
  }

  return firstText(product.title, fallback)
}

const getLocalizedReceiptProductName = (record, language, fallback = '') => {
  if (!record) return fallback

  if (isEnglishLanguage(language)) {
    return firstText(
      record.translations?.en?.productName,
      record.productId?.translations?.en?.title,
      record.displayProductName,
      record.productName,
      fallback
    )
  }

  return firstText(record.productName, record.displayProductName, record.productId?.title, fallback)
}

const getCreatedByLabel = (record, fallback) => {
  const createdBy = record?.createdBy?.by
  return firstText(createdBy?.fullName, createdBy?.email, fallback)
}

const isManualProduct = product => product?.deliveryType !== 'instant_account'

const formatNumber = (value, locale) => new Intl.NumberFormat(locale).format(toNumber(value))

const formatOptionalNumber = (value, locale, fallback) =>
  value === undefined || value === null || value === '' ? fallback : formatNumber(value, locale)

const formatCurrency = (value, locale) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(toNumber(value))

const formatReceiptDate = (value, locale, fallback) =>
  value
    ? new Date(value).toLocaleString(locale, {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : fallback

const getReceiptStatus = record => record?.status || 'active'

const isReceiptCancelled = record => getReceiptStatus(record) === 'cancelled'

const getInitialFilters = urlFilters => ({
  search: urlFilters.search || '',
  productId: urlFilters.productId || '',
  supplierName: urlFilters.supplierName || '',
  dateRange: urlFilters.dateFrom && urlFilters.dateTo ? [dayjs(urlFilters.dateFrom), dayjs(urlFilters.dateTo)] : null,
  status: urlFilters.status || ''
})

const normalizeReceiptFilters = filters => ({
  search: String(filters.search || '').trim(),
  productId: filters.productId || '',
  supplierName: String(filters.supplierName || '').trim(),
  dateFrom: filters.dateRange?.[0]?.format?.('YYYY-MM-DD') || '',
  dateTo: filters.dateRange?.[1]?.format?.('YYYY-MM-DD') || '',
  status: filters.status || ''
})

export default function PurchaseReceipts() {
  const { t, i18n } = useTranslation('adminPurchaseReceipts')
  const language = i18n.resolvedLanguage || i18n.language
  const locale = getReceiptLocale(language)
  const [form] = Form.useForm()
  const [cancelForm] = Form.useForm()
  const watchedQuantity = Form.useWatch('quantity', form)
  const watchedUnitCost = Form.useWatch('unitCost', form)
  const { page, setPage, pageSize, setPageSize, filters: urlFilters, setFilters: setUrlFilters } = useListSearchParams({
    defaultPage: 1,
    defaultPageSize: DEFAULT_PAGE_SIZE,
    filterParsers: PURCHASE_RECEIPT_FILTER_PARSERS
  })
  const [receipts, setReceipts] = useState([])
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState(() => getInitialFilters(urlFilters))
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const [showFilters, setShowFilters] = useState(true)
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(getStoredVisibleColumnKeys)
  const [loading, setLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelSubmitting, setCancelSubmitting] = useState(false)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState('')

  const manualProducts = useMemo(() => products.filter(isManualProduct), [products])

  const selectedProduct = useMemo(
    () => manualProducts.find(product => product._id === selectedProductId),
    [manualProducts, selectedProductId]
  )

  const productOptions = useMemo(
    () =>
      manualProducts.map(product => {
        const title = getLocalizedProductTitle(product, language, t('common.notAvailable'))
        const stock = toNumber(product.stock)
        const costPrice = toNumber(product.costPrice)
        const label = t('form.productStock', {
          title,
          stock: formatNumber(stock, locale),
          cost: formatCurrency(costPrice, locale)
        })

        return {
          value: product._id,
          label,
          searchLabel: `${title} ${product.slug || ''}`.toLowerCase(),
          product
        }
      }),
    [language, locale, manualProducts, t]
  )

  const productFilterOptions = useMemo(
    () =>
      manualProducts.map(product => {
        const title = getLocalizedProductTitle(product, language, t('common.notAvailable'))

        return {
          value: product._id,
          label: title,
          searchLabel: `${title} ${product.slug || ''}`.toLowerCase()
        }
      }),
    [language, manualProducts, t]
  )

  const normalizedFilters = useMemo(() => normalizeReceiptFilters({ ...filters, search: debouncedSearch }), [debouncedSearch, filters])

  const activeFilterCount = useMemo(
    () =>
      [
        normalizedFilters.search,
        normalizedFilters.productId,
        normalizedFilters.supplierName,
        normalizedFilters.dateFrom || normalizedFilters.dateTo,
        normalizedFilters.status
      ].filter(Boolean).length,
    [normalizedFilters]
  )

  const pageQuantity = useMemo(() => receipts.reduce((sum, receipt) => sum + toNumber(receipt.quantity), 0), [receipts])

  const pageTotalCost = useMemo(() => receipts.reduce((sum, receipt) => sum + toNumber(receipt.totalCost), 0), [receipts])

  const manualStock = useMemo(() => manualProducts.reduce((sum, product) => sum + toNumber(product.stock), 0), [manualProducts])

  const receiptTotal = toNumber(watchedQuantity) * toNumber(watchedUnitCost)

  const stats = useMemo(
    () => [
      {
        key: 'receipts',
        label: t('stats.receipts'),
        value: formatNumber(total, locale),
        hint: activeFilterCount > 0 ? t('stats.filteredHint') : t('stats.receiptsHint'),
        icon: ReceiptText
      },
      {
        key: 'quantity',
        label: t('stats.pageQuantity'),
        value: formatNumber(pageQuantity, locale),
        hint: t('stats.pageQuantityHint'),
        icon: Boxes
      },
      {
        key: 'value',
        label: t('stats.pageValue'),
        value: formatCurrency(pageTotalCost, locale),
        hint: t('stats.pageValueHint'),
        icon: Coins
      },
      {
        key: 'products',
        label: t('stats.manualProducts'),
        value: formatNumber(manualProducts.length, locale),
        hint: t('stats.manualProductsHint', { stock: formatNumber(manualStock, locale) }),
        icon: PackageCheck
      }
    ],
    [activeFilterCount, locale, manualProducts.length, manualStock, pageQuantity, pageTotalCost, t, total]
  )

  const fetchReceipts = useCallback(
    async (nextPage = page, nextPageSize = pageSize, nextFilters = normalizedFilters) => {
      setLoading(true)
      try {
        const response = await getPurchaseReceipts({
          page: nextPage,
          limit: nextPageSize,
          keyword: nextFilters.search,
          productId: nextFilters.productId,
          supplierName: nextFilters.supplierName,
          dateFrom: nextFilters.dateFrom,
          dateTo: nextFilters.dateTo,
          status: nextFilters.status,
          lang: language
        })
        setReceipts(response?.receipts || [])
        setTotal(response?.total || 0)
      } catch (error) {
        message.error(error?.message || t('messages.loadReceiptsError'))
      } finally {
        setLoading(false)
      }
    },
    [language, normalizedFilters, page, pageSize, t]
  )

  const fetchProducts = useCallback(async () => {
    setProductLoading(true)
    try {
      const response = await getProducts({ page: 1, limit: 1000, status: 'all' })
      setProducts(response?.products || [])
    } catch (error) {
      message.error(error?.message || t('messages.loadProductsError'))
    } finally {
      setProductLoading(false)
    }
  }, [t])

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(filters.search), 350)
    return () => clearTimeout(timeout)
  }, [filters.search])

  useEffect(() => {
    const nextUrlFilters = {
      search: filters.search,
      productId: filters.productId,
      supplierName: filters.supplierName,
      dateFrom: filters.dateRange?.[0]?.format?.('YYYY-MM-DD') || '',
      dateTo: filters.dateRange?.[1]?.format?.('YYYY-MM-DD') || '',
      status: filters.status || ''
    }
    const isSynced = Object.keys(PURCHASE_RECEIPT_FILTER_PARSERS).every(key => (urlFilters[key] || '') === (nextUrlFilters[key] || ''))

    if (!isSynced) setUrlFilters(nextUrlFilters)
  }, [filters, setUrlFilters, urlFilters])

  useEffect(() => {
    fetchReceipts()
  }, [fetchReceipts])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateFilter = (key, value) => {
    setFilters(current => ({ ...current, [key]: value }))
  }

  const handleRefresh = () => {
    fetchReceipts()
    fetchProducts()
  }

  const handleExport = () => {
    const rows = receipts.map(record => ({
      [t('table.product')]: getLocalizedReceiptProductName(record, language, t('common.notAvailable')),
      [t('table.status')]: t(`statuses.${getReceiptStatus(record)}`, getReceiptStatus(record)),
      [t('table.quantity')]: record.quantity,
      [t('table.unitCost')]: record.unitCost,
      [t('table.totalCost')]: record.totalCost,
      [t('table.supplier')]: firstText(record.supplierName, t('common.dash')),
      [t('table.createdBy')]: getCreatedByLabel(record, t('common.dash')),
      [t('table.note')]: record.note || '',
      [t('table.createdAt')]: formatReceiptDate(record.createdAt, locale, t('common.dash')),
      [t('table.cancelledAt')]: formatReceiptDate(record.cancelledAt, locale, ''),
      [t('table.cancelReason')]: record.cancelReason || ''
    }))

    if (!rows.length) {
      message.info(t('messages.exportEmpty'))
      return
    }

    const headers = Object.keys(rows[0])
    const csv = [headers.join(','), ...rows.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(','))].join('\n')
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `purchase-receipts-${dayjs().format('YYYYMMDD-HHmm')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    message.success(t('messages.exportSuccess'))
  }

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  const handlePageChange = (nextPage, nextPageSize) => {
    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize)
      return
    }

    setPage(nextPage)
  }

  const handleOpenCancelModal = receipt => {
    setCancelTarget(receipt)
    cancelForm.resetFields()
    setCancelModalOpen(true)
  }

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false)
    setCancelTarget(null)
    cancelForm.resetFields()
  }

  const handleCancelReceipt = async values => {
    if (!cancelTarget?._id) return

    setCancelSubmitting(true)
    try {
      await cancelPurchaseReceipt(cancelTarget._id, {
        reason: values.reason,
        overrideStockCheck: Boolean(values.overrideStockCheck)
      })
      message.success(t('messages.cancelSuccess'))
      handleCloseCancelModal()
      await Promise.all([fetchReceipts(page, pageSize, normalizedFilters), fetchProducts()])
    } catch (error) {
      message.error(error?.response?.error || error?.message || t('messages.cancelError'))
    } finally {
      setCancelSubmitting(false)
    }
  }

  const handleVisibleColumnsChange = nextKeys => {
    if (nextKeys.length === 0) {
      message.warning(t('messages.columnRequired'))
      return
    }

    persistVisibleColumnKeys(nextKeys)
    setVisibleColumnKeys(nextKeys)
  }

  const handleOpenCreateModal = () => {
    form.resetFields()
    setSelectedProductId('')
    setModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setModalOpen(false)
    form.resetFields()
    setSelectedProductId('')
  }

  const handleProductChange = productId => {
    setSelectedProductId(productId)
    const product = manualProducts.find(item => item._id === productId)
    const currentUnitCost = form.getFieldValue('unitCost')

    if (product && !currentUnitCost) {
      form.setFieldValue('unitCost', toNumber(product.costPrice))
    }
  }

  const handleCreate = async values => {
    setSubmitting(true)
    try {
      await createPurchaseReceipt({
        ...values,
        quantity: toNumber(values.quantity),
        unitCost: toNumber(values.unitCost)
      })
      message.success(t('messages.createSuccess'))
      handleCloseCreateModal()
      setPage(1)
      await Promise.all([fetchReceipts(1, pageSize, normalizedFilters), fetchProducts()])
    } catch (error) {
      message.error(error?.response?.error || error?.message || t('messages.createError'))
    } finally {
      setSubmitting(false)
    }
  }

  const renderDeliveryTypeTag = deliveryType => {
    if (!deliveryType) return null

    return <Tag className="admin-purchase-receipts-tag">{t(`deliveryTypes.${deliveryType}`, deliveryType)}</Tag>
  }

  const renderStatusTag = record => {
    const status = getReceiptStatus(record)
    return <Tag className={`admin-purchase-receipts-status admin-purchase-receipts-status--${status}`}>{t(`statuses.${status}`, status)}</Tag>
  }

  const renderReceiptActions = record => {
    const disabled = isReceiptCancelled(record)

    return (
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="admin-purchase-receipts-actions-dropdown"
        menu={{
          items: [
            {
              key: 'cancel',
              danger: true,
              disabled,
              icon: <XCircle className="h-4 w-4" />,
              label: disabled ? t('actions.cancelled') : t('actions.cancelReceipt')
            }
          ],
          onClick: ({ key }) => {
            if (key === 'cancel' && !disabled) handleOpenCancelModal(record)
          }
        }}
      >
        <Button type="text" className="admin-purchase-receipts-action-btn" icon={<MoreHorizontal className="h-4 w-4" />} />
      </Dropdown>
    )
  }

  const allColumns = [
    {
      title: t('table.product'),
      dataIndex: 'productName',
      key: 'product',
      width: 300,
      render: (value, record) => {
        const productName = getLocalizedReceiptProductName(record, language, value || t('common.notAvailable'))

        return (
          <div className="admin-purchase-receipts-product-cell">
            <div className="admin-purchase-receipts-product-cell__name">{productName}</div>
            <div className="admin-purchase-receipts-product-cell__meta">
              <span>
                {t('table.currentStock', {
                  stock: formatOptionalNumber(record.productId?.stock, locale, t('common.notAvailable'))
                })}
              </span>
              {renderDeliveryTypeTag(record.productId?.deliveryType)}
            </div>
          </div>
        )
      }
    },
    {
      title: t('table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (_, record) => renderStatusTag(record)
    },
    {
      title: t('table.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: value => <span className="admin-purchase-receipts-number">{formatNumber(value, locale)}</span>
    },
    {
      title: t('table.unitCost'),
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 150,
      render: value => formatCurrency(value, locale)
    },
    {
      title: t('table.totalCost'),
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 160,
      render: value => <span className="admin-purchase-receipts-money">{formatCurrency(value, locale)}</span>
    },
    {
      title: t('table.supplier'),
      dataIndex: 'supplierName',
      key: 'supplier',
      width: 170,
      render: value => firstText(value, t('common.dash'))
    },
    {
      title: t('table.createdBy'),
      dataIndex: ['createdBy', 'by'],
      key: 'createdBy',
      width: 180,
      render: (_, record) => getCreatedByLabel(record, t('common.dash'))
    },
    {
      title: t('table.note'),
      dataIndex: 'note',
      key: 'note',
      width: 220,
      render: value =>
        hasText(value) ? (
          <Tooltip title={value}>
            <span className="admin-purchase-receipts-note">{value}</span>
          </Tooltip>
        ) : (
          t('common.dash')
        )
    },
    {
      title: t('table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: value => formatReceiptDate(value, locale, t('common.dash'))
    },
    {
      title: t('table.actions'),
      key: 'actions',
      width: 96,
      align: 'right',
      render: (_, record) => renderReceiptActions(record)
    }
  ]
  const columnOptions = allColumns.map(column => ({
    label: column.title,
    value: column.key
  }))
  const visibleColumns = allColumns.filter(column => visibleColumnKeys.includes(column.key))
  const tableScrollX = visibleColumns.reduce((sum, column) => sum + toNumber(column.width || 160), 0)

  return (
    <PageShell
      seoTitle={t('seo.title')}
      className="admin-purchase-receipts-page"
      contentClassName="admin-purchase-receipts-page__inner"
      maxWidth="1280px"
    >
      <Toolbar
        className="admin-purchase-receipts-header"
        title={t('page.title')}
        titleLevel={1}
        description={t('page.description')}
        actions={
          <div className="admin-purchase-receipts-header__actions">
            <Button
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              loading={loading || productLoading}
              className="admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary"
            >
              {t('actions.refresh')}
            </Button>
            <Button
              icon={<ReceiptText className="h-4 w-4" />}
              onClick={handleExport}
              className="admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary"
            >
              {t('actions.export')}
            </Button>
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              dropdownRender={() => (
                <div className="admin-purchase-receipts-column-menu">
                  <div className="admin-purchase-receipts-column-menu__title">{t('columns.title')}</div>
                  <Checkbox.Group
                    value={visibleColumnKeys}
                    options={columnOptions}
                    onChange={handleVisibleColumnsChange}
                    className="admin-purchase-receipts-column-menu__group"
                  />
                </div>
              )}
            >
              <Button
                icon={<Table2 className="h-4 w-4" />}
                className="admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary"
              >
                {t('actions.columns')}
              </Button>
            </Dropdown>
            <Button
              icon={<Filter className="h-4 w-4" />}
              onClick={() => setShowFilters(current => !current)}
              className="admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary"
            >
              {t('actions.filter')}
            </Button>
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleOpenCreateModal}
              disabled={productLoading || manualProducts.length === 0}
              className="admin-purchase-receipts-btn admin-purchase-receipts-btn--primary"
            >
              {t('actions.create')}
            </Button>
          </div>
        }
      />

      <StatGrid columns={4} className="admin-purchase-receipts-stats" aria-label={t('stats.ariaLabel')}>
        {stats.map(item => (
          <StatCard
            key={item.key}
            className="admin-purchase-receipts-stat-card"
            label={item.label}
            value={item.value}
            meta={item.hint}
            icon={item.icon}
          />
        ))}
      </StatGrid>

      <TableShell
        className="admin-purchase-receipts-card"
        title={t('table.title')}
        description={t('table.description')}
        extra={<div className="admin-purchase-receipts-card__count">{t('table.resultCount', { count: formatNumber(total, locale) })}</div>}
        bodyClassName="admin-purchase-receipts-card__body"
      >
        <SearchInput
          value={filters.search}
          onChange={event => updateFilter('search', event.target.value)}
          onClear={() => updateFilter('search', '')}
          placeholder={t('actions.searchPlaceholder')}
          className="admin-purchase-receipts-search-input h-10"
        />

        {showFilters ? (
          <div className="admin-purchase-receipts-filters">
          <div className="admin-purchase-receipts-filters__title">
            <Filter className="h-4 w-4" />
            <span>{t('filters.title')}</span>
            {activeFilterCount > 0 && (
              <span className="admin-purchase-receipts-filters__badge">{t('filters.activeCount', { count: activeFilterCount })}</span>
            )}
          </div>

          <div className="admin-purchase-receipts-filters__grid">
            <Select
              allowClear
              value={filters.status || undefined}
              options={[
                { value: 'active', label: t('statuses.active') },
                { value: 'cancelled', label: t('statuses.cancelled') }
              ]}
              placeholder={t('filters.statusPlaceholder')}
              popupClassName="admin-purchase-receipts-select-dropdown"
              onChange={value => updateFilter('status', value || '')}
              className="admin-purchase-receipts-select admin-purchase-receipts-filter-control"
            />

            <Select
              allowClear
              showSearch
              value={filters.productId || undefined}
              options={productFilterOptions}
              placeholder={t('filters.productPlaceholder')}
              popupClassName="admin-purchase-receipts-select-dropdown"
              filterOption={(input, option) => {
                const needle = input.trim().toLowerCase()
                if (!needle) return true

                return String(option?.searchLabel || option?.label || '')
                  .toLowerCase()
                  .includes(needle)
              }}
              onChange={value => updateFilter('productId', value || '')}
              className="admin-purchase-receipts-select admin-purchase-receipts-filter-control"
            />

            <Input
              value={filters.supplierName}
              placeholder={t('filters.supplierPlaceholder')}
              onChange={event => updateFilter('supplierName', event.target.value)}
              className="admin-purchase-receipts-input admin-purchase-receipts-filter-control"
            />

            <RangePicker
              value={filters.dateRange}
              onChange={dateRange => updateFilter('dateRange', dateRange)}
              className="admin-purchase-receipts-date-range admin-purchase-receipts-filter-control"
              popupClassName="admin-purchase-receipts-date-popup"
              placeholder={[t('filters.dateFrom'), t('filters.dateTo')]}
              format="DD/MM/YYYY"
            />

            <div className="admin-purchase-receipts-filters__actions">
              <Button
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={handleClearFilters}
                className="admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary"
              >
                {t('filters.clear')}
              </Button>
            </div>
          </div>
        </div>
        ) : null}

        <div className="admin-purchase-receipts-table-wrap">
          <Table
            rowKey="_id"
            loading={loading}
            columns={visibleColumns}
            dataSource={receipts}
            className="admin-purchase-receipts-table"
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_OPTIONS,
              showTotal: count => t('table.resultCount', { count: formatNumber(count, locale) }),
              onChange: handlePageChange
            }}
            locale={{
              emptyText: t('table.empty')
            }}
            scroll={{ x: Math.max(tableScrollX, 640) }}
            summary={() =>
              receipts.length > 0 ? (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    {visibleColumns.map((column, index) => (
                      <Table.Summary.Cell index={index} key={column.key}>
                        {index === 0 && <span className="admin-purchase-receipts-summary-label">{t('table.visibleSummary')}</span>}
                        {index !== 0 && column.key === 'quantity' && (
                          <span className="admin-purchase-receipts-number">{formatNumber(pageQuantity, locale)}</span>
                        )}
                        {index !== 0 && column.key === 'totalCost' && (
                          <span className="admin-purchase-receipts-money">{formatCurrency(pageTotalCost, locale)}</span>
                        )}
                      </Table.Summary.Cell>
                    ))}
                  </Table.Summary.Row>
                </Table.Summary>
              ) : null
            }
          />
        </div>

        <div className="admin-purchase-receipts-card-list">
          {loading && <div className="admin-purchase-receipts-card-state">{t('table.loading')}</div>}

          {!loading && receipts.length === 0 && <div className="admin-purchase-receipts-card-state">{t('table.empty')}</div>}

          {!loading &&
            receipts.map(record => {
              const productName = getLocalizedReceiptProductName(record, language, t('common.notAvailable'))

              return (
                <article className="admin-purchase-receipts-receipt-card" key={record._id}>
                  <div className="admin-purchase-receipts-receipt-card__top">
                    <div>
                      <h3 className="admin-purchase-receipts-receipt-card__title">{productName}</h3>
                      <p className="admin-purchase-receipts-receipt-card__date">
                        {formatReceiptDate(record.createdAt, locale, t('common.dash'))}
                      </p>
                    </div>
                    <div className="admin-purchase-receipts-receipt-card__side">
                      {renderStatusTag(record)}
                      <span className="admin-purchase-receipts-receipt-card__amount">{formatCurrency(record.totalCost, locale)}</span>
                    </div>
                  </div>

                  <div className="admin-purchase-receipts-receipt-card__grid">
                    <div>
                      <span>{t('table.quantity')}</span>
                      <strong>{formatNumber(record.quantity, locale)}</strong>
                    </div>
                    <div>
                      <span>{t('table.unitCost')}</span>
                      <strong>{formatCurrency(record.unitCost, locale)}</strong>
                    </div>
                    <div>
                      <span>{t('table.supplier')}</span>
                      <strong>{firstText(record.supplierName, t('common.dash'))}</strong>
                    </div>
                    <div>
                      <span>{t('table.createdBy')}</span>
                      <strong>{getCreatedByLabel(record, t('common.dash'))}</strong>
                    </div>
                  </div>

                  {hasText(record.note) && (
                    <p className="admin-purchase-receipts-receipt-card__note">
                      <StickyNote className="h-4 w-4" />
                      <span>{record.note}</span>
                    </p>
                  )}

                  {!isReceiptCancelled(record) && (
                    <Button
                      danger
                      icon={<XCircle className="h-4 w-4" />}
                      onClick={() => handleOpenCancelModal(record)}
                      className="admin-purchase-receipts-receipt-card__cancel"
                    >
                      {t('actions.cancelReceipt')}
                    </Button>
                  )}
                </article>
              )
            })}

          {!loading && receipts.length > 0 && (
            <Pagination
              className="admin-purchase-receipts-card-pagination"
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onChange={handlePageChange}
            />
          )}
        </div>
      </TableShell>

      <Modal
        title={
          <div className="admin-purchase-receipts-modal__title-wrap">
            <span className="admin-purchase-receipts-modal__title-icon admin-purchase-receipts-modal__title-icon--danger" aria-hidden="true">
              <XCircle className="h-5 w-5" />
            </span>
            <div>
              <div className="admin-purchase-receipts-modal__title">{t('cancel.title')}</div>
              <div className="admin-purchase-receipts-modal__subtitle">
                {cancelTarget ? t('cancel.subtitle', { product: getLocalizedReceiptProductName(cancelTarget, language, t('common.notAvailable')) }) : t('cancel.subtitleFallback')}
              </div>
            </div>
          </div>
        }
        open={cancelModalOpen}
        onCancel={handleCloseCancelModal}
        onOk={() => cancelForm.submit()}
        confirmLoading={cancelSubmitting}
        okText={t('cancel.confirm')}
        cancelText={t('common.cancel')}
        wrapClassName="admin-purchase-receipts-modal"
        okButtonProps={{ danger: true }}
        destroyOnClose
        style={{ top: 72 }}
      >
        <Form form={cancelForm} layout="vertical" onFinish={handleCancelReceipt} preserve={false}>
          <Form.Item label={t('cancel.reason')} name="reason" rules={[{ required: true, message: t('cancel.reasonRequired') }]}>
            <Input.TextArea rows={3} placeholder={t('cancel.reasonPlaceholder')} className="admin-purchase-receipts-input" />
          </Form.Item>
          <Form.Item name="overrideStockCheck" valuePropName="checked">
            <Checkbox>{t('cancel.overrideStockCheck')}</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div className="admin-purchase-receipts-modal__title-wrap">
            <span className="admin-purchase-receipts-modal__title-icon" aria-hidden="true">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <div className="admin-purchase-receipts-modal__title">{t('form.title')}</div>
              <div className="admin-purchase-receipts-modal__subtitle">{t('form.subtitle')}</div>
            </div>
          </div>
        }
        open={modalOpen}
        onCancel={handleCloseCreateModal}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={t('actions.createShort')}
        cancelText={t('common.cancel')}
        wrapClassName="admin-purchase-receipts-modal"
        okButtonProps={{
          className: 'admin-purchase-receipts-btn admin-purchase-receipts-btn--primary'
        }}
        cancelButtonProps={{
          className: 'admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary'
        }}
        destroyOnClose
        style={{ top: 48 }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} preserve={false}>
          <Form.Item label={t('form.manualProduct')} name="productId" rules={[{ required: true, message: t('form.productRequired') }]}>
            <Select
              showSearch
              loading={productLoading}
              placeholder={productLoading ? t('form.productLoading') : t('form.selectProduct')}
              options={productOptions}
              popupClassName="admin-purchase-receipts-select-dropdown"
              filterOption={(input, option) => {
                const needle = input.trim().toLowerCase()
                if (!needle) return true

                return String(option?.searchLabel || option?.label || '')
                  .toLowerCase()
                  .includes(needle)
              }}
              notFoundContent={t('form.noManualProducts')}
              onChange={handleProductChange}
              className="admin-purchase-receipts-select"
            />
          </Form.Item>

          <div className="admin-purchase-receipts-modal__product-preview">
            {selectedProduct ? (
              <>
                <div>
                  <span>{t('form.currentStock')}</span>
                  <strong>{formatNumber(selectedProduct.stock, locale)}</strong>
                </div>
                <div>
                  <span>{t('form.currentCost')}</span>
                  <strong>{formatCurrency(selectedProduct.costPrice, locale)}</strong>
                </div>
                <div>
                  <span>{t('form.afterStock')}</span>
                  <strong>{formatNumber(toNumber(selectedProduct.stock) + toNumber(watchedQuantity), locale)}</strong>
                </div>
              </>
            ) : (
              <p>{t('form.productPreviewEmpty')}</p>
            )}
          </div>

          <div className="admin-purchase-receipts-modal__grid">
            <Form.Item
              label={t('form.quantity')}
              name="quantity"
              rules={[
                { required: true, message: t('form.quantityRequired') },
                { type: 'number', min: 1, message: t('form.quantityMin') }
              ]}
            >
              <InputNumber min={1} precision={0} className="admin-purchase-receipts-input-number w-full" />
            </Form.Item>

            <Form.Item
              label={t('form.unitCost')}
              name="unitCost"
              rules={[
                { required: true, message: t('form.unitCostRequired') },
                { type: 'number', min: 0, message: t('form.unitCostMin') }
              ]}
            >
              <InputNumber
                min={0}
                precision={0}
                className="admin-purchase-receipts-input-number w-full"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/,/g, '') || ''}
              />
            </Form.Item>
          </div>

          <div className="admin-purchase-receipts-modal__total-preview">
            <div>
              <span>{t('form.totalPreview')}</span>
              <strong>{formatCurrency(receiptTotal, locale)}</strong>
            </div>
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="admin-purchase-receipts-modal__grid">
            <Form.Item label={t('form.supplier')} name="supplierName">
              <Input
                maxLength={120}
                prefix={<UserRound className="h-4 w-4 text-[var(--purchase-receipts-text-subtle)]" />}
                placeholder={t('form.supplierPlaceholder')}
                className="admin-purchase-receipts-input"
              />
            </Form.Item>

            <Form.Item label={t('form.note')} name="note">
              <Input.TextArea rows={3} maxLength={500} placeholder={t('form.notePlaceholder')} className="admin-purchase-receipts-input" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </PageShell>
  )
}
