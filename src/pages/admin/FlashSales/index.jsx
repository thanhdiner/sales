import { useEffect, useMemo, useState } from 'react'
import { DownloadOutlined, FilterOutlined, PlusOutlined, ReloadOutlined, TableOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Dropdown, Modal, Select, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import SEO from '@/components/shared/SEO'
import SearchInput from '@/components/shared/SearchInput'
import FlashSaleFormModal from './components/FlashSaleFormModal'
import FlashSalesTable from './components/FlashSalesTable'
import FlashSaleStats from './components/FlashSaleStats'
import { useFlashSalesData } from './hooks/useFlashSalesData'
import { useFlashSaleForm } from './hooks/useFlashSaleForm'
import { getLocalizedFlashSaleName, validateFlashSaleForm } from './utils/flashSaleHelpers'
import './index.scss'

const DEFAULT_PAGE_SIZE = 10
const FLASH_SALES_COLUMNS_STORAGE_KEY = 'adminFlashSalesColumnsVisible'
const DEFAULT_COLUMNS_VISIBLE = {
  name: true,
  time: true,
  discount: true,
  quantity: true,
  status: true,
  revenue: true,
  actions: true
}
const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  dateRange: null
}
const FLASH_SALES_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function getStoredColumnsVisible() {
  try {
    const stored = JSON.parse(localStorage.getItem(FLASH_SALES_COLUMNS_STORAGE_KEY))
    return { ...DEFAULT_COLUMNS_VISIBLE, ...stored, actions: true }
  } catch {
    return DEFAULT_COLUMNS_VISIBLE
  }
}

function getInitialFilters(searchParams) {
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  return {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || DEFAULT_FILTERS.status,
    dateRange: startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null
  }
}

function fuzzyIncludes(source, query) {
  const normalizedSource = String(source || '').toLowerCase()
  const normalizedQuery = String(query || '').trim().toLowerCase()
  let sourceIndex = 0

  if (!normalizedQuery) return true

  for (const char of normalizedQuery) {
    sourceIndex = normalizedSource.indexOf(char, sourceIndex)
    if (sourceIndex === -1) return false
    sourceIndex += 1
  }

  return true
}

const FlashSale = () => {
  const { t, i18n } = useTranslation('adminFlashSales')
  const language = i18n.resolvedLanguage || i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const { flashSales, tableLoading, submitLoading, fetchFlashSales, submitFlashSale, deleteFlashSaleItem } = useFlashSalesData()
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1)
  const [pageSize, setPageSize] = useState(() => Number(searchParams.get('show')) || DEFAULT_PAGE_SIZE)
  const [filters, setFilters] = useState(() => getInitialFilters(searchParams))
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const [showFilters, setShowFilters] = useState(true)
  const [columnsVisible, setColumnsVisible] = useState(getStoredColumnsVisible)
  const {
    showModal,
    editingItem,
    formData,
    productList,
    productLoading,
    openCreate,
    openEdit,
    openDuplicate,
    closeModal,
    handleChange,
    handleSearchProduct
  } = useFlashSaleForm()

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(filters.search), 350)
    return () => clearTimeout(timeout)
  }, [filters.search])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    const [startDate, endDate] = Array.isArray(filters.dateRange) ? filters.dateRange : []

    if (currentPage > 1) params.set('page', String(currentPage))
    else params.delete('page')

    if (pageSize !== DEFAULT_PAGE_SIZE) params.set('show', String(pageSize))
    else params.delete('show')

    Object.entries({
      search: filters.search,
      status: filters.status !== DEFAULT_FILTERS.status ? filters.status : '',
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : ''
    }).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })

    setSearchParams(params, { replace: true })
  }, [currentPage, filters, pageSize, setSearchParams])

  useEffect(() => {
    localStorage.setItem(FLASH_SALES_COLUMNS_STORAGE_KEY, JSON.stringify(columnsVisible))
  }, [columnsVisible])

  const filteredFlashSales = useMemo(() => {
    const [startDate, endDate] = Array.isArray(filters.dateRange) ? filters.dateRange : []

    return flashSales.filter(sale => {
      const name = getLocalizedFlashSaleName(sale, language, sale?.name || '')
      const matchesSearch = fuzzyIncludes(`${name} ${sale?.name || ''}`, debouncedSearch)
      const matchesStatus = filters.status === 'all' || sale.status === filters.status
      const saleStartAt = sale.startAt ? dayjs(sale.startAt) : null
      const matchesDate = !startDate || !endDate || (saleStartAt && saleStartAt.isAfter(startDate.startOf('day')) && saleStartAt.isBefore(endDate.endOf('day')))

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [debouncedSearch, filters.dateRange, filters.status, flashSales, language])

  const paginatedFlashSales = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredFlashSales.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredFlashSales, pageSize])

  const updateFilters = nextFilters => {
    setFilters(nextFilters)
    setCurrentPage(1)
  }

  const clearFilters = () => updateFilters(DEFAULT_FILTERS)

  const handleExport = () => {
    const rows = filteredFlashSales.map(sale => ({
      [t('table.columns.name')]: getLocalizedFlashSaleName(sale, language, sale?.name || t('table.fallbackName')),
      [t('table.columns.time')]: `${sale.startAt || ''} - ${sale.endAt || ''}`,
      [t('table.columns.discount')]: sale.discountPercent,
      [t('table.columns.quantity')]: `${sale.soldQuantity || 0}/${sale.maxQuantity || 0}`,
      [t('table.columns.status')]: sale.status,
      [t('table.columns.revenue')]: sale.revenue || 0
    }))

    if (!rows.length) return

    const headers = Object.keys(rows[0])
    const csv = [headers.join(','), ...rows.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(','))].join('\n')
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `flash-sales-${dayjs().format('YYYYMMDD-HHmm')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDelete = id => {
    Modal.confirm({
      className: 'admin-flash-sales-confirm-modal',
      maskStyle: FLASH_SALES_CONFIRM_MASK_STYLE,
      title: <span>{t('confirmDelete.title')}</span>,
      content: <span>{t('confirmDelete.content')}</span>,
      okText: t('confirmDelete.ok'),
      cancelText: t('confirmDelete.cancel'),
      okType: 'danger',
      onOk: () => deleteFlashSaleItem(id)
    })
  }

  const handleSubmit = async () => {
    const validationError = validateFlashSaleForm(formData, t)

    if (validationError) {
      message.warning(validationError)
      return
    }

    const isSuccess = await submitFlashSale({ editingItem, formData })

    if (isSuccess) closeModal()
  }

  const renderCreateButton = () => (
    <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className="admin-flash-sales-btn admin-flash-sales-btn--add">
      <span>{t('actions.create')}</span>
    </Button>
  )

  const columnKeys = Object.keys(DEFAULT_COLUMNS_VISIBLE)
  const columnMenu = (
    <div className="admin-flash-sales-column-menu">
      <div className="admin-flash-sales-column-menu__title">{t('columnMenu.title')}</div>
      <Checkbox.Group
        value={columnKeys.filter(key => columnsVisible[key])}
        onChange={checkedValues => {
          const nextColumnsVisible = {}
          columnKeys.forEach(key => {
            nextColumnsVisible[key] = key === 'actions' || checkedValues.includes(key)
          })
          setColumnsVisible(nextColumnsVisible)
        }}
      >
        <div className="admin-flash-sales-column-menu__grid">
          {columnKeys.map(key => (
            <label key={key} className="admin-flash-sales-column-menu__item">
              <Checkbox value={key} disabled={key === 'actions'} />
              <span>{t(`table.columns.${key}`)}</span>
            </label>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  )

  return (
    <div className="admin-flash-sales-page min-h-screen">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-flash-sales-page__inner mx-auto max-w-7xl">
        <div className="admin-flash-sales-header">
          <div className="min-w-0">
            <h1 className="mb-0 text-xl font-semibold leading-tight text-[var(--admin-text)]">
              {t('page.title')}
            </h1>
          </div>

          <div className="admin-flash-sales-toolbar">
            <Button className="admin-flash-sales-btn" icon={<ReloadOutlined spin={tableLoading} />} onClick={fetchFlashSales}>{t('actions.refresh')}</Button>
            <Button className="admin-flash-sales-btn" icon={<DownloadOutlined />} onClick={handleExport}>{t('actions.export')}</Button>
            <Dropdown dropdownRender={() => columnMenu} trigger={['click']} placement="bottomRight" arrow>
              <Button className="admin-flash-sales-btn" icon={<TableOutlined />}>{t('actions.toggleColumns')}</Button>
            </Dropdown>
            <Button className="admin-flash-sales-btn" icon={<FilterOutlined />} onClick={() => setShowFilters(prev => !prev)}>{t('actions.filter')}</Button>
            {renderCreateButton()}
          </div>

          <div className="admin-flash-sales-header__mobile-action">
            {renderCreateButton()}
          </div>
        </div>

        <FlashSaleStats flashSales={filteredFlashSales} />

        {showFilters ? (
          <section className="admin-flash-sales-filters-section">
            <div className="admin-flash-sales-filters-grid">
              <SearchInput
                value={filters.search}
                onChange={event => updateFilters({ ...filters, search: event.target.value })}
                onClear={() => updateFilters({ ...filters, search: '' })}
                placeholder={t('filters.searchPlaceholder')}
                className="admin-flash-sales-search-input h-10"
              />
              <Select
                value={filters.status}
                onChange={value => updateFilters({ ...filters, status: value })}
                className="admin-flash-sales-filter-select"
                popupClassName="admin-flash-sales-popup"
                options={['all', 'active', 'scheduled', 'completed', 'inactive'].map(status => ({
                  value: status,
                  label: t(`filters.statusOptions.${status}`)
                }))}
              />
              <DatePicker.RangePicker
                value={filters.dateRange}
                onChange={value => updateFilters({ ...filters, dateRange: value })}
                className="admin-flash-sales-date-picker"
                popupClassName="admin-flash-sales-date-popup"
              />
              <Button className="admin-flash-sales-btn" onClick={clearFilters}>{t('filters.clear')}</Button>
            </div>
          </section>
        ) : null}

        <FlashSalesTable
          flashSales={paginatedFlashSales}
          total={filteredFlashSales.length}
          currentPage={currentPage}
          pageSize={pageSize}
          columnsVisible={columnsVisible}
          tableLoading={tableLoading}
          onPageChange={page => setCurrentPage(page)}
          onPageSizeChange={(page, size) => {
            setCurrentPage(1)
            setPageSize(size)
          }}
          onEdit={openEdit}
          onDuplicate={openDuplicate}
          onDelete={handleDelete}
        />

        <FlashSaleFormModal
          open={showModal}
          editingItem={editingItem}
          formData={formData}
          productList={productList}
          productLoading={productLoading}
          submitLoading={submitLoading}
          onCancel={closeModal}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onSearchProduct={handleSearchProduct}
        />
      </div>
    </div>
  )
}

export default FlashSale
