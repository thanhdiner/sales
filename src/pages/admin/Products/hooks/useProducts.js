import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '@/services/admin/commerce/product'
import { useAsyncListData } from '@/hooks/shared/useAsyncListData'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { useFilterInitialValues } from '@/hooks/shared/useListFilterHelpers'
import { numberFilter, stringFilter, useListSearchParams } from '@/hooks/shared/useListSearchParams'

const productFilterParsers = {
  productName: stringFilter,
  product_category: stringFilter,
  status: stringFilter,
  price: numberFilter,
  stock: numberFilter,
  position: numberFilter,
  discountPercentage: numberFilter
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
    const saved = localStorage.getItem('product_columns')
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
    localStorage.setItem('product_columns', JSON.stringify(columnsVisible))
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
  } = useAsyncListData(async () => {
    const result = await getProducts(listQuery)

    return {
      items: result?.products,
      total: result?.total
    }
  }, [listQuery, language])

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
