import { get, post } from '@/utils/request'

export const getPurchaseReceipts = async ({
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

export const createPurchaseReceipt = data => post('admin/purchase-receipts/create', data)
