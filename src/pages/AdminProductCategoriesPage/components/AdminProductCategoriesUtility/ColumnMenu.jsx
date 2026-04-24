import { Checkbox } from 'antd'

function ColumnMenu({ columnsVisible, setColumnsVisible, allColumns }) {
  return (
    <>
      <div className="p-3 min-w-[240px] bg-white rounded-[8px] dark:bg-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <div className="font-semibold text-base mb-1 border-b border-solid border-[#eee] pb-2 dark:text-gray-300">Toggle Columns</div>

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
              <div key={col.value} className="pt-0.5 pb-0.5">
                <label
                  className={`flex items-center gap-2 ${col.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer opacity-100'}`}
                >
                  <Checkbox value={col.value} disabled={col.required} />
                  <span className="dark:text-gray-300">{col.label}</span>
                </label>
              </div>
            ))}
          </div>
        </Checkbox.Group>
        <p className="mt-1 text-[12px] text-[#888] border-t border-solid border-[#eee] pt-2 dark:text-gray-300">
          * These columns are required and cannot be hidden.
        </p>
      </div>
    </>
  )
}

export default ColumnMenu
