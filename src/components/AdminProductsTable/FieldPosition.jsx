function FieldPosition({ value, record, setEditedPositions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <input
        type="number"
        defaultValue={value}
        style={{
          width: '100%',
          maxWidth: 60,
          textAlign: 'center',
          padding: '2px 6px',
          border: '1px solid #ccc',
          borderRadius: 4
        }}
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
