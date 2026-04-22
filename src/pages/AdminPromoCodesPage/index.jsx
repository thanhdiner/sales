import React, { useState } from 'react'
import { Form, message } from 'antd'
import SEO from '@/components/SEO'
import PromoCodeDetailModal from './components/PromoCodeDetailModal'
import PromoCodeFormModal from './components/PromoCodeFormModal'
import PromoCodesStats from './components/PromoCodesStats'
import PromoCodesTable from './components/PromoCodesTable'
import { useAdminPromoCodesData } from './hooks/useAdminPromoCodesData'
import { getPromoCodeFormValues } from './utils/promoCodeHelpers'

export default function AdminPromoCodesPage() {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [form] = Form.useForm()

  const {
    promoCodes,
    loading,
    pagination,
    selectedCode,
    detailModalVisible,
    handleTableChange,
    handleDelete,
    handleSubmitPromoCode,
    handleToggleStatus,
    showDetail,
    closeDetail
  } = useAdminPromoCodesData()

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
      message.success('Đã sao chép mã giảm giá')
    } catch (err) {
      message.error('Sao chép mã giảm giá thất bại')
    }
  }

  return (
    <div className="min-h-screen rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
      <SEO title="Admin – Mã giảm giá" noIndex />

      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">Quản lý mã giảm giá</h1>
        <p className="text-gray-600 dark:text-gray-400">Tạo và quản lý các mã giảm giá cho khách hàng</p>
      </div>

      <PromoCodesStats promoCodes={promoCodes} />

      <PromoCodesTable
        promoCodes={promoCodes}
        loading={loading}
        pagination={pagination}
        onCreate={handleCreate}
        onTableChange={handleTableChange}
        onCopy={handleCopy}
        onShowDetail={showDetail}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      <PromoCodeFormModal
        open={modalVisible}
        editingCode={editingCode}
        form={form}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
      />

      <PromoCodeDetailModal open={detailModalVisible} selectedCode={selectedCode} onCancel={closeDetail} />
    </div>
  )
}
