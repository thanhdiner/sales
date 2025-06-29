function renderRow(label, value) {
  return (
    <tr key={label} style={{ borderBottom: '1px solid #eee' }}>
      <td
        style={{
          padding: '0.75rem 1rem',
          fontWeight: 500,
          backgroundColor: '#f9f9f9',
          width: '200px'
        }}
      >
        {label}
      </td>
      <td style={{ padding: '0.75rem 1rem' }}>{value}</td>
    </tr>
  )
}
export default renderRow
