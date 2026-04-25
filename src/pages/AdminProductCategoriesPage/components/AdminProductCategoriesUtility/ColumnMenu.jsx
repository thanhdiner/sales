import { Checkbox } from 'antd'

function ColumnMenu({ columnsVisible, setColumnsVisible, allColumns }) {
  return (
    <>
      <div className="admin-product-categories-column-menu p-3 min-w-[240px] rounded-[8px]">
        <div className="admin-product-categories-column-menu__title font-semibold text-base mb-1 border-b border-solid pb-2">Toggle Columns</div>

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
            {allColumns.map((col, index) => (
              <div key={col.value} className="admin-product-categories-column-menu__item pt-0.5 pb-0.5">
                <label
                  className={`flex items-center gap-2 ${col.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer opacity-100'}`}
                >
                  <Checkbox value={col.value} disabled={col.required} />
                  <span className="admin-product-categories-column-menu__label">{col.label}</span>
                </label>
              </div>
            ))}
          </div>
        </Checkbox.Group>
        <p className="admin-product-categories-column-menu__note mt-1 text-[12px] border-t border-solid pt-2">
          * These columns are required and cannot be hidden.
        </p>
      </div>
    </>
  )
}

export default ColumnMenu
