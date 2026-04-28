import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, DatePicker, Dropdown, Form, Input, InputNumber, Modal, Pagination, Select, Table, Tag, Tooltip, message } from 'antd'
import {
  Boxes,
  Calculator,
  ClipboardList,
  Columns3,
  Coins,
  Filter,
  PackageCheck,
  Plus,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  StickyNote,
  UserRound
} from 'lucide-react'
import SEO from '@/components/SEO'
import { getAdminProducts } from '@/services/adminProductService'
import { createPurchaseReceipt, getPurchaseReceipts } from '@/services/adminPurchaseReceiptService'
import { useTranslation } from 'react-i18next'
import './AdminPurchaseReceiptsPage.scss'

const PAGE_LIMIT = 20
const { RangePicker } = DatePicker

const DEFAULT_FILTERS = {
  productId: '',
  supplierName: '',
  dateRange: null
}

const DEFAULT_VISIBLE_COLUMN_KEYS = [
  'product',
  'quantity',
  'unitCost',
  'totalCost',
  'supplier',
  'createdBy',
  'note',
  'createdAt'
]

const VISIBLE_COLUMNS_STORAGE_KEY = 'adminPurchaseReceipts.visibleColumns'

const getStoredVisibleColumnKeys = () => {
  try {
    const rawValue = localStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY)
    if (!rawValue) return DEFAULT_VISIBLE_COLUMN_KEYS

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue)) return DEFAULT_VISIBLE_COLUMN_KEYS

    const nextKeys = parsedValue.filter(key => DEFAULT_VISIBLE_COLUMN_KEYS.includes(key))
    return nextKeys.length > 0 ? nextKeys : DEFAULT_VISIBLE_COLUMN_KEYS
  } catch {
    return DEFAULT_VISIBLE_COLUMN_KEYS
  }
}

const persistVisibleColumnKeys = keys => {
  try {
    localStorage.setItem(VISIBLE_COLUMNS_STORAGE_KEY, JSON.stringify(keys))
  } catch {}
}

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')
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

const formatOptionalNumber = (value, locale, fallback) => (
  value === undefined || value === null || value === ''
    ? fallback
    : formatNumber(value, locale)
)

const formatCurrency = (value, locale) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(toNumber(value))

const formatReceiptDate = (value, locale, fallback) => (
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
)

const normalizeReceiptFilters = filters => ({
  productId: filters.productId || '',
  supplierName: String(filters.supplierName || '').trim(),
  dateFrom: filters.dateRange?.[0]?.format?.('YYYY-MM-DD') || '',
  dateTo: filters.dateRange?.[1]?.format?.('YYYY-MM-DD') || ''
})

export default function AdminPurchaseReceiptsPage() {
  const { t, i18n } = useTranslation('adminPurchaseReceipts')
  const language = i18n.resolvedLanguage || i18n.language
  const locale = getReceiptLocale(language)
  const [form] = Form.useForm()
  const watchedQuantity = Form.useWatch('quantity', form)
  const watchedUnitCost = Form.useWatch('unitCost', form)
  const [receipts, setReceipts] = useState([])
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [filterDraft, setFilterDraft] = useState(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(getStoredVisibleColumnKeys)
  const [loading, setLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')

  const manualProducts = useMemo(() => products.filter(isManualProduct), [products])

  const selectedProduct = useMemo(
    () => manualProducts.find(product => product._id === selectedProductId),
    [manualProducts, selectedProductId]
  )

  const productOptions = useMemo(
    () => manualProducts.map(product => {
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
    () => manualProducts.map(product => {
      const title = getLocalizedProductTitle(product, language, t('common.notAvailable'))

      return {
        value: product._id,
        label: title,
        searchLabel: `${title} ${product.slug || ''}`.toLowerCase()
      }
    }),
    [language, manualProducts, t]
  )

  const normalizedAppliedFilters = useMemo(
    () => normalizeReceiptFilters(appliedFilters),
    [appliedFilters]
  )

  const activeFilterCount = useMemo(
    () => [
      keyword,
      normalizedAppliedFilters.productId,
      normalizedAppliedFilters.supplierName,
      normalizedAppliedFilters.dateFrom || normalizedAppliedFilters.dateTo
    ].filter(Boolean).length,
    [keyword, normalizedAppliedFilters]
  )

  const pageQuantity = useMemo(
    () => receipts.reduce((sum, receipt) => sum + toNumber(receipt.quantity), 0),
    [receipts]
  )

  const pageTotalCost = useMemo(
    () => receipts.reduce((sum, receipt) => sum + toNumber(receipt.totalCost), 0),
    [receipts]
  )

  const manualStock = useMemo(
    () => manualProducts.reduce((sum, product) => sum + toNumber(product.stock), 0),
    [manualProducts]
  )

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

  const fetchReceipts = useCallback(async (nextPage = 1, nextKeyword = '', nextFilters = DEFAULT_FILTERS) => {
    setLoading(true)
    try {
      const normalizedFilters = normalizeReceiptFilters(nextFilters)
      const response = await getPurchaseReceipts({
        page: nextPage,
        limit: PAGE_LIMIT,
        keyword: nextKeyword.trim(),
        ...normalizedFilters,
        lang: language
      })
      setReceipts(response?.receipts || [])
      setTotal(response?.total || 0)
    } catch (error) {
      message.error(error?.message || t('messages.loadReceiptsError'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  const fetchProducts = useCallback(async () => {
    setProductLoading(true)
    try {
      const response = await getAdminProducts({ page: 1, limit: 1000, status: 'all' })
      setProducts(response?.products || [])
    } catch (error) {
      message.error(error?.message || t('messages.loadProductsError'))
    } finally {
      setProductLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchReceipts(1, '')
    fetchProducts()
  }, [fetchProducts, fetchReceipts])

  const handleSearch = value => {
    const nextKeyword = value.trim()
    setSearchValue(nextKeyword)
    setKeyword(nextKeyword)
    setPage(1)
    fetchReceipts(1, nextKeyword, appliedFilters)
  }

  const handleSearchChange = event => {
    const nextValue = event.target.value
    setSearchValue(nextValue)

    if (!nextValue && keyword) {
      setKeyword('')
      setPage(1)
      fetchReceipts(1, '', appliedFilters)
    }
  }

  const handleRefresh = () => {
    fetchReceipts(page, keyword, appliedFilters)
    fetchProducts()
  }

  const handleApplyFilters = () => {
    setAppliedFilters(filterDraft)
    setPage(1)
    fetchReceipts(1, keyword, filterDraft)
  }

  const handleClearFilters = () => {
    setFilterDraft(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setSearchValue('')
    setKeyword('')
    setPage(1)
    fetchReceipts(1, '', DEFAULT_FILTERS)
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
      await Promise.all([fetchReceipts(1, keyword, appliedFilters), fetchProducts()])
      setPage(1)
    } catch (error) {
      message.error(error?.response?.error || error?.message || t('messages.createError'))
    } finally {
      setSubmitting(false)
    }
  }

  const renderDeliveryTypeTag = deliveryType => {
    if (!deliveryType) return null

    return (
      <Tag className="admin-purchase-receipts-tag">
        {t(`deliveryTypes.${deliveryType}`, deliveryType)}
      </Tag>
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
      render: value => (
        hasText(value)
          ? (
            <Tooltip title={value}>
              <span className="admin-purchase-receipts-note">{value}</span>
            </Tooltip>
          )
          : t('common.dash')
      )
    },
    {
      title: t('table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: value => formatReceiptDate(value, locale, t('common.dash'))
    }
  ]
  const columnOptions = allColumns.map(column => ({
    label: column.title,
    value: column.key
  }))
  const visibleColumns = allColumns.filter(column => visibleColumnKeys.includes(column.key))
  const tableScrollX = visibleColumns.reduce((sum, column) => sum + toNumber(column.width || 160), 0)

  return (
    <div className="admin-purchase-receipts-page min-h-screen rounded-xl p-3 sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-purchase-receipts-page__inner mx-auto max-w-7xl space-y-5">
        <header className="admin-purchase-receipts-header">
          <div>
            <h1 className="admin-purchase-receipts-header__title">{t('page.title')}</h1>
            <p className="admin-purchase-receipts-header__desc">{t('page.description')}</p>
          </div>

          <Button
            type="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreateModal}
            disabled={productLoading || manualProducts.length === 0}
            className="admin-purchase-receipts-btn admin-purchase-receipts-btn--primary"
          >
            {t('actions.create')}
          </Button>
        </header>

        <section className="admin-purchase-receipts-stats" aria-label={t('stats.ariaLabel')}>
          {stats.map(item => {
            const Icon = item.icon

            return (
              <article className="admin-purchase-receipts-stat-card" key={item.key}>
                <div>
                  <p className="admin-purchase-receipts-stat-card__label">{item.label}</p>
                  <p className="admin-purchase-receipts-stat-card__value">{item.value}</p>
                  <p className="admin-purchase-receipts-stat-card__hint">{item.hint}</p>
                </div>
                <span className="admin-purchase-receipts-stat-card__icon" aria-hidden="true">
                  <Icon className="h-5 w-5" />
                </span>
              </article>
            )
          })}
        </section>

        <section className="admin-purchase-receipts-card">
          <div className="admin-purchase-receipts-card__head">
            <div>
              <h2 className="admin-purchase-receipts-card__title">{t('table.title')}</h2>
              <p className="admin-purchase-receipts-card__desc">{t('table.description')}</p>
            </div>
            <div className="admin-purchase-receipts-card__count">
              {t('table.resultCount', { count: formatNumber(total, locale) })}
            </div>
          </div>

          <div className="admin-purchase-receipts-toolbar">
            <Input.Search
              className="admin-purchase-receipts-search"
              allowClear
              value={searchValue}
              prefix={<Search className="h-4 w-4 text-[var(--purchase-receipts-text-subtle)]" />}
              placeholder={t('actions.searchPlaceholder')}
              enterButton={t('actions.search')}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />

            <div className="admin-purchase-receipts-toolbar__actions">
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
                  icon={<Columns3 className="h-4 w-4" />}
                  className="admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary"
                >
                  {t('actions.columns')}
                </Button>
              </Dropdown>

              <Button
                icon={<RefreshCw className="h-4 w-4" />}
                onClick={handleRefresh}
                loading={loading || productLoading}
                className="admin-purchase-receipts-btn admin-purchase-receipts-btn--secondary"
              >
                {t('actions.refresh')}
              </Button>
            </div>
          </div>

          <div className="admin-purchase-receipts-filters">
            <div className="admin-purchase-receipts-filters__title">
              <Filter className="h-4 w-4" />
              <span>{t('filters.title')}</span>
              {activeFilterCount > 0 && (
                <span className="admin-purchase-receipts-filters__badge">
                  {t('filters.activeCount', { count: activeFilterCount })}
                </span>
              )}
            </div>

            <div className="admin-purchase-receipts-filters__grid">
              <Select
                allowClear
                showSearch
                value={filterDraft.productId || undefined}
                options={productFilterOptions}
                placeholder={t('filters.productPlaceholder')}
                popupClassName="admin-purchase-receipts-select-dropdown"
                filterOption={(input, option) => {
                  const needle = input.trim().toLowerCase()
                  if (!needle) return true

                  return String(option?.searchLabel || option?.label || '').toLowerCase().includes(needle)
                }}
                onChange={value => setFilterDraft(current => ({ ...current, productId: value || '' }))}
                className="admin-purchase-receipts-select admin-purchase-receipts-filter-control"
              />

              <Input
                value={filterDraft.supplierName}
                placeholder={t('filters.supplierPlaceholder')}
                onChange={event => setFilterDraft(current => ({ ...current, supplierName: event.target.value }))}
                onPressEnter={handleApplyFilters}
                className="admin-purchase-receipts-input admin-purchase-receipts-filter-control"
              />

              <RangePicker
                value={filterDraft.dateRange}
                onChange={dateRange => setFilterDraft(current => ({ ...current, dateRange }))}
                className="admin-purchase-receipts-date-range admin-purchase-receipts-filter-control"
                popupClassName="admin-purchase-receipts-date-popup"
                placeholder={[t('filters.dateFrom'), t('filters.dateTo')]}
                format="DD/MM/YYYY"
              />

              <div className="admin-purchase-receipts-filters__actions">
                <Button
                  icon={<Filter className="h-4 w-4" />}
                  onClick={handleApplyFilters}
                  className="admin-purchase-receipts-btn admin-purchase-receipts-btn--primary"
                >
                  {t('filters.apply')}
                </Button>
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

          <div className="admin-purchase-receipts-table-wrap">
            <Table
              rowKey="_id"
              loading={loading}
              columns={visibleColumns}
              dataSource={receipts}
              className="admin-purchase-receipts-table"
              pagination={{
                current: page,
                pageSize: PAGE_LIMIT,
                total,
                showSizeChanger: false,
                showTotal: count => t('table.resultCount', { count: formatNumber(count, locale) }),
                onChange: nextPage => {
                  setPage(nextPage)
                  fetchReceipts(nextPage, keyword, appliedFilters)
                }
              }}
              locale={{
                emptyText: t('table.empty')
              }}
              scroll={{ x: Math.max(tableScrollX, 640) }}
              summary={() => (
                receipts.length > 0
                  ? (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        {visibleColumns.map((column, index) => (
                          <Table.Summary.Cell index={index} key={column.key}>
                            {index === 0 && (
                              <span className="admin-purchase-receipts-summary-label">{t('table.visibleSummary')}</span>
                            )}
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
                  )
                  : null
              )}
            />
          </div>

          <div className="admin-purchase-receipts-card-list">
            {loading && (
              <div className="admin-purchase-receipts-card-state">{t('table.loading')}</div>
            )}

            {!loading && receipts.length === 0 && (
              <div className="admin-purchase-receipts-card-state">{t('table.empty')}</div>
            )}

            {!loading && receipts.map(record => {
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
                    <span className="admin-purchase-receipts-receipt-card__amount">
                      {formatCurrency(record.totalCost, locale)}
                    </span>
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
                </article>
              )
            })}

            {!loading && receipts.length > 0 && (
              <Pagination
                className="admin-purchase-receipts-card-pagination"
                current={page}
                pageSize={PAGE_LIMIT}
                total={total}
                showSizeChanger={false}
                onChange={nextPage => {
                  setPage(nextPage)
                  fetchReceipts(nextPage, keyword, appliedFilters)
                }}
              />
            )}
          </div>
        </section>
      </div>

      <Modal
        title={(
          <div className="admin-purchase-receipts-modal__title-wrap">
            <span className="admin-purchase-receipts-modal__title-icon" aria-hidden="true">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <div className="admin-purchase-receipts-modal__title">{t('form.title')}</div>
              <div className="admin-purchase-receipts-modal__subtitle">{t('form.subtitle')}</div>
            </div>
          </div>
        )}
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
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} preserve={false}>
          <Form.Item
            label={t('form.manualProduct')}
            name="productId"
            rules={[{ required: true, message: t('form.productRequired') }]}
          >
            <Select
              showSearch
              loading={productLoading}
              placeholder={productLoading ? t('form.productLoading') : t('form.selectProduct')}
              options={productOptions}
              popupClassName="admin-purchase-receipts-select-dropdown"
              dropdownStyle={{ zIndex: 1240 }}
              filterOption={(input, option) => {
                const needle = input.trim().toLowerCase()
                if (!needle) return true

                return String(option?.searchLabel || option?.label || '').toLowerCase().includes(needle)
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
              <Input.TextArea
                rows={3}
                maxLength={500}
                placeholder={t('form.notePlaceholder')}
                className="admin-purchase-receipts-input"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
