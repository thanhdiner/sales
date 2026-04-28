import CategoryForm from '../components/CategoryForm'
import { useAdminProductCategoryEdit } from '../hooks/useAdminProductCategoryEdit'
import '../AdminProductCategoriesPage.scss'

function AdminProductCategoriesEdit() {
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate, pathNavigate } =
    useAdminProductCategoryEdit()

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

export default AdminProductCategoriesEdit
