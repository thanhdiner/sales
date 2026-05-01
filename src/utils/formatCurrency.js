export const formatVND = (value, { withSuffix = false } = {}) => {
  const number = new Intl.NumberFormat('vi-VN').format(value)
  return withSuffix ? `${number} đ` : number
}
