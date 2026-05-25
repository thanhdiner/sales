import { useTranslation } from 'react-i18next'
import ProductForm from '../components/ProductForm'
import { useProductCreate } from '../hooks/useProductCreate'
import './index.scss'

function ProductsCreate() {
  const { t } = useTranslation('adminProducts')
  const { form, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate } = useProductCreate()

  return (
    <ProductForm
      backLabel={t('details.backToProducts')}
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="create"
      onBack={() => navigate('/admin/products')}
      onCancel={() => navigate('/admin/products')}
      onSubmit={handleSubmit}
      treeData={treeData}
    />
  )
}

export default ProductsCreate
