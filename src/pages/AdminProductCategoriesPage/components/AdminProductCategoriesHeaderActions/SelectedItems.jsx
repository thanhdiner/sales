function SelectedItems({ selectedRowKeys }) {
  return (
    <span className="ml-2 dark:text-gray-200">
      Selected <span className="font-bold">{selectedRowKeys.length}</span> items
    </span>
  )
}

export default SelectedItems
