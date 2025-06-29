import { UnorderedListOutlined } from '@ant-design/icons'
import AdminTitle from '../AdminTitle'
import AdminProductsUtility from '../AdminProductsUtility'
import AdminProductsFilter from '../AdminProductsFilter'
import { useState } from 'react'

function AdminProductsHeader({ setCurrentPage, setLimitItems, setFilterValues, columnsVisible, setColumnsVisible, products }) {
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
      <div className="products-wrap">
        <AdminTitle icon={<UnorderedListOutlined style={{ fontSize: '16px' }} />} title="Product Manager" />
        <AdminProductsUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, products }} />
      </div>
      {isFilterVisible && <AdminProductsFilter onFilter={handleFilter} />}
    </>
  )
}

export default AdminProductsHeader
