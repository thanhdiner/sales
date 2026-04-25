import { UnorderedListOutlined } from '@ant-design/icons'
import AdminTitle from '@/components/AdminTitle'
import AdminProductCategoriesUtility from '../AdminProductCategoriesUtility'
import AdminProductCategoriesFilter from '../AdminProductCategoriesFilter'
import { useState } from 'react'

function AdminProductCategoriesHeader({
  setCurrentPage,
  setLimitItems,
  setFilterValues,
  filterInitialValues,
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
      <div className="admin-product-categories-wrap flex items-center justify-between">
        <AdminTitle icon={<UnorderedListOutlined className="text-base" />} title="Product Categories Manager" />
        <AdminProductCategoriesUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, productCategories }} />
      </div>
      {isFilterVisible && <AdminProductCategoriesFilter onFilter={handleFilter} initialValues={filterInitialValues} />}
    </>
  )
}

export default AdminProductCategoriesHeader
