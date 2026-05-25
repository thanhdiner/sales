import { UnorderedListOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ResourceListHeader } from '@/components/admin/resources/ResourceManager'
import AdminProductCategoriesUtility from '../ProductCategoriesUtility'
import ProductCategoriesFilter from '../ProductCategoriesFilter'

function ProductCategoriesHeader({
  setCurrentPage,
  setLimitItems,
  setFilterValues,
  filterInitialValues,
  columnsVisible,
  setColumnsVisible,
  productCategories,
  isFetching,
  fetchData
}) {
  const { t } = useTranslation('adminProductCategories')

  return (
    <ResourceListHeader
      className="admin-product-categories-wrap flex items-center justify-between"
      icon={<UnorderedListOutlined className="text-base" />}
      title={t('page.title')}
      utility={({ handleToggleFilter }) => (
        <AdminProductCategoriesUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, productCategories, isFetching, fetchData }} />
      )}
      FilterComponent={ProductCategoriesFilter}
      filterInitialValues={filterInitialValues}
      setCurrentPage={setCurrentPage}
      setLimitItems={setLimitItems}
      setFilterValues={setFilterValues}
    />
  )
}

export default ProductCategoriesHeader
