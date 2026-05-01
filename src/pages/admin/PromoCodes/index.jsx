import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
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
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_PROMO_CODE_FILTERS)
  const [form] = Form.useForm()
  const apiFilters = useMemo(() => getPromoCodeApiFilters(filters), [filters])

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
        header={<PromoCodesHeader loading={loading} onCreate={handleCreate} onExport={handleExport} onRefresh={refreshCurrentPage} />}
        stats={<PromoCodesStats promoCodes={promoCodes} language={language} />}
        filters={<PromoCodesFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />}
        table={
          <PromoCodesTable
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
