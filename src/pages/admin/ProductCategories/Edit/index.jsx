import { useTranslation } from 'react-i18next'
import CategoryForm from '../components/CategoryForm'
import { useProductCategoryEdit } from '../hooks/useProductCategoryEdit'
import '../index.scss'

function ProductCategoriesEdit() {
  const { t } = useTranslation('adminProductCategories')
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate, pathNavigate } =
    useProductCategoryEdit()

  return (
    <CategoryForm
      backLabel={t('details.backToCategoryList')}
      beforeUploadImage={beforeUploadImage}
      form={form}
      getFileListFromEvent={getFileListFromEvent}
      loading={loading}
      mode="edit"
      onBack={() => navigate(pathNavigate)}
      onCancel={() => navigate(pathNavigate)}
      onSubmit={handleSubmit}
      treeData={treeData}
    />
  )
}

export default ProductCategoriesEdit
