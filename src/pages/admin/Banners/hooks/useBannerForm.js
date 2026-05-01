import { useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { createBanner, updateBannerById } from '@/services/admin/marketing/banner'
import { getBannerFileList, normalizeBannerActiveValue } from '../utils'

const getBannerTranslations = banner => ({
  en: {
    title: banner?.translations?.en?.title || '',
    link: banner?.translations?.en?.link || ''
  }
})

export function useBannerForm({ onSaved }) {
  const { t } = useTranslation('adminBanners')
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
        translations: getBannerTranslations(banner),
        img: bannerFileList
      })
    } else {
      setOldImg('')
      setFileList([])
      form.resetFields()
      form.setFieldsValue({ isActive: true, translations: getBannerTranslations() })
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
    const submitValues = {
      ...values,
      ...form.getFieldsValue(true)
    }

    setSubmitLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', submitValues.title)
      formData.append('link', submitValues.link || '')
      formData.append('isActive', submitValues.isActive ? 'true' : 'false')

      if (submitValues.translations != null) {
        formData.append('translations', JSON.stringify(submitValues.translations))
      }

      const file = submitValues.img?.[0]?.originFileObj

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
        message.success(t('messages.updateSuccess'))
      } else {
        await createBanner(formData)
        message.success(t('messages.createSuccess'))
      }

      closeModal()
      onSaved?.()
    } catch (err) {
      message.error(err.message || t('messages.saveError'))
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
      message.error(t('messages.invalidImage'))
    }

    return isImage ? false : Upload.LIST_IGNORE
  }

  const handleRemoveUpload = () => {
    setImgToDelete(oldImg)
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
