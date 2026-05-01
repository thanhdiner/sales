import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createProductCategory, getProductCategoryTree } from '@/services/admin/commerce/productCategory'
import { useTranslation } from 'react-i18next'

export function useProductCategoryCreate() {
  const { t } = useTranslation('adminProductCategories')
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
      const formData = new FormData()
      const file = submitValues.thumbnail?.[0]?.originFileObj
      if (file) formData.append('thumbnail', file)
      if (submitValues.translations != null) {
        formData.append('translations', JSON.stringify(submitValues.translations))
      }
      formData.append('title', submitValues.title)
      formData.append('parent_id', submitValues.parent_id || '')
      formData.append('description', submitValues.description || '')
      formData.append('content', submitValues.content || '')
      formData.append('status', submitValues.status || 'active')
      formData.append('position', submitValues?.position)
      formData.append('slug', submitValues.slug || '')

      await createProductCategory(formData)

      message.success(t('formMessages.createSuccess'))
      navigate('/admin/product-categories')
    } catch (err) {
      const response = err?.response || {}

      if (response?.error === 'Slug already exists') {
        message.error(t('formMessages.slugExists', { suggestedSlug: response.suggestedSlug || '' }))
        if (response.suggestedSlug) form.setFieldsValue({ slug: response.suggestedSlug })
      } else {
        message.error(t('formMessages.createError'))
      }
    } finally {
      setLoading(false)
    }
  }

  const beforeUploadImage = file => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) message.error(t('formMessages.imageOnly'))
    return isImage ? false : Upload.LIST_IGNORE
  }

  const getFileListFromEvent = e => (Array.isArray(e) ? e : e?.fileList)

  return {
    form,
    loading,
    treeData,
    handleSubmit,
    beforeUploadImage,
    getFileListFromEvent,
    navigate
  }
}
