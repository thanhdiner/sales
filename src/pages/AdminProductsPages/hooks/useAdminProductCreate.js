import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '@/services/adminProductService'
import { getAdminProductCategoryTree } from '@/services/adminProductCategoryService'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'

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

        message.error('Không thể tải danh mục sản phẩm')
      }
    }

    fetchTreeData()
  }, [])

  const handleSubmit = async values => {
    console.group('🐛 [CreateProduct] handleSubmit')
    console.log('📋 Raw form values:', JSON.parse(JSON.stringify(values)))

    setLoading(true)

    try {
      const formData = new FormData()
      const thumbnailFile = values.thumbnail?.[0]?.originFileObj

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile)
      }

      const imageFiles = values.images || []
      imageFiles.forEach(fileItem => {
        const file = fileItem.originFileObj
        if (file) formData.append('images', file)
      })

      if (values.features && values.features.length > 0) {
        values.features.forEach(feature => {
          formData.append('features', feature)
        })
      }

      formData.append('title', values.title)
      formData.append('titleNoAccent', removeVietnameseTones(values.title))
      formData.append('productCategory', values.productCategory)
      formData.append('price', values.price)
      formData.append('costPrice', values.costPrice)
      formData.append('discountPercentage', values.discountPercentage || 0)
      formData.append('stock', values.stock || 0)
      formData.append('deliveryType', values.deliveryType || 'manual')
      formData.append('deliveryInstructions', values.deliveryInstructions || '')
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('slug', values.slug || '')
      formData.append('content', values.content || '')
      formData.append('isTopDeal', values.isTopDeal ? 'true' : 'false')
      formData.append('isFeatured', values.isFeatured ? 'true' : 'false')
      formData.append('deliveryEstimateDays', values.deliveryEstimateDays || 0)

      if (values.position !== undefined && values.position !== null && values.position !== '') {
        formData.append('position', values.position)
      }

      const [timeStart, timeFinish] = values.timeRange || []
      if (timeStart) formData.append('timeStart', timeStart.toISOString())
      if (timeFinish) formData.append('timeFinish', timeFinish.toISOString())

      logFormDataDebug(values, formData)

      const response = await createProduct(formData)

      console.info('[AdminProductCreate] Create success', response)

      message.success('Tạo sản phẩm thành công!')
      navigate('/admin/products')
    } catch (err) {
      const response = err?.response || {}

      console.error('[AdminProductCreate] Create failed', {
        message: err?.message || String(err),
        status: err?.status,
        response,
        values: summarizeCreateValues(values)
      })

      if (response?.error === 'Slug already exists') {
        message.error(`Slug đã tồn tại, vui lòng chọn slug khác! Gợi ý: ${response.suggestedSlug || ''}`)

        if (response.suggestedSlug) {
          form.setFieldsValue({ slug: response.suggestedSlug })
        }
      } else if (response?.details?.length) {
        message.error(response.details.join(' | '))
      } else {
        message.error(response?.error || response?.message || 'Tạo sản phẩm thất bại!')
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
      message.error('Chỉ được upload file ảnh!')
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
