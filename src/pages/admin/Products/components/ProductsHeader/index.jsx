import { UnorderedListOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ResourceListHeader } from '@/components/admin/resources/ResourceManager'
import ProductsUtility from '../ProductsUtility'
import ProductsFilter from '../ProductsFilter'

function ProductsHeader({
  setCurrentPage,
  setLimitItems,
  setFilterValues,
  filterInitialValues,
  columnsVisible,
  setColumnsVisible,
  products,
  isFetching,
  fetchData
}) {
  const { t } = useTranslation('adminProducts')

  return (
    <ResourceListHeader
      className="products-wrap admin-products-title-wrap text-base"
      icon={<UnorderedListOutlined />}
      title={t('page.title')}
      utility={({ handleToggleFilter }) => (
        <ProductsUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, products, isFetching, fetchData }} />
      )}
      FilterComponent={ProductsFilter}
      filterInitialValues={filterInitialValues}
      setCurrentPage={setCurrentPage}
      setLimitItems={setLimitItems}
      setFilterValues={setFilterValues}
    />
  )
}

export default ProductsHeader
