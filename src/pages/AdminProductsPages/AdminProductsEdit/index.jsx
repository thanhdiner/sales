import ProductForm from '../components/ProductForm'
import { useAdminProductEdit } from '../hooks/useAdminProductEdit'
import './AdminProductsEdit.scss'

function AdminProductsEdit() {
  const { form, id, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate, pathNavigate } =
    useAdminProductEdit()

  return (
    <ProductForm
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="edit"
      onCancel={() => navigate(pathNavigate)}
      onSubmit={handleSubmit}
      productId={id}
      treeData={treeData}
    />
  )
}

export default AdminProductsEdit
