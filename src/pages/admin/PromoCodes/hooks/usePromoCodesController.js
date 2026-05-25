import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Form, message } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { downloadAdminResourceCsv, useAdminResourceColumns } from '@/hooks/shared/adminResourceList'
import { usePromoCodesData } from './usePromoCodesData'
import {
  DEFAULT_PROMO_CODE_FILTERS,
  getPromoCodeApiFilters,
  getPromoCodeExportRows,
  getPromoCodeFormValues
} from '../utils/promoCodeHelpers'

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

export function usePromoCodesController({ t, language }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [filters, setFilters] = useState(() => getInitialPromoCodeFilters(searchParams))
  const [showFilters, setShowFilters] = useState(true)
  const [form] = Form.useForm()
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const { columnsVisible, setColumnsVisible } = useAdminResourceColumns({
    storageKey: PROMO_CODES_COLUMNS_STORAGE_KEY,
    defaults: PROMO_CODES_DEFAULT_COLUMNS_VISIBLE
  })
  const apiFilters = useMemo(() => getPromoCodeApiFilters({ ...filters, search: debouncedSearch }), [debouncedSearch, filters])
  const data = usePromoCodesData({ t, filters: apiFilters })

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
  }, [filters, searchParams, setSearchParams])

  const openForm = record => {
    setEditingCode(record)
    if (record) form.setFieldsValue(getPromoCodeFormValues(record))
    else form.resetFields()
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
    const isSuccess = await data.handleSubmitPromoCode({ values, editingCode })

    if (!isSuccess) return

    setModalVisible(false)
    setEditingCode(null)
    form.resetFields()
  }

  const handleCopy = async text => {
    try {
      await navigator.clipboard.writeText(text)
      message.success(t('messages.copySuccess'))
    } catch {
      message.error(t('messages.copyError'))
    }
  }

  const handleFiltersChange = nextFilters => {
    setFilters(nextFilters)
    data.setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(DEFAULT_PROMO_CODE_FILTERS)
    data.setPage(1)
  }

  const handleExport = () => {
    downloadAdminResourceCsv({
      rows: getPromoCodeExportRows(data.promoCodes, language, t),
      filename: `promo-codes-${dayjs().format('YYYYMMDD-HHmm')}.csv`,
      onEmpty: () => message.info(t('messages.exportEmpty')),
      onSuccess: () => message.success(t('messages.exportSuccess'))
    })
  }

  return {
    ...data,
    modalVisible,
    editingCode,
    filters,
    showFilters,
    columnsVisible,
    form,
    setColumnsVisible,
    setShowFilters,
    setModalVisible,
    handleCreate: () => openForm(null),
    handleEdit: openForm,
    handleDuplicate,
    handleExtendExpiry,
    handleFormSubmit,
    handleCopy,
    handleFiltersChange,
    handleClearFilters,
    handleExport
  }
}
