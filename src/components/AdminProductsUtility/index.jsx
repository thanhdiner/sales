import { FilePdfOutlined, FilterOutlined, TableOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const utilityButtons = handleToggleFilter => [
  {
    key: 'export',
    icon: <FilePdfOutlined />,
    label: 'Export Products',
    className: '',
    color: 'cyan',
    variant: 'solid',
    onClick: () => console.log('Export not implemented yet')
  },
  {
    key: 'toggle-columns',
    icon: <TableOutlined />,
    label: 'Toggle Columns',
    className: 'custom-btn-orange',
    onClick: () => console.log('Toggle columns not implemented yet')
  },
  {
    key: 'filter',
    icon: <FilterOutlined />,
    label: 'Filter',
    onClick: handleToggleFilter
  }
]

function AdminProductsUtility({ handleToggleFilter }) {
  return (
    <div className="products-utility">
      {utilityButtons(handleToggleFilter).map(btn => (
        <Button key={btn.key} onClick={btn.onClick} className={btn.className} color={btn.color} variant={btn.variant}>
          {btn.icon}
          {btn.label}
        </Button>
      ))}
    </div>
  )
}

export default AdminProductsUtility
