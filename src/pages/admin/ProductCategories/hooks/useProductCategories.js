import { useEffect, useMemo, useState } from 'react'
import { getProductCategories } from '@/services/admin/commerce/productCategory'
import { useAsyncListData } from '@/hooks/shared/useAsyncListData'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { useFilterInitialValues } from '@/hooks/shared/useListFilterHelpers'
import { numberFilter, stringFilter, useListSearchParams } from '@/hooks/shared/useListSearchParams'

const productCategoryFilterParsers = {
  categoryName: stringFilter,
  status: stringFilter,
  position: numberFilter
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
    setFilters: setFilterValues
  } = useListSearchParams({
    defaultPage: 1,
    defaultPageSize: 10,
    sortable: true,
    filterParsers: productCategoryFilterParsers
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
    const saved = localStorage.getItem('productCategory_columns')
    return saved
      ? JSON.parse(saved)
      : {
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
  })

  useEffect(() => {
    localStorage.setItem('productCategory_columns', JSON.stringify(columnsVisible))
  }, [columnsVisible])

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [value, setValue] = useState()
  const [editedPositions, setEditedPositions] = useState({})

  const {
    items: productCategories,
    setItems: setProductCategories,
    total: totalProductCategories,
    setTotal: setTotalProductCategories,
    loading: isLoading,
    refetch: fetchData
  } = useAsyncListData(async () => {
    const result = await getProductCategories(listQuery)

    return {
      items: result?.productCategories,
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
    totalProductCategories,
    setTotalProductCategories,
    selectedRowKeys,
    setSelectedRowKeys,
    productCategories,
    setProductCategories,
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
