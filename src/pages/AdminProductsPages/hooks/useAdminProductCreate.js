import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '@/services/adminProductService'
import { getAdminProductCategoryTree } from '@/services/adminProductCategoryService'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'
import { useTranslation } from 'react-i18next'

const summarizeFile = file => ({
  name: file?.name,
  type: file?.type,
  size: file?.size
})

const summarizeCreateValues = values => ({
  title: values.title,
  slug: values.slug || '',
  productCategory: values.productCategory,
  price: values.price,
  costPrice: values.costPrice,
  discountPercentage: values.discountPercentage || 0,
  stock: values.stock || 0,
  status: values.status || 'active',
  position: values.position,
  isTopDeal: !!values.isTopDeal,
  isFeatured: !!values.isFeatured,
  deliveryEstimateDays: values.deliveryEstimateDays || 0,
  featuresCount: values.features?.length || 0,
  timeRange: values.timeRange?.map(item => item?.toISOString?.()) || [],
  descriptionLength: values.description?.length || 0,
  contentLength: values.content?.length || 0,
  thumbnail: values.thumbnail?.[0]?.originFileObj ? summarizeFile(values.thumbnail[0].originFileObj) : null,
  images: values.images?.map(item => summarizeFile(item.originFileObj)).filter(Boolean) || []
})

const logFormDataDebug = (values, formData) => {
  const entries = []

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      entries.push({
        key,
        value: {
          name: value.name,
          type: value.type,
          size: value.size
        }
      })
      continue
    }

    entries.push({ key, value })
  }

  console.groupCollapsed('[AdminProductCreate] Submit payload')
  console.log('Values summary:', summarizeCreateValues(values))
  console.table(entries)
  console.groupEnd()
}

export function useAdminProductCreate() {
  const { t } = useTranslation('adminProducts')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()

        if (response) {
          console.debug('[AdminProductCreate] Category tree loaded', {
            rootItems: response.length
          })

          setTreeData(response)
        }
      } catch (error) {
        console.error('[AdminProductCreate] Failed to load category tree', {
          error: error?.message || String(error),
          response: error?.response
        })

        message.error(t('formMessages.loadTreeError'))
      }
    }

    fetchTreeData()
  }, [t])

  const handleSubmit = async values => {
    const submitValues = {
      ...values,
      ...form.getFieldsValue(true)
    }

    console.group('🐛 [CreateProduct] handleSubmit')
    console.log('📋 Raw form values:', JSON.parse(JSON.stringify(submitValues)))

    setLoading(true)

    try {
      const formData = new FormData()
      const thumbnailFile = submitValues.thumbnail?.[0]?.originFileObj

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile)
      }

      const imageFiles = submitValues.images || []
      imageFiles.forEach(fileItem => {
        const file = fileItem.originFileObj
        if (file) formData.append('images', file)
      })

      if (submitValues.features && submitValues.features.length > 0) {
        submitValues.features.forEach(feature => {
          formData.append('features', feature)
        })
      }

      if (submitValues.translations != null) {
        formData.append('translations', JSON.stringify(submitValues.translations))
      }

      formData.append('title', submitValues.title)
      formData.append('titleNoAccent', removeVietnameseTones(submitValues.title))
      formData.append('productCategory', submitValues.productCategory)
      formData.append('price', submitValues.price)
      formData.append('costPrice', submitValues.costPrice)
      formData.append('discountPercentage', submitValues.discountPercentage || 0)
      formData.append('stock', submitValues.stock || 0)
      formData.append('deliveryType', submitValues.deliveryType || 'manual')
      formData.append('deliveryInstructions', submitValues.deliveryInstructions || '')
      formData.append('description', submitValues.description || '')
      formData.append('status', submitValues.status || 'active')
      formData.append('slug', submitValues.slug || '')
      formData.append('content', submitValues.content || '')
      formData.append('isTopDeal', submitValues.isTopDeal ? 'true' : 'false')
      formData.append('isFeatured', submitValues.isFeatured ? 'true' : 'false')
      formData.append('deliveryEstimateDays', submitValues.deliveryEstimateDays || 0)

      if (submitValues.position !== undefined && submitValues.position !== null && submitValues.position !== '') {
        formData.append('position', submitValues.position)
      }

      const [timeStart, timeFinish] = submitValues.timeRange || []
      if (timeStart) formData.append('timeStart', timeStart.toISOString())
      if (timeFinish) formData.append('timeFinish', timeFinish.toISOString())

      logFormDataDebug(submitValues, formData)

      const response = await createProduct(formData)

      console.info('[AdminProductCreate] Create success', response)

      message.success(t('formMessages.createSuccess'))
      navigate('/admin/products')
    } catch (err) {
      const response = err?.response || {}

      console.error('[AdminProductCreate] Create failed', {
        message: err?.message || String(err),
        status: err?.status,
        response,
        values: summarizeCreateValues(submitValues)
      })

      if (response?.error === 'Slug already exists') {
        message.error(t('formMessages.slugExists', { suggestedSlug: response.suggestedSlug || '' }))

        if (response.suggestedSlug) {
          form.setFieldsValue({ slug: response.suggestedSlug })
        }
      } else if (response?.details?.length) {
        message.error(response.details.join(' | '))
      } else {
        message.error(response?.error || response?.message || t('formMessages.createError'))
      }
    } finally {
      setLoading(false)
      console.groupEnd()
    }
  }

  const getFileListFromEvent = e => {
    if (Array.isArray(e)) return e
    return e?.fileList || []
  }

  const beforeUploadImage = file => {
    const isImage = file.type.startsWith('image/')

    if (!isImage) {
      message.error(t('formMessages.imageOnly'))
      return Upload.LIST_IGNORE
    }

    return false
  }

  return {
    form,
    loading,
    treeData,
    handleSubmit,
    getFileListFromEvent,
    beforeUploadImage,
    navigate
  }
}
