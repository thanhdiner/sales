import { get } from '@/utils/clientRequest'

export const getClientFlashSales = params => {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return get(`flash-sales${query}`)
}

export const getClientFlashSaleById = id => get(`flash-sales/${id}`)
