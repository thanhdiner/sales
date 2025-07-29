import './AdminProductCategoriesPage.scss'
import { useCallback, useEffect, useState } from 'react'
import { getAdminProductCategories } from '@/services/productCategoryService'
import AdminProductCategoriesTable from '@/components/AdminProductCategoriesTable'
import AdminProductCategoriesPagination from '@/components/AdminProductCategoriesPagination'
import AdminProductCategoriesHeaderActions from '@/components/AdminProductCategoriesHeaderActions'
import AdminProductCategoriesHeader from '@/components/AdminProductCategoriesHeader'
import titles from '@/utils/titles'

function AdminProductCategoriesPage() {
  titles('Product Categories')

  const [columnsVisible, setColumnsVisible] = useState(() => {
    const saved = localStorage.getItem('admin_productCategory_columns')
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
    localStorage.setItem('admin_productCategory_columns', JSON.stringify(columnsVisible))
  }, [columnsVisible])

  //# state
  const [currentPage, setCurrentPage] = useState(1)
  const [limitItems, setLimitItems] = useState(10)
  const [totalProductCategories, setTotalProductCategories] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState()
  const [editedPositions, setEditedPositions] = useState({})
  const [sortOrder, setSortOrder] = useState(null)
  const [sortField, setSortField] = useState(null)
  const [filterValues, setFilterValues] = useState({})

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getAdminProductCategories({
        page: currentPage,
        limit: limitItems,
        sortField,
        sortOrder,
        ...filterValues
      })
      setProductCategories(result.productCategories)
      setLimitItems(result.limitItems)
      setTotalProductCategories(result.total)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, limitItems, sortField, sortOrder, filterValues])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <AdminProductCategoriesHeader
        {...{ setCurrentPage, setLimitItems, setFilterValues, columnsVisible, setColumnsVisible, productCategories }}
      />
      <AdminProductCategoriesHeaderActions
        {...{
          selectedRowKeys,
          value,
          setValue,
          productCategories,
          setProductCategories,
          setTotalProductCategories,
          setSelectedRowKeys,
          editedPositions,
          totalProductCategories,
          currentPage,
          setCurrentPage,
          fetchData
        }}
      />
      <AdminProductCategoriesTable
        {...{
          isLoading,
          productCategories,
          setEditedPositions,
          setProductCategories,
          setTotalProductCategories,
          sortField,
          setSortField,
          setSortOrder,
          selectedRowKeys,
          setSelectedRowKeys,
          columnsVisible,
          totalProductCategories,
          currentPage,
          setCurrentPage,
          limitItems,
          sortOrder,
          filterValues,
          fetchData
        }}
      />
      <AdminProductCategoriesPagination {...{ currentPage, totalProductCategories, limitItems, setCurrentPage, setSelectedRowKeys }} />
    </>
  )
}

export default AdminProductCategoriesPage
