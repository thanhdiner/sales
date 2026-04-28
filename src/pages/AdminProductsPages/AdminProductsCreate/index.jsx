import ProductForm from '../components/ProductForm'
import { useAdminProductCreate } from '../hooks/useAdminProductCreate'
import './AdminProductsCreate.scss'

function CreateProductPage() {
  const { form, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate } =
    useAdminProductCreate()

  return (
    <ProductForm
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="create"
      onCancel={() => navigate('/admin/products')}
      onSubmit={handleSubmit}
      treeData={treeData}
    />
  )
}

export default CreateProductPage
