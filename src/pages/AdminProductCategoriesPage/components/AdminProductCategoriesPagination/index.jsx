import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'

function AdminProductCategoriesPagination({ currentPage, totalProductCategories, limitItems, setCurrentPage, setSelectedRowKeys }) {
  const { t } = useTranslation('adminProductCategories')

  const handleChangePage = page => {
    setCurrentPage(page)
    setSelectedRowKeys([])
  }

  return (
    <div className="product-categories-pagination">
      <span className="admin-product-categories-pagination-summary">
        {t('pagination.summary', {
          total: totalProductCategories,
          current: currentPage,
          pages: Math.ceil(totalProductCategories / limitItems)
        })}
      </span>
      <Pagination
        size="small"
        current={currentPage}
        total={totalProductCategories}
        pageSize={limitItems}
        onChange={handleChangePage}
        showSizeChanger={false}
        showQuickJumper
      />
    </div>
  )
}

export default AdminProductCategoriesPagination
