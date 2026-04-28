export const getTextValue = (value, fallback = '') => {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export const getArrayValue = (value, fallback = []) => {
  return Array.isArray(value) && value.length ? value : fallback
}

export const navigateToAboutLink = (navigate, link, fallback = '/') => {
  const target = getTextValue(link, fallback)

  if (/^(https?:|mailto:|tel:)/i.test(target)) {
    window.location.href = target
    return
  }

  navigate(target)
}
