import { UnorderedListOutlined } from '@ant-design/icons'
import AdminTitle from '../AdminTitle'
import AdminProductCategoriesUtility from '../AdminProductCategoriesUtility'
import AdminProductCategoriesFilter from '../AdminProductCategoriesFilter'
import { useState } from 'react'

function AdminProductCategoriesHeader({
  setCurrentPage,
  setLimitItems,
  setFilterValues,
  columnsVisible,
  setColumnsVisible,
  productCategories
}) {
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
      <div className="product-categories-wrap">
        <AdminTitle icon={<UnorderedListOutlined style={{ fontSize: '16px' }} />} title="Product Categories Manager" />
        <AdminProductCategoriesUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, productCategories }} />
      </div>
      {isFilterVisible && <AdminProductCategoriesFilter onFilter={handleFilter} />}
    </>
  )
}

export default AdminProductCategoriesHeader
