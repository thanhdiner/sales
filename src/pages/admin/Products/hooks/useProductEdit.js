import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { getProductCategoryTree } from '@/services/admin/commerce/productCategory'
import { getProductById, updateProductById } from '@/services/admin/commerce/product'
import { useTranslation } from 'react-i18next'

const toUploadFileList = (urls = [], prefix = 'image') =>
  (Array.isArray(urls) ? urls : []).filter(Boolean).map((url, index) => ({
    uid: `existing-${prefix}-${index}`,
    name: `${prefix}-${index + 1}.jpg`,
    status: 'done',
    url
  }))

const getExistingImageUrl = file => {
  if (!file || file.originFileObj) return ''
  return file.url || file.thumbUrl || ''
}

const getIdValue = value => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') return value._id || value.id || value.value || ''
  return String(value)
}

export function useProductEdit() {
  const { t } = useTranslation('adminProducts')
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
          productCategory: getIdValue(product.productCategory),
          thumbnail: toUploadFileList(product.thumbnail ? [product.thumbnail] : [], 'thumbnail'),
          images: toUploadFileList(product.images || [], 'image'),
          timeRange: product.timeStart && product.timeFinish ? [dayjs(product.timeStart), dayjs(product.timeFinish)] : []
        })
      } catch {
        message.error(t('formMessages.loadError'))
        navigate(pathNavigate)
      }
    }

    const fetchTreeData = async () => {
      try {
        const response = await getProductCategoryTree()
        if (response) setTreeData(response)
      } catch {
        message.error(t('formMessages.loadTreeError'))
      }
    }

    fetchProduct()
    fetchTreeData()
  }, [form, id, navigate, t])

  const handleSubmit = async values => {
    const submitValues = {
      ...values,
      ...form.getFieldsValue(true)
    }

    setLoading(true)

    try {
      const formData = new FormData()
      const file = submitValues.thumbnail?.[0]?.originFileObj

      if (file) {
        formData.append('thumbnail', file)
        formData.append('oldImage', oldThumbnail)
      } else if (typeof submitValues.thumbnail === 'string') {
        formData.append('thumbnail', submitValues.thumbnail)
      }

      const imageFileList = submitValues.images || []
      const existingImages = imageFileList.map(getExistingImageUrl).filter(Boolean)
      const deletedImages = oldImages.filter(url => !existingImages.includes(url))

      imageFileList.forEach(fileItem => {
        const imageFile = fileItem.originFileObj
        if (imageFile) formData.append('images', imageFile)
      })

      formData.append('existingImages', JSON.stringify(existingImages))
      formData.append('oldImages', JSON.stringify(oldImages))
      formData.append('deleteImages', JSON.stringify(deletedImages))

      if (submitValues.features) {
        if (submitValues.features.length > 0) {
          submitValues.features.forEach(feature => formData.append('features', feature))
        } else {
          formData.append('features', '')
        }
      }

      if (submitValues.translations != null) {
        formData.append('translations', JSON.stringify(submitValues.translations))
      }

      formData.append('title', submitValues.title)
      formData.append('productCategory', getIdValue(submitValues.productCategory))
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

      if (submitValues.position !== undefined && submitValues.position !== null && submitValues.position !== '') {
        formData.append('position', submitValues.position)
      }

      const [timeStart, timeFinish] = submitValues.timeRange || []
      if (timeStart) formData.append('timeStart', timeStart.toISOString())
      if (timeFinish) formData.append('timeFinish', timeFinish.toISOString())

      await updateProductById(id, formData)

      message.success(t('formMessages.updateSuccess'))
      navigate(pathNavigate)
    } catch (err) {
      const response = err?.response || {}

      console.error(err)

      if (response?.error === 'Slug already exists') {
        message.error(t('formMessages.slugExists', { suggestedSlug: response.suggestedSlug || '' }))

        if (response.suggestedSlug) {
          form.setFieldsValue({ slug: response.suggestedSlug })
        }
      } else if (response?.details?.length) {
        message.error(response.details.join(' | '))
      } else {
        message.error(response?.error || response?.message || t('formMessages.updateError'))
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
      message.error(t('formMessages.imageOnly'))
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
