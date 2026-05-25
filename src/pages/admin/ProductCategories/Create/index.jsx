import { useTranslation } from 'react-i18next'
import CategoryForm from '../components/CategoryForm'
import { useProductCategoryCreate } from '../hooks/useProductCategoryCreate'
import '../index.scss'

const ProductCategoriesCreate = () => {
  const { t } = useTranslation('adminProductCategories')
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate } = useProductCategoryCreate()

  return (
    <CategoryForm
      backLabel={t('details.backToCategoryList')}
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="create"
      onBack={() => navigate('/admin/product-categories')}
      onCancel={() => navigate('/admin/product-categories')}
      onSubmit={handleSubmit}
      treeData={treeData}
    />
  )
}

export default ProductCategoriesCreate
