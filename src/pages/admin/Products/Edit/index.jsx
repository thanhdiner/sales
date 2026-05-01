import ProductForm from '../components/ProductForm'
import { useProductEdit } from '../hooks/useProductEdit'
import './index.scss'

function ProductsEdit() {
  const { form, id, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate, pathNavigate } = useProductEdit()

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

export default ProductsEdit
