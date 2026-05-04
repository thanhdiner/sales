import { UnorderedListOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ResourceHeader } from '@/components/admin/shared/ResourceManager'
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
  fetchData
}) {
  const { t } = useTranslation('adminProducts')
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
      className="products-wrap admin-products-title-wrap text-base"
      icon={<UnorderedListOutlined />}
      title={t('page.title')}
      utility={<ProductsUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, products, fetchData }} />}
      filter={isFilterVisible && <ProductsFilter onFilter={handleFilter} initialValues={filterInitialValues} />}
    />
  )
}

export default ProductsHeader
