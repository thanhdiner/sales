import './AdminProductsPages.scss'
import { useCallback, useEffect, useState } from 'react'
import { getAdminProducts } from '@/services/productService'
import AdminProductsTable from '@/components/AdminProductsTable'
import AdminProductsPagination from '@/components/AdminProductsPagination'
import AdminProductsHeaderActions from '@/components/AdminProductsHeaderActions'
import AdminProductsHeader from '@/components/AdminProductsHeader'
import titles from '@/utils/titles'

function AdminProductsPages() {
  titles('Products')

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

  //# state
  const [currentPage, setCurrentPage] = useState(1)
  const [limitItems, setLimitItems] = useState(10)
  const [totalProducts, setTotalProducts] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState()
  const [editedPositions, setEditedPositions] = useState({})
  const [sortOrder, setSortOrder] = useState(null)
  const [sortField, setSortField] = useState(null)
  const [filterValues, setFilterValues] = useState({})

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getAdminProducts({
        page: currentPage,
        limit: limitItems,
        sortField,
        sortOrder,
        ...filterValues
      })
      setProducts(result.products)
      setLimitItems(result.limitItems)
      setTotalProducts(result.total)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, limitItems, sortField, sortOrder, filterValues])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <AdminProductsHeader {...{ setCurrentPage, setLimitItems, setFilterValues, columnsVisible, setColumnsVisible, products }} />
      <AdminProductsHeaderActions
        {...{
          selectedRowKeys,
          value,
          setValue,
          products,
          setProducts,
          setTotalProducts,
          setSelectedRowKeys,
          editedPositions,
          totalProducts,
          currentPage,
          setCurrentPage,
          fetchData
        }}
      />
      <AdminProductsTable
        {...{
          isLoading,
          products,
          setEditedPositions,
          setProducts,
          sortField,
          setSortField,
          setSortOrder,
          selectedRowKeys,
          setSelectedRowKeys,
          columnsVisible,
          totalProducts,
          currentPage,
          setCurrentPage,
          fetchData
        }}
      />
      <AdminProductsPagination {...{ currentPage, totalProducts, limitItems, setCurrentPage, setSelectedRowKeys }} />
    </>
  )
}

export default AdminProductsPages
