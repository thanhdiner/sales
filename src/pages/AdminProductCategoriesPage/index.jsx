import './AdminProductCategoriesPage.scss'
import AdminProductCategoriesTable from './components/AdminProductCategoriesTable'
import AdminProductCategoriesPagination from './components/AdminProductCategoriesPagination'
import AdminProductCategoriesHeaderActions from './components/AdminProductCategoriesHeaderActions'
import AdminProductCategoriesHeader from './components/AdminProductCategoriesHeader'
import SEO from '@/components/SEO'
import { useAdminProductCategoriesPage } from './hooks/useAdminProductCategoriesPage'

function AdminProductCategoriesPage() {
  const {
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
  } = useAdminProductCategoriesPage()

  return (
    <>
      <SEO title="Admin – Danh mục" noIndex />
            <AdminProductCategoriesHeader
        {...{ setCurrentPage, setLimitItems, setFilterValues, filterInitialValues, columnsVisible, setColumnsVisible, productCategories }}
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
