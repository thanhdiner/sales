export const getTextValue = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback

  const normalizedValue = value.trim()

  return normalizedValue && normalizedValue !== '[object Object]' ? value : fallback
}
