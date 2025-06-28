function SelectedItems({ selectedRowKeys }) {
  return (
    <span style={{ marginLeft: 8 }}>
      Selected <span style={{ fontWeight: 'bold' }}>{selectedRowKeys.length}</span> items
    </span>
  )
}

export default SelectedItems
