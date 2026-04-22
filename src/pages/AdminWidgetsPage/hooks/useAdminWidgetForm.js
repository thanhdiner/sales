import { useState } from 'react'
import { Form, Upload, message } from 'antd'
import { createWidget, updateWidgetById } from '@/services/adminWidgetsService'
import { getWidgetIconFileList, normalizeWidgetActiveValue } from '../utils'

export function useAdminWidgetForm({ onSaved }) {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingWidget, setEditingWidget] = useState(null)
  const [oldIcon, setOldIcon] = useState('')
  const [iconToDelete, setIconToDelete] = useState('')
  const [isRemoveIcon, setIsRemoveIcon] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  const openModal = widget => {
    setEditingWidget(widget || null)
    setIconToDelete('')
    setIsRemoveIcon(false)

    if (widget) {
      const widgetIconFileList = getWidgetIconFileList(widget)

      setOldIcon(widget.iconUrl || '')
      setFileList(widgetIconFileList)
      form.setFieldsValue({
        ...widget,
        isActive: normalizeWidgetActiveValue(widget.isActive),
        iconUrl: widgetIconFileList
      })
    } else {
      setOldIcon('')
      setFileList([])
      form.resetFields()
      form.setFieldsValue({ isActive: true, order: 0, iconUrl: [] })
    }

    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setEditingWidget(null)
    setOldIcon('')
    setIconToDelete('')
    setIsRemoveIcon(false)
    setFileList([])
    form.resetFields()
  }

  const handleSubmit = async values => {
    setSubmitLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('link', values.link || '')
      formData.append('order', values.order || 0)
      formData.append('isActive', values.isActive ? 'true' : 'false')

      const file = values.iconUrl?.[0]?.originFileObj

      if (file) {
        formData.append('iconUrl', file)

        if (oldIcon) {
          formData.append('oldImage', oldIcon)
        }
      } else if (isRemoveIcon && editingWidget) {
        formData.append('oldImage', iconToDelete)
        formData.append('deleteImage', true)
        formData.append('iconUrl', '')
      }

      if (editingWidget) {
        await updateWidgetById(editingWidget._id, formData)
        message.success('Đã cập nhật widget')
      } else {
        await createWidget(formData)
        message.success('Đã thêm widget')
      }

      closeModal()
      onSaved?.()
    } catch (err) {
      message.error(err.message || 'Không thể lưu widget')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handleBeforeUpload = file => {
    setIsRemoveIcon(false)

    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Chỉ được upload file ảnh')
    }

    return isImage ? false : Upload.LIST_IGNORE
  }

  const handleRemoveUpload = () => {
    setIconToDelete(oldIcon)
    setOldIcon('')
    setIsRemoveIcon(true)
    return true
  }

  return {
    form,
    modalVisible,
    editingWidget,
    submitLoading,
    fileList,
    openModal,
    closeModal,
    handleSubmit,
    handleUploadChange,
    handleBeforeUpload,
    handleRemoveUpload
  }
}
