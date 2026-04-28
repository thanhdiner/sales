import CategoryForm from '../components/CategoryForm'
import { useAdminProductCategoryCreate } from '../hooks/useAdminProductCategoryCreate'
import '../AdminProductCategoriesPage.scss'

const AdminProductCategoriesCreate = () => {
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate } =
    useAdminProductCategoryCreate()

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

export default AdminProductCategoriesCreate
