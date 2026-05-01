import CategoryForm from '../components/CategoryForm'
import { useProductCategoryCreate } from '../hooks/useProductCategoryCreate'
import '../index.scss'

const ProductCategoriesCreate = () => {
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate } = useProductCategoryCreate()

  return (
    <CategoryForm
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="create"
      onCancel={() => navigate('/admin/product-categories')}
      onSubmit={handleSubmit}
      treeData={treeData}
    />
  )
}

export default ProductCategoriesCreate
