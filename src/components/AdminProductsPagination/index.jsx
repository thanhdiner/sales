import { Pagination } from 'antd'

function AdminProductsPagination({ currentPage, totalProducts, limitItems, setCurrentPage, setSelectedRowKeys }) {
  const handleChangePage = page => {
    setCurrentPage(page)
    setSelectedRowKeys([])
  }

  return (
    <div className="products-pagination">
      <span style={{ marginRight: 8 }}>
        Total <span style={{ fontWeight: 'bold' }}>{totalProducts}</span> products, Page {currentPage} of{' '}
        {Math.ceil(totalProducts / limitItems)}
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

export default AdminProductsPagination
