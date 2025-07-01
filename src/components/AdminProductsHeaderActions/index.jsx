import AddButton from './AddButton'
import ApplyButton from './ApplyButton'
import SelectedItems from './SelectedItems'
import SelectList from './SelectList'

function AdminProductsHeaderActions({
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
}) {
  const treeData = [
    {
      title: 'Delete',
      value: 'delete'
    },
    {
      title: 'Change Position',
      value: 'change-position'
    },
    {
      title: 'Change Status',
      value: 'change-status',
      disabled: true,
      children: [
        {
          title: 'Active',
          value: 'status-active'
        },
        {
          title: 'Inactive',
          value: 'status-inactive'
        }
      ]
    }
  ]

  return (
    <div className="products-header">
      <SelectedItems {...{ selectedRowKeys }} />
      <div className="products-header-right">
        <AddButton />
        <SelectList {...{ value, treeData, setValue }} />
        <ApplyButton
          {...{
            value,
            setValue,
            selectedRowKeys,
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
      </div>
    </div>
  )
}

export default AdminProductsHeaderActions
