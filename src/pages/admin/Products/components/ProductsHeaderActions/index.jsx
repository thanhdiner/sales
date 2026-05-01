import AddButton from './AddButton'
import ApplyButton from './ApplyButton'
import SelectedItems from './SelectedItems'
import SelectList from './SelectList'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { useTranslation } from 'react-i18next'

function ProductsHeaderActions({
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
  const { t } = useTranslation('adminProducts')
  const permissions = useAdminPermissions()

  const treeData = [
    permissions.includes('delete_product') && { title: t('bulk.actions.delete'), value: 'delete' },
    permissions.includes('edit_product') && {
      title: t('bulk.actions.changePosition'),
      value: 'change-position'
    },
    permissions.includes('edit_product') && {
      title: t('bulk.actions.changeStatus'),
      value: 'change-status',
      disabled: true,
      children: [
        { title: t('status.active'), value: 'status-active' },
        { title: t('status.inactive'), value: 'status-inactive' }
      ]
    }
  ].filter(Boolean)

  return (
    <div className="products-header">
      <SelectedItems {...{ selectedRowKeys }} />
      <div className="products-header-right">
        {permissions.includes('create_product') && <AddButton />}
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

export default ProductsHeaderActions
