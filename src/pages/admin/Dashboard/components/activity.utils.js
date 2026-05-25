export const extractClock = value => String(value || '').match(/\d{1,2}:\d{2}/)?.[0] || '--:--'

export const getInitials = value => {
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || 'K'
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || 'H'

  return `${first}${last}`.toUpperCase()
}
