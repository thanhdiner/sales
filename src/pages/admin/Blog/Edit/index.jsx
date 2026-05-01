import { Form, Spin, Upload, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import { getBlogPost, updateBlogPost, uploadBlogMedia } from '@/services/admin/content/blog'
import BlogForm from '../components/BlogForm'
import { buildBlogFormData, defaultFormValues, getUploadFileList, MAX_IMAGE_SIZE_MB } from '../blogFormUtils'
import '../index.scss'

export default function BlogEdit() {
  const { t } = useTranslation('adminBlog')
  const [form] = Form.useForm()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fileList, setFileList] = useState([])
  const [oldThumbnail, setOldThumbnail] = useState('')
  const [thumbnailToDelete, setThumbnailToDelete] = useState('')

  useEffect(() => {
    let mounted = true

    const fetchPost = async () => {
      setLoading(true)

      try {
        const response = await getBlogPost(id)
        const post = response?.data || response?.post || response
        if (!post) throw new Error('Not found')
        if (!mounted) return

        const uploadFileList = getUploadFileList(post)
        setFileList(uploadFileList)
        setOldThumbnail(post.thumbnail || '')
        setThumbnailToDelete('')
        form.setFieldsValue({
          ...defaultFormValues,
          ...post,
          tags: Array.isArray(post.tags) ? post.tags : [],
          thumbnail: uploadFileList,
          publishedAt: post.publishedAt ? dayjs(post.publishedAt) : null,
          translations: {
            en: {
              title: post.translations?.en?.title || '',
              excerpt: post.translations?.en?.excerpt || '',
              content: post.translations?.en?.content || '',
              category: post.translations?.en?.category || '',
              tags: Array.isArray(post.translations?.en?.tags) ? post.translations.en.tags : []
            }
          }
        })
      } catch {
        message.error(t('messages.fetchError'))
        navigate('/admin/blog')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPost()

    return () => {
      mounted = false
    }
  }, [form, id, navigate, t])

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

    setThumbnailToDelete('')
    return false
  }

  const handleSubmit = async values => {
    setSaving(true)

    try {
      const formValues = {
        ...values,
        ...form.getFieldsValue(true)
      }
      await updateBlogPost(id, buildBlogFormData(formValues, { fileList, oldThumbnail, thumbnailToDelete }))
      message.success(t('messages.updateSuccess'))
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

  if (loading) {
    return (
      <div className="admin-blog-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-4 sm:p-5 lg:p-6">
        <div className="admin-blog-loading"><Spin /></div>
      </div>
    )
  }

  return (
    <>
      <SEO title={t('form.editTitle')} noIndex />
      <BlogForm
        form={form}
        mode="edit"
        saving={saving}
        fileList={fileList}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/blog')}
        onUploadMedia={handleContentMediaUpload}
        beforeUploadThumbnail={handleBeforeUpload}
        onThumbnailChange={({ fileList: nextFileList }) => setFileList(nextFileList.slice(-1))}
        onThumbnailRemove={file => {
          if (file.url && oldThumbnail) setThumbnailToDelete(oldThumbnail)
          setFileList([])
          return true
        }}
      />
    </>
  )
}
