import { useState } from 'react'
import { Form, Upload, message } from 'antd'
import { createWidget, updateWidgetById } from '@/services/adminWidgetsService'
import { getWidgetIconFileList, normalizeWidgetActiveValue } from '../utils'

export function useAdminWidgetForm({ onSaved, t = key => key }) {
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
        translations: {
          en: {
            title: widget.translations?.en?.title || ''
          }
        },
        isActive: normalizeWidgetActiveValue(widget.isActive),
        iconUrl: widgetIconFileList
      })
    } else {
      setOldIcon('')
      setFileList([])
      form.resetFields()
      form.setFieldsValue({ isActive: true, order: 0, iconUrl: [], translations: { en: { title: '' } } })
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
    const submitValues = {
      ...values,
      ...form.getFieldsValue(true)
    }

    setSubmitLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', submitValues.title)
      formData.append('link', submitValues.link || '')
      formData.append('order', submitValues.order || 0)
      formData.append('isActive', submitValues.isActive ? 'true' : 'false')

      if (submitValues.translations != null) {
        formData.append('translations', JSON.stringify(submitValues.translations))
      }

      const file = submitValues.iconUrl?.[0]?.originFileObj

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
        message.success(t('messages.updateSuccess'))
      } else {
        await createWidget(formData)
        message.success(t('messages.createSuccess'))
      }

      await onSaved?.()
      closeModal()
    } catch (err) {
      message.error(err?.message || t('messages.saveError'))
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
      message.error(t('messages.imageOnly'))
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
