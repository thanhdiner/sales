import { FilePdfOutlined, FilterOutlined, TableOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown } from 'antd'

function AdminProductsUtility({ handleToggleFilter, columnsVisible, setColumnsVisible }) {
  const allColumns = [
    { label: 'ID', value: '_id' },
    { label: 'Title', value: 'title' },
    { label: 'Price', value: 'price' },
    { label: 'Stock', value: 'stock' },
    { label: 'Position', value: 'position' },
    { label: 'Discount %', value: 'discountPercentage' },
    { label: 'Status', value: 'status' },
    { label: 'Thumbnail *', value: 'thumbnail', required: true },
    { label: 'Actions *', value: 'actions', required: true }
  ]
  const columnMenu = (
    <div
      style={{
        padding: 12,
        minWidth: 240,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 6,
          borderBottom: '1px solid #eee',
          paddingBottom: 8
        }}
      >
        Toggle Columns
      </div>

      <Checkbox.Group
        value={Object.keys(columnsVisible).filter(key => columnsVisible[key])}
        onChange={checkedValues => {
          const updated = {}
          allColumns.forEach(col => {
            updated[col.value] = col.required ? true : checkedValues.includes(col.value)
          })
          setColumnsVisible(updated)
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0px 12px'
          }}
        >
          {allColumns.map((col, index) => (
            <div
              key={col.value}
              style={{
                paddingBottom: 2,
                paddingTop: 2
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: col.required ? 'not-allowed' : 'pointer',
                  opacity: col.required ? 0.6 : 1
                }}
              >
                <Checkbox value={col.value} disabled={col.required} />
                <span>{col.label}</span>
              </label>
            </div>
          ))}
        </div>
      </Checkbox.Group>
      <p style={{ marginTop: 5, fontSize: 12, color: '#888', borderTop: '1px solid #eee', paddingTop: 8 }}>
        * These columns are required and cannot be hidden.
      </p>
    </div>
  )

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
      dropdown: (
        <Dropdown dropdownRender={() => columnMenu} trigger={['click']} placement="bottomRight" arrow>
          <Button className="custom-btn-orange">
            <TableOutlined />
            Toggle Columns
          </Button>
        </Dropdown>
      ),
      icon: <TableOutlined />,
      label: 'Toggle Columns',
      className: 'custom-btn-orange'
    },
    {
      key: 'filter',
      icon: <FilterOutlined />,
      label: 'Filter',
      onClick: handleToggleFilter
    }
  ]

  return (
    <div className="products-utility">
      {utilityButtons(handleToggleFilter).map(btn =>
        btn.dropdown ? (
          <div key={btn.key}>{btn.dropdown}</div>
        ) : (
          <Button key={btn.key} onClick={btn.onClick} className={btn.className} color={btn.color} variant={btn.variant}>
            {btn.icon}
            {btn.label}
          </Button>
        )
      )}
    </div>
  )
}

export default AdminProductsUtility
