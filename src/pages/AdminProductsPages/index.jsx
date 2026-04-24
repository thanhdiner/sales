import './AdminProductsPages.scss'
import AdminProductsTable from './components/AdminProductsTable'
import AdminProductsPagination from './components/AdminProductsPagination'
import AdminProductsHeaderActions from './components/AdminProductsHeaderActions'
import AdminProductsHeader from './components/AdminProductsHeader'
import SEO from '@/components/SEO'
import { useAdminProductsPage } from './hooks/useAdminProductsPage'

function AdminProductsPages() {
  const {
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
    setSortOrder,
    sortField,
    setSortField,
    setFilterValues,
    filterInitialValues,
    fetchData
  } = useAdminProductsPage()

  return (
    <>
      <SEO title="Admin – Sản phẩm" noIndex />

      <main className="admin-products-page">
        <div className="admin-products-page__inner">
          <AdminProductsHeader
            {...{
              setCurrentPage,
              setLimitItems,
              setFilterValues,
              filterInitialValues,
              columnsVisible,
              setColumnsVisible,
              products
            }}
          />

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

          <AdminProductsPagination
            {...{
              currentPage,
              totalProducts,
              limitItems,
              setCurrentPage,
              setSelectedRowKeys
            }}
          />
        </div>
      </main>
    </>
  )
}

export default AdminProductsPages