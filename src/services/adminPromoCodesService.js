import { del, get, patch, post } from '@/utils/request'

export const getPromoCodes = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') acc[key] = value
      return acc
    }, {})
  ).toString()

  return get(`admin/promo-codes${query ? `?${query}` : ''}`)
}
export const createPromoCode = formData => post('admin/promo-codes/create', formData)
export const updatePromoCode = (id, formData) => patch(`admin/promo-codes/update/${id}`, formData)
export const deletePromoCode = id => del(`admin/promo-codes/delete/${id}`)
export const getPromoCodeDetail = id => get(`admin/promo-codes/${id}`)
