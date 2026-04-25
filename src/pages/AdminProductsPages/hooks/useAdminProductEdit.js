import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { getAdminProductCategoryTree } from '@/services/adminProductCategoryService'
import { getProductById, updateProductById } from '@/services/adminProductService'

const toUploadFileList = (urls = [], prefix = 'image') =>
  (Array.isArray(urls) ? urls : [])
    .filter(Boolean)
    .map((url, index) => ({
      uid: `existing-${prefix}-${index}`,
      name: `${prefix}-${index + 1}.jpg`,
      status: 'done',
      url
    }))

const getExistingImageUrl = file => {
  if (!file || file.originFileObj) return ''
  return file.url || file.thumbUrl || ''
}

export function useAdminProductEdit() {
  const [loading, setLoading] = useState(false)
  const [oldThumbnail, setOldThumbnail] = useState('')
  const [oldImages, setOldImages] = useState([])
  const [treeData, setTreeData] = useState([])
  const [form] = Form.useForm()
  const { id } = useParams()
  const navigate = useNavigate()
  const pathNavigate = '/admin/products'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { product } = await getProductById(id)

        if (!product) throw new Error('Not found')

        if (product.thumbnail) {
          setOldThumbnail(product.thumbnail)
        }

        setOldImages(Array.isArray(product.images) ? product.images : [])

        form.setFieldsValue({
          ...product,
          thumbnail: toUploadFileList(product.thumbnail ? [product.thumbnail] : [], 'thumbnail'),
          images: toUploadFileList(product.images || [], 'image'),
          timeRange: product.timeStart && product.timeFinish ? [dayjs(product.timeStart), dayjs(product.timeFinish)] : []
        })
      } catch {
        message.error('Failed to load product')
        navigate(pathNavigate)
      }
    }

    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()
        if (response) setTreeData(response)
      } catch {
        message.error('Failed to load category tree data')
      }
    }

    fetchProduct()
    fetchTreeData()
  }, [form, id, navigate])

  const handleSubmit = async values => {
    setLoading(true)

    try {
      const formData = new FormData()
      const file = values.thumbnail?.[0]?.originFileObj

      if (file) {
        formData.append('thumbnail', file)
        formData.append('oldImage', oldThumbnail)
      } else if (typeof values.thumbnail === 'string') {
        formData.append('thumbnail', values.thumbnail)
      }

      const imageFileList = values.images || []
      const existingImages = imageFileList.map(getExistingImageUrl).filter(Boolean)
      const deletedImages = oldImages.filter(url => !existingImages.includes(url))

      imageFileList.forEach(fileItem => {
        const imageFile = fileItem.originFileObj
        if (imageFile) formData.append('images', imageFile)
      })

      formData.append('existingImages', JSON.stringify(existingImages))
      formData.append('oldImages', JSON.stringify(oldImages))
      formData.append('deleteImages', JSON.stringify(deletedImages))

      if (values.features) {
        if (values.features.length > 0) {
          values.features.forEach(feature => formData.append('features', feature))
        } else {
          formData.append('features', '')
        }
      }

      formData.append('title', values.title)
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

      if (values.position !== undefined && values.position !== null && values.position !== '') {
        formData.append('position', values.position)
      }

      const [timeStart, timeFinish] = values.timeRange || []
      if (timeStart) formData.append('timeStart', timeStart.toISOString())
      if (timeFinish) formData.append('timeFinish', timeFinish.toISOString())

      await updateProductById(id, formData)

      message.success('Product updated successfully!')
      navigate(pathNavigate)
    } catch (err) {
      const response = err?.response || {}

      console.error(err)

      if (response?.error === 'Slug already exists') {
        message.error(`Slug already exists, please choose another one. Suggested: ${response.suggestedSlug || ''}`)

        if (response.suggestedSlug) {
          form.setFieldsValue({ slug: response.suggestedSlug })
        }
      } else if (response?.details?.length) {
        message.error(response.details.join(' | '))
      } else {
        message.error(response?.error || response?.message || 'Failed to update product')
      }
    } finally {
      setLoading(false)
    }
  }

  const getFileListFromEvent = e => {
    if (Array.isArray(e)) return e
    return e?.fileList || []
  }

  const beforeUploadImage = file => {
    const isImage = file?.type?.startsWith('image/')

    if (!isImage) {
      message.error('You can only upload image files!')
      return Upload.LIST_IGNORE
    }

    return false
  }

  return {
    form,
    id,
    loading,
    treeData,
    handleSubmit,
    getFileListFromEvent,
    beforeUploadImage,
    navigate,
    pathNavigate
  }
}
