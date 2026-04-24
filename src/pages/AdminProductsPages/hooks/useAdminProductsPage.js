import { useEffect, useMemo, useState } from 'react'
import { getAdminProducts } from '@/services/adminProductService'
import { useAsyncListData } from '@/hooks/useAsyncListData'
import { useFilterInitialValues } from '@/hooks/useListFilterHelpers'
import { numberFilter, stringFilter, useListSearchParams } from '@/hooks/useListSearchParams'

const productFilterParsers = {
  productName: stringFilter,
  product_category: stringFilter,
  status: stringFilter,
  price: numberFilter,
  stock: numberFilter,
  position: numberFilter,
  discountPercentage: numberFilter
}

export function useAdminProductsPage() {
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
    setFilters: setFilterValues
  } = useListSearchParams({
    defaultPage: 1,
    defaultPageSize: 10,
    sortable: true,
    filterParsers: productFilterParsers
  })

  const filterDefaults = useMemo(() => ({ status: filterValues.status || 'all' }), [filterValues.status])
  const filterInitialValues = useFilterInitialValues(filterValues, limitItems, filterDefaults)

  const listQuery = useMemo(
    () => ({
      page: currentPage,
      limit: limitItems,
      sortField,
      sortOrder,
      ...filterValues
    }),
    [currentPage, limitItems, sortField, sortOrder, filterValues]
  )

  const [columnsVisible, setColumnsVisible] = useState(() => {
    const saved = localStorage.getItem('admin_product_columns')
    return saved
      ? JSON.parse(saved)
      : {
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
  })

  useEffect(() => {
    localStorage.setItem('admin_product_columns', JSON.stringify(columnsVisible))
  }, [columnsVisible])

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [value, setValue] = useState()
  const [editedPositions, setEditedPositions] = useState({})

  const {
    items: products,
    setItems: setProducts,
    total: totalProducts,
    setTotal: setTotalProducts,
    loading: isLoading,
    refetch: fetchData
  } = useAsyncListData(
    async () => {
      const result = await getAdminProducts(listQuery)

      return {
        items: result?.products,
        total: result?.total
      }
    },
    [listQuery]
  )
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
