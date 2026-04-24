import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getProductCategoryById,
  getAdminProductCategoryTree,
  updateProductCategoryById
} from '@/services/adminProductCategoryService'
import { removeNodeFromTree } from '@/utils/removeNodeFromTree'

export function useAdminProductCategoryEdit() {
  const [loading, setLoading] = useState(false)
  const [oldThumbnail, setOldThumbnail] = useState('')
  const [treeData, setTreeData] = useState([])
  const [form] = Form.useForm()
  const { id } = useParams()
  const navigate = useNavigate()
  const pathNavigate = '/admin/product-categories'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { productCategory } = await getProductCategoryById(id)
        if (!productCategory) throw new Error('Not found')

        if (productCategory.thumbnail) setOldThumbnail(productCategory.thumbnail)

        form.setFieldsValue({
          ...productCategory,
          parent_id: productCategory?.parent_id?._id,
          thumbnail: [
            {
              uid: '-1',
              name: 'current-image.jpg',
              status: 'done',
              url: productCategory.thumbnail
            }
          ]
        })
      } catch {
        message.error('❌ Failed to load product category')
        navigate(pathNavigate)
      }
    }

    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()
        if (response) setTreeData(removeNodeFromTree(response, id))
      } catch {
        message.error('❌ Failed to load category tree data')
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
      } else if (typeof values.thumbnail === 'string') formData.append('thumbnail', values.thumbnail)

      formData.append('title', values.title)
      formData.append('parent_id', values.parent_id || '')
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('position', values?.position)
      formData.append('slug', values.slug || '')

      await updateProductCategoryById(id, formData)
      message.success('✅ Product updated successfully!')
      navigate(pathNavigate)
    } catch (err) {
      console.error(err)
      message.error('❌ Failed to update product category!')
    } finally {
      setLoading(false)
    }
  }

  const beforeUploadImage = file => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) message.error('You can only upload image files!')
    return isImage ? false : Upload.LIST_IGNORE
  }

  const getFileListFromEvent = e => {
    if (Array.isArray(e)) return e
    return e?.fileList || []
  }

  return {
    form,
    id,
    loading,
    treeData,
    handleSubmit,
    beforeUploadImage,
    getFileListFromEvent,
    navigate,
    pathNavigate
  }
}
