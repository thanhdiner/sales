function FieldPosition({ value, record, setEditedPositions }) {
  return (
    <div className="flex justify-center">
      <input
        type="number"
        defaultValue={value}
        className="w-full max-w-[60px] text-center text-black p-[2px_6px] border border-[#ccc] rounded-[4px] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        onChange={e => {
          const newVal = Number(e.target.value)
          setEditedPositions(prev => ({
            ...prev,
            [record._id]: newVal
          }))
        }}
      />
    </div>
  )
}

export default FieldPosition
