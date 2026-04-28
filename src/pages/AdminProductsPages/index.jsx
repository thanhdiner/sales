import './AdminProductsPages.scss'
import AdminProductsTable from './components/AdminProductsTable'
import AdminProductsPagination from './components/AdminProductsPagination'
import AdminProductsHeaderActions from './components/AdminProductsHeaderActions'
import AdminProductsHeader from './components/AdminProductsHeader'
import SEO from '@/components/SEO'
import { useAdminProductsPage } from './hooks/useAdminProductsPage'
import { useTranslation } from 'react-i18next'

function AdminProductsPages() {
  const { t } = useTranslation('adminProducts')
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
    sortOrder,
    setSortOrder,
    sortField,
    setSortField,
    setFilterValues,
    filterInitialValues,
    fetchData
  } = useAdminProductsPage()

  return (
    <>
      <SEO title={t('seo.title')} noIndex />

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
              sortOrder,
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
