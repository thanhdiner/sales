function FieldPosition({ value, record, setEditedPositions }) {
  return (
    <div className="admin-products-position-input-wrap">
      <input
        className="admin-products-position-input"
        type="number"
        defaultValue={value}
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
