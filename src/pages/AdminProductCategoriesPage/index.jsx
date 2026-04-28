import './AdminProductCategoriesPage.scss'
import AdminProductCategoriesTable from './components/AdminProductCategoriesTable'
import AdminProductCategoriesPagination from './components/AdminProductCategoriesPagination'
import AdminProductCategoriesHeaderActions from './components/AdminProductCategoriesHeaderActions'
import AdminProductCategoriesHeader from './components/AdminProductCategoriesHeader'
import SEO from '@/components/SEO'
import { useAdminProductCategoriesPage } from './hooks/useAdminProductCategoriesPage'
import { useTranslation } from 'react-i18next'

function AdminProductCategoriesPage() {
  const { t } = useTranslation('adminProductCategories')
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
    <div className="admin-product-categories-page">
      <SEO title={t('seo.title')} noIndex />
      <div className="admin-product-categories-page__inner">
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
      </div>
    </div>
  )
}

export default AdminProductCategoriesPage
