import { useMemo, useState } from 'react'
import { getProductCategories } from '@/services/admin/commerce/productCategory'
import { useAdminResourceColumns, useAdminResourceList } from '@/hooks/shared/adminResourceList'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { useFilterInitialValues } from '@/hooks/shared/useListFilterHelpers'
import { numberFilter, stringFilter } from '@/hooks/shared/useListSearchParams'

const productCategoryFilterParsers = {
  categoryName: stringFilter,
  status: stringFilter,
  position: numberFilter
}

const PRODUCT_CATEGORY_COLUMNS_VISIBLE = {
  _id: true,
  title: true,
  position: true,
  status: true,
  thumbnail: true,
  actions: true,
  createdAt: false,
  createdBy: false,
  updateAt: false,
  updateBy: false
}

export function useProductCategories() {
  const language = useCurrentLanguage()
  const {
    page: currentPage,
    setPage: setCurrentPage,
    pageSize: limitItems,
    setPageSize: setLimitItems,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filters: filterValues,
    setFilters: setFilterValues,
    items: productCategories,
    setItems: setProductCategories,
    total: totalProductCategories,
    setTotal: setTotalProductCategories,
    loading: isLoading,
    fetching: isFetching,
    refetch: fetchData
  } = useAdminResourceList({
    resource: 'product-categories',
    defaultPage: 1,
    defaultPageSize: 10,
    sortable: true,
    filterParsers: productCategoryFilterParsers,
    queryKeyDeps: { language },
    queryFn: getProductCategories,
    selectItems: result => result?.productCategories,
    selectTotal: result => result?.total
  })
  const { columnsVisible, setColumnsVisible } = useAdminResourceColumns({
    storageKey: 'productCategory_columns',
    defaults: PRODUCT_CATEGORY_COLUMNS_VISIBLE
  })
  const filterDefaults = useMemo(() => ({ status: filterValues.status || 'all' }), [filterValues.status])
  const filterInitialValues = useFilterInitialValues(filterValues, limitItems, filterDefaults)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [value, setValue] = useState()
  const [editedPositions, setEditedPositions] = useState({})

  return {
    columnsVisible,
    setColumnsVisible,
    currentPage,
    setCurrentPage,
    limitItems,
    setLimitItems,
    totalProductCategories,
    setTotalProductCategories,
    selectedRowKeys,
    setSelectedRowKeys,
    productCategories,
    setProductCategories,
    isLoading,
    isFetching,
    value,
    setValue,
    editedPositions,
    setEditedPositions,
    sortOrder,
    setSortOrder,
    sortField,
    setSortField,
    filterValues,
    setFilterValues,
    filterInitialValues,
    fetchData
  }
}
