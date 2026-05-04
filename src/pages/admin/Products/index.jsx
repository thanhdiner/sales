import './index.scss'
import ProductsTable from './components/ProductsTable'
import ProductsPagination from './components/ProductsPagination'
import ProductsHeaderActions from './components/ProductsHeaderActions'
import ProductsHeader from './components/ProductsHeader'
import SEO from '@/components/shared/SEO'
import { useProducts } from './hooks/useProducts'
import { useTranslation } from 'react-i18next'

function Products() {
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
  } = useProducts()

  return (
    <>
      <SEO title={t('seo.title')} noIndex />

      <main className="admin-products-page">
        <div className="admin-products-page__inner">
          <ProductsHeader
            {...{
              setCurrentPage,
              setLimitItems,
              setFilterValues,
              filterInitialValues,
              columnsVisible,
              setColumnsVisible,
              products,
              fetchData
            }}
          />

          <ProductsHeaderActions
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

          <ProductsTable
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

          <ProductsPagination
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

export default Products
