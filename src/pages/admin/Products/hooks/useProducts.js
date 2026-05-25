import { useMemo, useState } from 'react'
import { getProducts } from '@/services/admin/commerce/product'
import { useAdminResourceColumns, useAdminResourceList } from '@/hooks/shared/adminResourceList'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { useFilterInitialValues } from '@/hooks/shared/useListFilterHelpers'
import { numberFilter, stringFilter } from '@/hooks/shared/useListSearchParams'

const productFilterParsers = {
  productName: stringFilter,
  product_category: stringFilter,
  status: stringFilter,
  price: numberFilter,
  stock: numberFilter,
  position: numberFilter,
  discountPercentage: numberFilter
}

const PRODUCT_COLUMNS_VISIBLE = {
  _id: false,
  title: true,
  productCategory: true,
  price: true,
  stock: true,
  position: false,
  discountPercentage: true,
  status: true,
  thumbnail: true,
  actions: true,
  createdBy: false,
  createdAt: false,
  updateBy: false,
  updateAt: false
}

export function useProducts() {
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
    items: products,
    setItems: setProducts,
    total: totalProducts,
    setTotal: setTotalProducts,
    loading: isLoading,
    fetching: isFetching,
    refetch: fetchData
  } = useAdminResourceList({
    resource: 'products',
    defaultPage: 1,
    defaultPageSize: 10,
    sortable: true,
    filterParsers: productFilterParsers,
    queryKeyDeps: { language },
    queryFn: getProducts,
    selectItems: result => result?.products,
    selectTotal: result => result?.total
  })
  const { columnsVisible, setColumnsVisible } = useAdminResourceColumns({
    storageKey: 'product_columns',
    defaults: PRODUCT_COLUMNS_VISIBLE
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
    totalProducts,
    setTotalProducts,
    selectedRowKeys,
    setSelectedRowKeys,
    products,
    setProducts,
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
