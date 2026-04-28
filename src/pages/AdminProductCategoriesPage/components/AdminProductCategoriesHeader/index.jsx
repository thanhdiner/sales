import { UnorderedListOutlined } from '@ant-design/icons'
import AdminTitle from '@/components/AdminTitle'
import AdminProductCategoriesUtility from '../AdminProductCategoriesUtility'
import AdminProductCategoriesFilter from '../AdminProductCategoriesFilter'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function AdminProductCategoriesHeader({
  setCurrentPage,
  setLimitItems,
  setFilterValues,
  filterInitialValues,
  columnsVisible,
  setColumnsVisible,
  productCategories
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
    <>
      <div className="admin-product-categories-wrap flex items-center justify-between">
        <AdminTitle icon={<UnorderedListOutlined className="text-base" />} title={t('page.title')} />
        <AdminProductCategoriesUtility {...{ handleToggleFilter, columnsVisible, setColumnsVisible, productCategories }} />
      </div>
      {isFilterVisible && <AdminProductCategoriesFilter onFilter={handleFilter} initialValues={filterInitialValues} />}
    </>
  )
}

export default AdminProductCategoriesHeader
