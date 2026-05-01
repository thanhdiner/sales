import CategoryForm from '../components/CategoryForm'
import { useProductCategoryEdit } from '../hooks/useProductCategoryEdit'
import '../index.scss'

function ProductCategoriesEdit() {
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate, pathNavigate } =
    useProductCategoryEdit()

  return (
    <CategoryForm
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="edit"
      onCancel={() => navigate(pathNavigate)}
      onSubmit={handleSubmit}
      treeData={treeData}
    />
  )
}

export default ProductCategoriesEdit
