import './index.scss'
import ProductCategoriesTable from './components/ProductCategoriesTable'
import ProductCategoriesPagination from './components/ProductCategoriesPagination'
import ProductCategoriesHeaderActions from './components/ProductCategoriesHeaderActions'
import ProductCategoriesHeader from './components/ProductCategoriesHeader'
import SEO from '@/components/shared/SEO'
import { useProductCategories } from './hooks/useProductCategories'
import { useTranslation } from 'react-i18next'

function ProductCategories() {
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
  } = useProductCategories()

  return (
    <div className="admin-product-categories-page">
      <SEO title={t('seo.title')} noIndex />
      <div className="admin-product-categories-page__inner">
        <ProductCategoriesHeader
          {...{ setCurrentPage, setLimitItems, setFilterValues, filterInitialValues, columnsVisible, setColumnsVisible, productCategories, fetchData }}
        />
        <ProductCategoriesHeaderActions
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
        <ProductCategoriesTable
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
        <ProductCategoriesPagination {...{ currentPage, totalProductCategories, limitItems, setCurrentPage, setSelectedRowKeys }} />
      </div>
    </div>
  )
}

export default ProductCategories
