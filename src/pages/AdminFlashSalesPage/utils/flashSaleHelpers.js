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
  const activeClassName =
    'border border-[var(--admin-success-border)] bg-[var(--admin-success-bg-soft)] text-[var(--admin-success-text)]'
  const scheduledClassName =
    'border border-[var(--admin-info-border)] bg-[var(--admin-info-bg-soft)] text-[var(--admin-info-text)]'
  const completedClassName =
    'border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]'

  switch (status) {
    case 'active':
      return { className: activeClassName, label: 'Đang diễn ra' }
    case 'scheduled':
      return { className: scheduledClassName, label: 'Đã lên lịch' }
    case 'completed':
      return { className: completedClassName, label: 'Đã kết thúc' }
    default:
      return { className: completedClassName, label: 'Không xác định' }
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
