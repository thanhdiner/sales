import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { getProductCategoryTree } from '@/services/admin/commerce/productCategory'
import { getProductById, updateProductById } from '@/services/admin/commerce/product'
import { useTranslation } from 'react-i18next'
import { buildEditProductFormData, getProductFieldId } from '../utils/productFormData'

const toUploadFileList = (urls = [], prefix = 'image') =>
  (Array.isArray(urls) ? urls : []).filter(Boolean).map((url, index) => ({
    uid: `existing-${prefix}-${index}`,
    name: `${prefix}-${index + 1}.jpg`,
    status: 'done',
    url
  }))

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
          productCategory: getProductFieldId(product.productCategory),
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
      const formData = buildEditProductFormData(submitValues, { oldThumbnail, oldImages })
      await updateProductById(id, formData)

      message.success(t('formMessages.updateSuccess'))
      navigate(pathNavigate)
    } catch (err) {
      const response = err?.response || {}

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
