import './AdminProductsPages.scss'
import { useEffect, useState } from 'react'
import { getAdminProducts } from '../../services/productService'
import AdminProductsTable from '../../components/AdminProductsTable'
import AdminProductsPagination from '../../components/AdminProductsPagination'
import AdminProductsHeaderActions from '../../components/AdminProductsHeaderActions'
import AdminProductsHeader from '../../components/AdminProductsHeader'

function AdminProductsPages() {
  const [columnsVisible, setColumnsVisible] = useState({
    _id: true,
    title: true,
    price: true,
    stock: true,
    position: true,
    discountPercentage: true,
    status: true,
    actions: true
  })

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

  useEffect(() => {
    const fetchData = async () => {
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
    }

    fetchData()
  }, [currentPage, limitItems, sortField, sortOrder, filterValues])

  return (
    <>
      <AdminProductsHeader {...{ setCurrentPage, setLimitItems, setFilterValues, columnsVisible, setColumnsVisible }} />
      <AdminProductsHeaderActions
        {...{ selectedRowKeys, value, setValue, products, setProducts, setTotalProducts, setSelectedRowKeys, editedPositions }}
      />
      <AdminProductsTable
        {...{
          isLoading,
          products,
          setEditedPositions,
          setTotalProducts,
          setProducts,
          sortField,
          setSortField,
          setSortOrder,
          selectedRowKeys,
          setSelectedRowKeys,
          columnsVisible
        }}
      />
      <AdminProductsPagination {...{ currentPage, totalProducts, limitItems, setCurrentPage, setSelectedRowKeys }} />
    </>
  )
}

export default AdminProductsPages
