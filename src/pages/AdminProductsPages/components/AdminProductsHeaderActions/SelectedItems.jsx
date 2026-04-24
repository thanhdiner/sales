function SelectedItems({ selectedRowKeys }) {
  return (
    <span className="dark:text-gray-300 ml-2">
      Selected <span className="font-bold">{selectedRowKeys.length}</span> items
    </span>
  )
}

export default SelectedItems
