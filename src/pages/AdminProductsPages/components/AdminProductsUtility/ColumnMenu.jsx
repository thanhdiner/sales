import { Checkbox } from 'antd'

function ColumnMenu({ columnsVisible, setColumnsVisible, allColumns }) {
  return (
    <>
      <div className="admin-products-column-menu p-3 min-w-[240px] rounded-[8px]">
        <div className="admin-products-column-menu__title mb-1 border-b pb-2 text-base font-semibold">Toggle Columns</div>

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
          <div className="grid grid-cols-2 gap-x-3">
            {allColumns.map(col => (
              <div key={col.value} className="pt-0.5 pb-0.5">
                <label
                  className={`admin-products-column-menu__item flex items-center gap-2 ${
                    col.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer opacity-100'
                  }`}
                >
                  <Checkbox value={col.value} disabled={col.required} />
                  <span>{col.label}</span>
                </label>
              </div>
            ))}
          </div>
        </Checkbox.Group>
        <p className="admin-products-column-menu__note mt-1 border-t pt-2 text-[12px]">
          * These columns are required and cannot be hidden.
        </p>
      </div>
    </>
  )
}

export default ColumnMenu
