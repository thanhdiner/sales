import ProductForm from '../components/ProductForm'
import { useProductCreate } from '../hooks/useProductCreate'
import './index.scss'

function ProductsCreate() {
  const { form, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate } = useProductCreate()

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

export default ProductsCreate
