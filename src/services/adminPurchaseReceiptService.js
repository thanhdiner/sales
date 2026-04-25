import { get, post } from '@/utils/request'

export const getPurchaseReceipts = async ({ page = 1, limit = 20, keyword = '' } = {}) => {
  const query = new URLSearchParams({ page, limit, keyword }).toString()
  return get(`admin/purchase-receipts?${query}`)
}

export const createPurchaseReceipt = data => post('admin/purchase-receipts/create', data)
