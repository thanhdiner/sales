import { Checkbox } from 'antd'

function ColumnMenu({ columnsVisible, setColumnsVisible, allColumns }) {
  return (
    <>
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
    </>
  )
}

export default ColumnMenu
