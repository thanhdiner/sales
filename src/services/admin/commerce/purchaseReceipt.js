import { get, post } from '@/utils/request'

export const getPurchaseReceipts = ({
  page = 1,
  limit = 20,
  keyword = '',
  productId = '',
  supplierName = '',
  dateFrom = '',
  dateTo = '',
  lang
} = {}) => {
  const query = new URLSearchParams({
    page,
    limit,
    ...(keyword ? { keyword } : {}),
    ...(productId ? { productId } : {}),
    ...(supplierName ? { supplierName } : {}),
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
    ...(lang ? { lang } : {})
  }).toString()

  return get(`admin/purchase-receipts?${query}`)
}

export const createPurchaseReceipt = data => {
  return post('admin/purchase-receipts/create', data)
}
