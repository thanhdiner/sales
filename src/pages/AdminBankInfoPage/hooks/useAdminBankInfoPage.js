import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import {
  activateBankInfo,
  createBankInfo,
  deleteBankInfo,
  getBankInfos,
  updateBankInfo
} from '@/services/adminBankInfoService'
import {
  ADMIN_BANK_INFO_FORM_INITIAL_VALUES,
  buildBankInfoFormData,
  getBankInfoQrFileList
} from '../utils'

export default function useAdminBankInfoPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [oldQR, setOldQR] = useState('')
  const [qrToDelete, setQrToDelete] = useState('')
  const [isRemoveQR, setIsRemoveQR] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const { bodyStyle, contentRef } = useModalBodyScroll(open)

  const load = async () => {
    setLoading(true)

    try {
      const response = await getBankInfos({ page: 1, limit: 100 })
      setData(response?.bankInfos || [])
    } catch (error) {
      message.error(error?.message || 'Lỗi tải danh sách bank info')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const resetModalState = () => {
    setOpen(false)
    setEditing(null)
    setOldQR('')
    setQrToDelete('')
    setIsRemoveQR(false)
    form.resetFields()
  }

  const handleCreate = () => {
    setEditing(null)
    setOldQR('')
    setQrToDelete('')
    setIsRemoveQR(false)
    form.setFieldsValue(ADMIN_BANK_INFO_FORM_INITIAL_VALUES)
    setOpen(true)
  }

  const handleEdit = record => {
    setEditing(record)
    setOldQR(record?.qrCode || '')
    setQrToDelete('')
    setIsRemoveQR(false)
    form.setFieldsValue({
      ...record,
      qrCode: getBankInfoQrFileList(record)
    })
    setOpen(true)
  }

  const handleClose = () => {
    resetModalState()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)

      const formData = buildBankInfoFormData({
        values,
        editing,
        oldQR,
        qrToDelete,
        isRemoveQR
      })

      if (editing) {
        await updateBankInfo(editing._id, formData)
        message.success('Đã cập nhật')
      } else {
        await createBankInfo(formData)
        message.success('Đã tạo mới')
      }

      resetModalState()
      await load()
    } catch (error) {
      if (error?.errorFields) return

      message.error(error?.message || error?.response?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteBankInfo(id)
      message.success('Đã xoá')
      await load()
    } catch (error) {
      message.error(error?.message || 'Xoá thất bại')
    }
  }

  const handleActivate = async (record, checked) => {
    try {
      if (!checked) {
        const otherActiveCount = data.filter(item => item.isActive && item._id !== record._id).length

        if (otherActiveCount === 0) {
          message.info('Cần ít nhất 1 bản ghi đang dùng. Hãy kích hoạt bản ghi khác trước.')
          return
        }
      }

      await activateBankInfo(record._id, { active: checked })
      message.success(checked ? 'Đã đặt làm bản ghi đang dùng' : 'Đã tắt kích hoạt')
      await load()
    } catch (error) {
      message.error(error?.message || 'Kích hoạt thất bại')
    }
  }

  const handleQrBeforeUpload = file => {
    setIsRemoveQR(false)

    const isImage = file.type?.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isImage) {
      message.error('Chỉ được upload file ảnh!')
    }

    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!')
    }

    return isImage && isLt5M ? false : Upload.LIST_IGNORE
  }

  const handleQrRemove = () => {
    setQrToDelete(oldQR || qrToDelete)
    setOldQR('')
    setIsRemoveQR(true)
    return true
  }

  return {
    data,
    loading,
    open,
    editing,
    form,
    bodyStyle,
    contentRef,
    submitLoading,
    handleCreate,
    handleEdit,
    handleClose,
    handleSubmit,
    handleDelete,
    handleActivate,
    handleQrBeforeUpload,
    handleQrRemove
  }
}
