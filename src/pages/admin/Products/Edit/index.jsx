import { useTranslation } from 'react-i18next'
import ProductForm from '../components/ProductForm'
import { useProductEdit } from '../hooks/useProductEdit'
import './index.scss'

function ProductsEdit() {
  const { t } = useTranslation('adminProducts')
  const { form, id, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate, pathNavigate } = useProductEdit()

  return (
    <ProductForm
      backLabel={t('details.backToProducts')}
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="edit"
      onBack={() => navigate(pathNavigate)}
      onCancel={() => navigate(pathNavigate)}
      onSubmit={handleSubmit}
      productId={id}
      treeData={treeData}
    />
  )
}

export default ProductsEdit
