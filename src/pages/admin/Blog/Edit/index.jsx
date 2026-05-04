import { Form, Spin, Upload, message } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import { getBlogPost, updateBlogPost, uploadBlogMedia } from '@/services/admin/content/blog'
import { getProducts } from '@/services/admin/commerce/product'
import { getBlogCategories } from '@/services/admin/content/blogCategory'
import { getBlogTags } from '@/services/admin/content/blogTag'
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
  const [productOptions, setProductOptions] = useState([])
  const [productLoading, setProductLoading] = useState(false)
  const [categoryOptions, setCategoryOptions] = useState([])
  const [tagOptions, setTagOptions] = useState([])

  const mapProductOptions = products => products.map(product => ({
    value: product._id,
    label: product.productName || product.name || product.title || product._id
  }))

  const mapCategoryOptions = categories => categories.map(category => ({
    value: category.name,
    label: category.name,
    categoryRef: category._id,
    enCategory: category.translations?.en?.name || ''
  }))

  const fetchCategoryOptions = useCallback(async () => {
    try {
      const response = await getBlogCategories({ isActive: true })
      setCategoryOptions(mapCategoryOptions(response?.data || []))
    } catch {
      setCategoryOptions([])
    }
  }, [])

  const fetchTagOptions = useCallback(async () => {
    try {
      const response = await getBlogTags({ status: 'active' })
      setTagOptions((response?.data || []).map(tag => ({ value: tag._id, label: tag.name, enTag: tag.translations?.en?.name || '' })))
    } catch {
      setTagOptions([])
    }
  }, [])

  const fetchProductOptions = useCallback(async (keyword = '') => {
    setProductLoading(true)
    try {
      const response = await getProducts({ page: 1, limit: 20, productName: keyword })
      setProductOptions(mapProductOptions(response?.products || response?.data || []))
    } catch {
      setProductOptions([])
    } finally {
      setProductLoading(false)
    }
  }, [])

  const handleSearchProducts = useCallback(debounce(fetchProductOptions, 400), [fetchProductOptions])

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
        const relatedProducts = Array.isArray(post.relatedProducts) ? post.relatedProducts : []
        setProductOptions(current => {
          const selectedOptions = mapProductOptions(relatedProducts.filter(product => typeof product === 'object'))
          const optionMap = new Map([...current, ...selectedOptions].map(option => [option.value, option]))
          return Array.from(optionMap.values())
        })
        setTagOptions(current => {
          const selectedOptions = Array.isArray(post.tagIds)
            ? post.tagIds.filter(tag => typeof tag === 'object').map(tag => ({ value: tag._id, label: tag.name, enTag: tag.translations?.en?.name || '' }))
            : []
          const optionMap = new Map([...current, ...selectedOptions].map(option => [option.value, option]))
          return Array.from(optionMap.values())
        })
        setOldThumbnail(post.thumbnail || '')
        setThumbnailToDelete('')
        form.setFieldsValue({
          ...defaultFormValues,
          ...post,
          tags: Array.isArray(post.tagIds) && post.tagIds.length > 0
            ? post.tagIds.map(tag => (typeof tag === 'object' ? tag._id : tag)).filter(Boolean)
            : [],
          categoryRef: typeof post.categoryRef === 'object' ? post.categoryRef?._id : (post.categoryRef || ''),
          thumbnail: uploadFileList,
          publishedAt: post.publishedAt ? dayjs(post.publishedAt) : null,
          scheduledAt: post.scheduledAt ? dayjs(post.scheduledAt) : null,
          seoTitle: post.seo?.title || '',
          seoDescription: post.seo?.description || '',
          canonicalUrl: post.seo?.canonicalUrl || '',
          relatedProducts: relatedProducts.map(product => (typeof product === 'object' ? product._id : product)).filter(Boolean),
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

    fetchProductOptions()
    fetchCategoryOptions()
    fetchTagOptions()
    fetchPost()

    return () => {
      mounted = false
      handleSearchProducts.cancel()
    }
  }, [fetchCategoryOptions, fetchProductOptions, fetchTagOptions, form, handleSearchProducts, id, navigate, t])

  const handleCategoryChange = value => {
    const selectedCategory = categoryOptions.find(option => option.value === value)
    form.setFieldsValue({
      categoryRef: selectedCategory?.categoryRef || '',
      translations: {
        ...form.getFieldValue('translations'),
        en: {
          ...(form.getFieldValue(['translations', 'en']) || {}),
          category: selectedCategory?.enCategory || ''
        }
      }
    })
  }

  const handleTagChange = values => {
    const selectedTags = tagOptions.filter(option => values.includes(option.value))
    form.setFieldsValue({
      translations: {
        ...form.getFieldValue('translations'),
        en: {
          ...(form.getFieldValue(['translations', 'en']) || {}),
          tags: selectedTags.map(tag => tag.enTag).filter(Boolean)
        }
      }
    })
  }

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
      <div className="admin-blog-page min-h-full bg-[var(--admin-surface)] p-4 sm:p-5 lg:p-6">
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
        productOptions={productOptions}
        productLoading={productLoading}
        categoryOptions={categoryOptions}
        tagOptions={tagOptions}
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
        onSearchProducts={handleSearchProducts}
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
