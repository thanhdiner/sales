import { Form, Upload, message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import { createBlogPost, uploadBlogMedia } from '@/services/admin/content/blog'
import BlogForm from '../components/BlogForm'
import { buildBlogFormData, MAX_IMAGE_SIZE_MB } from '../blogFormUtils'
import '../index.scss'

export default function BlogCreate() {
  const { t } = useTranslation('adminBlog')
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [fileList, setFileList] = useState([])

  const handleContentMediaUpload = async file => {
    try {
      return await uploadBlogMedia(file)
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
      await createBlogPost(buildBlogFormData(formValues, { fileList }))
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
      <BlogForm
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
