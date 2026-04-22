import { useState } from 'react'
import { Form, Upload, message } from 'antd'
import { createBanner, updateBannerById } from '@/services/adminBannersService'
import { getBannerFileList, normalizeBannerActiveValue } from '../utils'

export function useAdminBannerForm({ onSaved }) {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [oldImg, setOldImg] = useState('')
  const [imgToDelete, setImgToDelete] = useState('')
  const [isRemoveImg, setIsRemoveImg] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  const openModal = banner => {
    setEditingBanner(banner || null)
    setIsRemoveImg(false)
    setImgToDelete('')

    if (banner) {
      const bannerFileList = getBannerFileList(banner)

      setOldImg(banner.img || '')
      setFileList(bannerFileList)
      form.setFieldsValue({
        ...banner,
        isActive: normalizeBannerActiveValue(banner.isActive),
        img: bannerFileList
      })
    } else {
      setOldImg('')
      setFileList([])
      form.resetFields()
      form.setFieldsValue({ isActive: true })
    }

    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setEditingBanner(null)
    setOldImg('')
    setImgToDelete('')
    setIsRemoveImg(false)
    setFileList([])
    form.resetFields()
  }

  const handleSubmit = async values => {
    setSubmitLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('link', values.link || '')
      formData.append('isActive', values.isActive ? 'true' : 'false')

      const file = values.img?.[0]?.originFileObj

      if (file) {
        formData.append('img', file)
        if (oldImg) {
          formData.append('oldImage', oldImg)
        }
      } else if (isRemoveImg && editingBanner) {
        formData.append('oldImage', imgToDelete)
        formData.append('deleteImage', true)
        formData.append('img', '')
      }

      if (editingBanner) {
        await updateBannerById(editingBanner._id, formData)
        message.success('Đã cập nhật banner')
      } else {
        await createBanner(formData)
        message.success('Đã thêm banner')
      }

      closeModal()
      onSaved?.()
    } catch (err) {
      message.error(err.message || 'Không thể lưu banner')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handleBeforeUpload = file => {
    setIsRemoveImg(false)

    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Chỉ được upload file ảnh')
    }

    return isImage ? false : Upload.LIST_IGNORE
  }

  const handleRemoveUpload = () => {
    setImgToDelete(oldImg)
    setOldImg('')
    setIsRemoveImg(true)
    return true
  }

  return {
    form,
    modalVisible,
    editingBanner,
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
