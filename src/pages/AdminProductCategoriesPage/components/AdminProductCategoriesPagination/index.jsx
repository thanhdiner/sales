import { Pagination } from 'antd'

function AdminProductCategoriesPagination({ currentPage, totalProductCategories, limitItems, setCurrentPage, setSelectedRowKeys }) {
  const handleChangePage = page => {
    setCurrentPage(page)
    setSelectedRowKeys([])
  }

  return (
    <div className="product-categories-pagination">
      <span className="admin-product-categories-pagination-summary">
        Total <span className="font-bold">{totalProductCategories}</span> categories, Page {currentPage} of{' '}
        {Math.ceil(totalProductCategories / limitItems)}
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
