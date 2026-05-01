import { get } from '@/utils/clientRequest'

export const getFlashSales = params => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  return get(`flash-sales${query}`)
}

export const getFlashSale = id => {
  return get(`flash-sales/${id}`)
}

export const getClientFlashSales = getFlashSales
export const getClientFlashSale = getFlashSale