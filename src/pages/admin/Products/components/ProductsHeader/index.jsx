import { UnorderedListOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminTitle from '@/components/admin/Title'
import ProductsUtility from '../ProductsUtility'
import ProductsFilter from '../ProductsFilter'

function ProductsHeader({
  setCurrentPage,
  setLimitItems,
  setFilterValues,
  filterInitialValues,
  columnsVisible,
  setColumnsVisible,
  products
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
    <>
      <div className="products-wrap admin-products-title-wrap text-base">
        <AdminTitle icon={<UnorderedListOutlined />} title={t('page.title')} />
        <ProductsUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, products }} />
      </div>
      {isFilterVisible && <ProductsFilter onFilter={handleFilter} initialValues={filterInitialValues} />}
    </>
  )
}

export default ProductsHeader
