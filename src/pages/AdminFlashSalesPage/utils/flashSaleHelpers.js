import dayjs from 'dayjs'

export const EMPTY_FLASH_SALE_FORM = {
  name: '',
  startAt: null,
  endAt: null,
  discountPercent: '',
  maxQuantity: '',
  products: []
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(amount) || 0)
}

export function getFlashSaleStatusMeta(status) {
  switch (status) {
    case 'active':
      return { className: 'bg-green-100 text-green-800', label: 'Đang diễn ra' }
    case 'scheduled':
      return { className: 'bg-blue-100 text-blue-800', label: 'Đã lên lịch' }
    case 'completed':
      return { className: 'bg-gray-100 text-gray-800', label: 'Đã kết thúc' }
    default:
      return { className: 'bg-gray-100 text-gray-800', label: 'Không xác định' }
  }
}

export function getFlashSaleProgressPercent(sale) {
  if (!sale?.maxQuantity) return 0
  return Math.min((Number(sale.soldQuantity) / Number(sale.maxQuantity)) * 100, 100)
}

export function getFlashSaleStats(flashSales) {
  const sales = Array.isArray(flashSales) ? flashSales : []

  return {
    totalRevenue: sales.reduce((sum, sale) => sum + (Number(sale.revenue) || 0), 0),
    activeSales: sales.filter(sale => sale.status === 'active').length,
    totalProductsSold: sales.reduce((sum, sale) => sum + (Number(sale.soldQuantity) || 0), 0),
    totalPrograms: sales.length
  }
}

export function mapFlashSaleToFormData(item) {
  return {
    name: item?.name || '',
    startAt: item?.startAt ? dayjs(item.startAt) : null,
    endAt: item?.endAt ? dayjs(item.endAt) : null,
    discountPercent: item?.discountPercent ?? '',
    maxQuantity: item?.maxQuantity ?? '',
    products: (item?.products || []).map(product => (typeof product === 'object' ? product._id : product))
  }
}

export function serializeFlashSaleForm(formData) {
  return {
    name: formData.name,
    startAt: formData.startAt.toISOString(),
    endAt: formData.endAt.toISOString(),
    discountPercent: parseInt(formData.discountPercent, 10),
    maxQuantity: parseInt(formData.maxQuantity, 10),
    products: formData.products
  }
}

export function validateFlashSaleForm(formData) {
  if (!formData.name?.trim()) return 'Vui lòng nhập tên chương trình!'
  if (!formData.startAt) return 'Vui lòng chọn ngày bắt đầu!'
  if (!formData.endAt) return 'Vui lòng chọn ngày kết thúc!'
  if (!formData.discountPercent) return 'Vui lòng nhập phần trăm giảm giá!'
  if (!formData.maxQuantity) return 'Vui lòng nhập số lượng tối đa!'
  if (!Array.isArray(formData.products) || formData.products.length === 0) {
    return 'Vui lòng chọn ít nhất một sản phẩm!'
  }
  if (dayjs(formData.endAt).isBefore(dayjs(formData.startAt))) {
    return 'Thời gian kết thúc phải sau thời gian bắt đầu!'
  }
  return null
}

export function mergeProductOptions(products, selectedIds, existingProducts = []) {
  const mergedProducts = [...(products || [])]
  const existingMap = new Map((existingProducts || []).map(product => [product._id, product]))

  ;(selectedIds || []).forEach(id => {
    if (!mergedProducts.find(product => product._id === id)) {
      mergedProducts.push(existingMap.get(id) || { _id: id, title: 'Đang tải...' })
    }
  })

  return mergedProducts
}
