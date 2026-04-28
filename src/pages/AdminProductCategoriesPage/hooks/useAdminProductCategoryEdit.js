import { useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getProductCategoryById,
  getAdminProductCategoryTree,
  updateProductCategoryById
} from '@/services/adminProductCategoryService'
import { removeNodeFromTree } from '@/utils/removeNodeFromTree'
import { useTranslation } from 'react-i18next'

export function useAdminProductCategoryEdit() {
  const { t } = useTranslation('adminProductCategories')
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
        message.error(t('formMessages.loadError'))
        navigate(pathNavigate)
      }
    }

    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()
        if (response) setTreeData(removeNodeFromTree(response, id))
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
      } else if (typeof submitValues.thumbnail === 'string') formData.append('thumbnail', submitValues.thumbnail)

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

      await updateProductCategoryById(id, formData)
      message.success(t('formMessages.updateSuccess'))
      navigate(pathNavigate)
    } catch (err) {
      console.error(err)
      message.error(t('formMessages.updateError'))
    } finally {
      setLoading(false)
    }
  }

  const beforeUploadImage = file => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) message.error(t('formMessages.imageOnly'))
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
