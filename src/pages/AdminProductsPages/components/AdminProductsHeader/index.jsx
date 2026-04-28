import { UnorderedListOutlined } from '@ant-design/icons'
import AdminTitle from '@/components/AdminTitle'
import AdminProductsUtility from '../AdminProductsUtility'
import AdminProductsFilter from '../AdminProductsFilter'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function AdminProductsHeader({ setCurrentPage, setLimitItems, setFilterValues, filterInitialValues, columnsVisible, setColumnsVisible, products }) {
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
        <AdminProductsUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, products }} />
      </div>
      {isFilterVisible && <AdminProductsFilter onFilter={handleFilter} initialValues={filterInitialValues} />}
    </>
  )
}

export default AdminProductsHeader
