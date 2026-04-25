function FieldPosition({ value, record, setEditedPositions }) {
  return (
    <div className="admin-product-categories-position-input-wrap">
      <input
        type="number"
        defaultValue={value}
        className="admin-product-categories-position-input"
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
