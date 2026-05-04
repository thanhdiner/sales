import { Form, Upload, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { createBlogPost, uploadBlogMedia } from '@/services/admin/content/blog'
import { getProducts } from '@/services/admin/commerce/product'
import { getBlogCategories } from '@/services/admin/content/blogCategory'
import { getBlogTags } from '@/services/admin/content/blogTag'
import { translateContentToEnglish } from '@/services/admin/content/contentTranslation'
import BlogForm from '../components/BlogForm'
import { buildBlogFormData, MAX_IMAGE_SIZE_MB } from '../blogFormUtils'
import '../index.scss'

const hasText = value => typeof value === 'string' && value.trim().length > 0

export default function BlogCreate() {
  const { t } = useTranslation('adminBlog')
  const [form] = Form.useForm()
  const language = useCurrentLanguage()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [fileList, setFileList] = useState([])
  const [productOptions, setProductOptions] = useState([])
  const [productLoading, setProductLoading] = useState(false)
  const [categoryOptions, setCategoryOptions] = useState([])
  const [tagOptions, setTagOptions] = useState([])
  const [translating, setTranslating] = useState(false)

  const mapProductOptions = products => products.map(product => ({
    value: product._id,
    label: product.productName || product.name || product.title || product._id
  }))

  const mapCategoryOptions = categories => categories.map(category => ({
    value: category.name,
    label: category.name,
    viLabel: category.name,
    enLabel: category.translations?.en?.name || '',
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
      setTagOptions((response?.data || []).map(tag => ({ value: tag._id, label: tag.name, viLabel: tag.name, enLabel: tag.translations?.en?.name || '', enTag: tag.translations?.en?.name || '' })))
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
  const localizedCategoryOptions = useMemo(() => categoryOptions.map(option => ({
    ...option,
    label: language === 'en' && hasText(option.enLabel) ? option.enLabel : option.viLabel
  })), [categoryOptions, language])
  const localizedTagOptions = useMemo(() => tagOptions.map(option => ({
    ...option,
    label: language === 'en' && hasText(option.enLabel) ? option.enLabel : option.viLabel
  })), [tagOptions, language])

  useEffect(() => {
    fetchProductOptions()
    fetchCategoryOptions()
    fetchTagOptions()
    return () => handleSearchProducts.cancel()
  }, [fetchCategoryOptions, fetchProductOptions, fetchTagOptions, handleSearchProducts])

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

  const handleAutoTranslate = async () => {
    setTranslating(true)
    try {
      const values = form.getFieldsValue(true)
      const selectedCategory = categoryOptions.find(option => option.value === values.category)
      const selectedTags = tagOptions.filter(option => (values.tags || []).includes(option.value))
      const response = await translateContentToEnglish({
        target: 'blog_post',
        payload: {
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          category: values.category,
          tags: selectedTags.map(tag => tag.label)
        }
      })
      form.setFieldsValue({
        translations: {
          ...values.translations,
          en: {
            ...(values.translations?.en || {}),
            title: response?.data?.title || '',
            excerpt: response?.data?.excerpt || '',
            content: response?.data?.content || '',
            category: response?.data?.category || selectedCategory?.enCategory || '',
            tags: Array.isArray(response?.data?.tags) ? response.data.tags : []
          }
        }
      })
      message.success('Translated')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Translate failed')
    } finally {
      setTranslating(false)
    }
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
        productOptions={productOptions}
        productLoading={productLoading}
        categoryOptions={localizedCategoryOptions}
        tagOptions={localizedTagOptions}
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
        onAutoTranslate={handleAutoTranslate}
        translating={translating}
        onSearchProducts={handleSearchProducts}
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
