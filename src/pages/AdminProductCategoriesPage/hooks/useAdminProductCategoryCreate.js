import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createProductCategory, getAdminProductCategoryTree } from '@/services/adminProductCategoryService'

export function useAdminProductCategoryCreate() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()
        if (response) setTreeData(response)
      } catch {
        message.error('❌ Failed to load category tree data')
      }
    }

    fetchTreeData()
  }, [])

  const handleSubmit = async values => {
    setLoading(true)

    try {
      const formData = new FormData()
      const file = values.thumbnail?.[0]?.originFileObj
      if (file) formData.append('thumbnail', file)
      formData.append('title', values.title)
      formData.append('parent_id', values.parent_id || '')
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('position', values?.position)
      formData.append('slug', values.slug || '')

      await createProductCategory(formData)

      message.success('🎉 Product Category created successfully!')
      navigate('/admin/product-categories')
    } catch (err) {
      const response = err?.response || {}

      if (response?.error === 'Slug already exists') {
        message.error(`❌ Slug đã tồn tại, vui lòng chọn slug khác! Gợi ý: ${response.suggestedSlug || ''}`)
        if (response.suggestedSlug) form.setFieldsValue({ slug: response.suggestedSlug })
      } else message.error('❌ Failed to create product category!')
    } finally {
      setLoading(false)
    }
  }

  const beforeUploadImage = file => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) message.error('You can only upload image files!')
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
