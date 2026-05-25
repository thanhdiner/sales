import { useState } from 'react'
import AdminTitle from '@/components/admin/Title'

function ResourceListHeader({
  className,
  icon,
  title,
  utility,
  FilterComponent,
  filterInitialValues,
  setCurrentPage,
  setLimitItems,
  setFilterValues
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
      <div className={className}>
        <AdminTitle icon={icon} title={title} />
        {typeof utility === 'function' ? utility({ handleToggleFilter }) : utility}
      </div>
      {isFilterVisible && FilterComponent && <FilterComponent onFilter={handleFilter} initialValues={filterInitialValues} />}
    </>
  )
}

export default ResourceListHeader
