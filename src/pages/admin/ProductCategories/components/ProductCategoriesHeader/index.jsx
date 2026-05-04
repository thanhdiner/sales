import { UnorderedListOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ResourceHeader } from '@/components/admin/shared/ResourceManager'
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
  fetchData
}) {
  const { t } = useTranslation('adminProductCategories')
  const [isFilterVisible, setIsFilterVisible] = useState(false)

  const handleFilter = values => {
    const { show, ...rest } = values
    setCurrentPage(1)
    setLimitItems(show ? parseInt(show) : 10)
    setFilterValues(rest)
  }

  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible)
  }

  return (
    <ResourceHeader
      className="admin-product-categories-wrap flex items-center justify-between"
      icon={<UnorderedListOutlined className="text-base" />}
      title={t('page.title')}
      utility={<AdminProductCategoriesUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, productCategories, fetchData }} />}
      filter={isFilterVisible && <ProductCategoriesFilter onFilter={handleFilter} initialValues={filterInitialValues} />}
    />
  )
}

export default ProductCategoriesHeader
