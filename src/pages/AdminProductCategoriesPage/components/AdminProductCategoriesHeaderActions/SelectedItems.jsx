function SelectedItems({ selectedRowKeys }) {
  return (
    <span className="admin-product-categories-selected-count">
      Selected <span className="font-bold">{selectedRowKeys.length}</span> items
    </span>
  )
}

export default SelectedItems
