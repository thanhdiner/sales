function SelectedItems({ selectedRowKeys }) {
  return (
    <span className="admin-products-selected-count ml-2">
      Selected <span className="font-bold">{selectedRowKeys.length}</span> items
    </span>
  )
}

export default SelectedItems
