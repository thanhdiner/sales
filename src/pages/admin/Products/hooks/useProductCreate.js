import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '@/services/admin/commerce/product'
import { getProductCategoryTree } from '@/services/admin/commerce/productCategory'
import { useTranslation } from 'react-i18next'
import { buildCreateProductFormData } from '../utils/productFormData'

export function useProductCreate() {
  const { t } = useTranslation('adminProducts')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await getProductCategoryTree()
        if (response) setTreeData(response)
      } catch {
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

    setLoading(true)

    try {
      await createProduct(buildCreateProductFormData(submitValues))
      message.success(t('formMessages.createSuccess'))
      navigate('/admin/products')
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
        message.error(response?.error || response?.message || t('formMessages.createError'))
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

