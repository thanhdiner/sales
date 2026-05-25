export function maskApiKey(value = '') {
  if (!value) return 'new-...pending'

  return `${value.slice(0, Math.min(4, value.length))}...${value.slice(-4)}`
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value || 0)
}