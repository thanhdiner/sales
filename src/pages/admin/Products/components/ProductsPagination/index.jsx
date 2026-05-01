import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'

function ProductsPagination({ currentPage, totalProducts, limitItems, setCurrentPage, setSelectedRowKeys }) {
  const { t } = useTranslation('adminProducts')
  const totalPages = Math.ceil(totalProducts / limitItems)

  const handleChangePage = page => {
    setCurrentPage(page)
    setSelectedRowKeys([])
  }

  return (
    <div className="products-pagination">
      <span className="admin-products-pagination-summary mr-2">
        {t('pagination.summary', { total: totalProducts, current: currentPage, pages: totalPages })}
      </span>
      <Pagination
        size="small"
        current={currentPage}
        total={totalProducts}
        pageSize={limitItems}
        onChange={handleChangePage}
        showSizeChanger={false}
        showQuickJumper
      />
    </div>
  )
}

export default ProductsPagination
