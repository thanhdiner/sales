import { Form, Upload, message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SEO from '@/components/SEO'
import { createAdminBlogPost, uploadAdminBlogMedia } from '@/services/adminBlogService'
import AdminBlogForm from '../components/AdminBlogForm'
import { buildBlogFormData, MAX_IMAGE_SIZE_MB } from '../blogFormUtils'
import '../AdminBlogPage.scss'

export default function AdminBlogCreate() {
  const { t } = useTranslation('adminBlog')
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [fileList, setFileList] = useState([])

  const handleContentMediaUpload = async file => {
    try {
      return await uploadAdminBlogMedia(file)
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || t('messages.mediaUploadError'))
      return null
    }
  }

  const handleBeforeUpload = file => {
    const isImage = file.type?.startsWith('image/')
    const isSmallEnough = file.size / 1024 / 1024 < MAX_IMAGE_SIZE_MB

    if (!isImage) {
      message.error(t('messages.imageOnly'))
      return Upload.LIST_IGNORE
    }

    if (!isSmallEnough) {
      message.error(t('messages.imageTooLarge', { size: MAX_IMAGE_SIZE_MB }))
      return Upload.LIST_IGNORE
    }

    return false
  }

  const handleSubmit = async values => {
    setSaving(true)

    try {
      const formValues = {
        ...values,
        ...form.getFieldsValue(true)
      }
      await createAdminBlogPost(buildBlogFormData(formValues, { fileList }))
      message.success(t('messages.createSuccess'))
      navigate('/admin/blog')
    } catch (error) {
      if (error?.errorFields) return
      message.error(error?.response?.details?.suggestedSlug
        ? t('messages.slugExists', { slug: error.response.details.suggestedSlug })
        : (error?.response?.message || error?.response?.error || t('messages.saveError')))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SEO title={t('form.createTitle')} noIndex />
      <AdminBlogForm
        form={form}
        mode="create"
        saving={saving}
        fileList={fileList}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/blog')}
        onUploadMedia={handleContentMediaUpload}
        beforeUploadThumbnail={handleBeforeUpload}
        onThumbnailChange={({ fileList: nextFileList }) => setFileList(nextFileList.slice(-1))}
        onThumbnailRemove={() => {
          setFileList([])
          return true
        }}
      />
    </>
  )
}
