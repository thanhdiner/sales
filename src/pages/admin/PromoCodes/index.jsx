import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Resource } from '@/components/admin/ui'
import PromoCodeDetailModal from './components/PromoCodeDetailModal'
import PromoCodeFormModal from './components/PromoCodeFormModal'
import { usePromoCodesData } from './hooks/usePromoCodesData'
import PromoCodesFilters from './sections/PromoCodesFilters'
import PromoCodesHeader from './sections/PromoCodesHeader'
import PromoCodesMobileList from './sections/PromoCodesMobileList'
import PromoCodesPagination from './sections/PromoCodesPagination'
import PromoCodesStats from './sections/PromoCodesStats'
import PromoCodesTable from './sections/PromoCodesTable'
import {
  DEFAULT_PROMO_CODE_FILTERS,
  getPromoCodeApiFilters,
  getPromoCodeExportRows,
  getPromoCodeFormValues
} from './utils/promoCodeHelpers'
import './index.scss'

const PROMO_CODES_COLUMNS_STORAGE_KEY = 'adminPromoCodesColumnsVisible'
const PROMO_CODES_DEFAULT_COLUMNS_VISIBLE = {
  code: true,
  campaign: true,
  discountType: true,
  conditions: true,
  usage: true,
  audience: true,
  expiresAt: true,
  createdAt: true,
  status: true,
  actions: true
}

function getStoredColumnsVisible() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROMO_CODES_COLUMNS_STORAGE_KEY))
    return { ...PROMO_CODES_DEFAULT_COLUMNS_VISIBLE, ...stored, actions: true }
  } catch {
    return PROMO_CODES_DEFAULT_COLUMNS_VISIBLE
  }
}

function getInitialPromoCodeFilters(searchParams) {
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  return {
    ...DEFAULT_PROMO_CODE_FILTERS,
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || DEFAULT_PROMO_CODE_FILTERS.status,
    discountType: searchParams.get('discountType') || DEFAULT_PROMO_CODE_FILTERS.discountType,
    audience: searchParams.get('audience') || DEFAULT_PROMO_CODE_FILTERS.audience,
    dateField: searchParams.get('dateField') || DEFAULT_PROMO_CODE_FILTERS.dateField,
    dateRange: startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null
  }
}

function buildCsv(rows) {
  if (!rows.length) return ''

  const headers = Object.keys(rows[0])
  const escapeCell = value => {
    const text = String(value ?? '')
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }

  return [headers.map(escapeCell).join(','), ...rows.map(row => headers.map(header => escapeCell(row[header])).join(','))].join('\n')
}

export default function PromoCodes() {
  const { t, i18n } = useTranslation('adminPromoCodes')
  const language = i18n.resolvedLanguage || i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [filters, setFilters] = useState(() => getInitialPromoCodeFilters(searchParams))
  const [showFilters, setShowFilters] = useState(true)
  const [columnsVisible, setColumnsVisible] = useState(getStoredColumnsVisible)
  const [form] = Form.useForm()
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const apiFilters = useMemo(() => getPromoCodeApiFilters({ ...filters, search: debouncedSearch }), [debouncedSearch, filters])

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(filters.search), 350)
    return () => clearTimeout(timeout)
  }, [filters.search])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    const [startDate, endDate] = Array.isArray(filters.dateRange) ? filters.dateRange : []

    Object.entries({
      search: filters.search,
      status: filters.status !== DEFAULT_PROMO_CODE_FILTERS.status ? filters.status : '',
      discountType: filters.discountType !== DEFAULT_PROMO_CODE_FILTERS.discountType ? filters.discountType : '',
      audience: filters.audience !== DEFAULT_PROMO_CODE_FILTERS.audience ? filters.audience : '',
      dateField: filters.dateField !== DEFAULT_PROMO_CODE_FILTERS.dateField ? filters.dateField : '',
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : ''
    }).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })

    params.delete('page')
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  useEffect(() => {
    localStorage.setItem(PROMO_CODES_COLUMNS_STORAGE_KEY, JSON.stringify(columnsVisible))
  }, [columnsVisible])

  const {
    promoCodes,
    loading,
    pagination,
    selectedCode,
    detailModalVisible,
    refreshCurrentPage,
    setPage,
    handleTableChange,
    handleDelete,
    handleSubmitPromoCode,
    handleToggleStatus,
    showDetail,
    closeDetail
  } = usePromoCodesData({ t, filters: apiFilters })

  const handleCreate = () => {
    setEditingCode(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = record => {
    setEditingCode(record)
    form.setFieldsValue(getPromoCodeFormValues(record))
    setModalVisible(true)
  }

  const handleDuplicate = record => {
    const duplicateValues = getPromoCodeFormValues(record)
    const nextCode = `${record.code || ''}COPY`.slice(0, 50)

    setEditingCode(null)
    form.setFieldsValue({
      ...duplicateValues,
      code: nextCode,
      isActive: false
    })
    setModalVisible(true)
    message.info(t('messages.duplicateReady'))
  }

  const handleExtendExpiry = record => {
    setEditingCode(record)
    form.setFieldsValue({
      ...getPromoCodeFormValues(record),
      isActive: true,
      expiresAt: dayjs().add(30, 'day').endOf('day')
    })
    setModalVisible(true)
  }

  const handleFormSubmit = async values => {
    const isSuccess = await handleSubmitPromoCode({ values, editingCode })

    if (!isSuccess) return

    setModalVisible(false)
    setEditingCode(null)
    form.resetFields()
  }

  const handleCopy = async text => {
    try {
      await navigator.clipboard.writeText(text)
      message.success(t('messages.copySuccess'))
    } catch (err) {
      message.error(t('messages.copyError'))
    }
  }

  const handleFiltersChange = nextFilters => {
    setFilters(nextFilters)
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(DEFAULT_PROMO_CODE_FILTERS)
    setPage(1)
  }

  const handleExport = () => {
    const rows = getPromoCodeExportRows(promoCodes, language, t)

    if (!rows.length) {
      message.info(t('messages.exportEmpty'))
      return
    }

    const blob = new Blob([`\uFEFF${buildCsv(rows)}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `promo-codes-${dayjs().format('YYYYMMDD-HHmm')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    message.success(t('messages.exportSuccess'))
  }

  return (
    <>
      <Resource
        resource="promo-codes"
        seoTitle={t('seo.title')}
        className="admin-promo-codes-page"
        contentClassName="admin-promo-codes-page__inner"
        header={
          <PromoCodesHeader
            columnsVisible={columnsVisible}
            loading={loading}
            onColumnsVisibleChange={setColumnsVisible}
            onCreate={handleCreate}
            onExport={handleExport}
            onRefresh={refreshCurrentPage}
            onToggleFilter={() => setShowFilters(prev => !prev)}
          />
        }
        stats={<PromoCodesStats promoCodes={promoCodes} language={language} />}
        filters={showFilters ? <PromoCodesFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} /> : null}
        table={
          <PromoCodesTable
            promoCodes={promoCodes}
            loading={loading}
            language={language}
            columnsVisible={columnsVisible}
            onCopy={handleCopy}
            onShowDetail={showDetail}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onToggleStatus={handleToggleStatus}
            onExtendExpiry={handleExtendExpiry}
            onDelete={handleDelete}
          />
        }
        mobileList={
          <PromoCodesMobileList
            promoCodes={promoCodes}
            loading={loading}
            language={language}
            onCopy={handleCopy}
            onShowDetail={showDetail}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onToggleStatus={handleToggleStatus}
            onExtendExpiry={handleExtendExpiry}
            onDelete={handleDelete}
          />
        }
        pagination={<PromoCodesPagination pagination={pagination} language={language} onPageChange={handleTableChange} />}
      />

      <PromoCodeFormModal
        open={modalVisible}
        editingCode={editingCode}
        form={form}
        loading={loading}
        language={language}
        t={t}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
      />

      <PromoCodeDetailModal open={detailModalVisible} selectedCode={selectedCode} language={language} t={t} onCancel={closeDetail} />
    </>
  )
}
