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
  getBankInfoQrFileList,
  getBankInfoTranslationValues
} from '../utils'

export default function useAdminBankInfoPage({ t = key => key } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [oldQR, setOldQR] = useState('')
  const [qrToDelete, setQrToDelete] = useState('')
  const [isRemoveQR, setIsRemoveQR] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [activateLoadingId, setActivateLoadingId] = useState(null)
  const [form] = Form.useForm()
  const { bodyStyle, contentRef } = useModalBodyScroll(open)

  const load = async () => {
    setLoading(true)

    try {
      const response = await getBankInfos({ page: 1, limit: 100 })
      setData(response?.bankInfos || [])
    } catch (error) {
      message.error(error?.message || t('messages.fetchError'))
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
      translations: getBankInfoTranslationValues(record),
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
        message.success(t('messages.updateSuccess'))
      } else {
        await createBankInfo(formData)
        message.success(t('messages.createSuccess'))
      }

      resetModalState()
      await load()
    } catch (error) {
      if (error?.errorFields) return

      message.error(error?.message || error?.response?.message || t('messages.saveError'))
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteBankInfo(id)
      message.success(t('messages.deleteSuccess'))
      await load()
    } catch (error) {
      message.error(error?.message || t('messages.deleteError'))
    }
  }

  const handleActivate = async (record, checked) => {
    if (!checked) {
      const otherActiveCount = data.filter(item => item.isActive && item._id !== record._id).length

      if (otherActiveCount === 0) {
        message.info(t('messages.needActiveAccount'))
        return
      }
    }

    setActivateLoadingId(record._id)

    try {
      await activateBankInfo(record._id, { active: checked })
      message.success(checked ? t('messages.activateSuccess') : t('messages.deactivateSuccess'))
      await load()
    } catch (error) {
      message.error(error?.message || t('messages.statusError'))
    } finally {
      setActivateLoadingId(null)
    }
  }

  const handleQrBeforeUpload = file => {
    setIsRemoveQR(false)

    const isImage = file.type?.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isImage) {
      message.error(t('messages.imageOnly'))
    }

    if (!isLt5M) {
      message.error(t('messages.imageTooLarge'))
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
    activateLoadingId,
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
