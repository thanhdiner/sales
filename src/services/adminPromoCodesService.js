import { del, get, patch, post } from '@/utils/request'

export const getPromoCodes = params => get('admin/promo-codes', params)
export const createPromoCode = formData => post('admin/promo-codes/create', formData)
export const updatePromoCode = (id, formData) => patch(`admin/promo-codes/update/${id}`, formData)
export const deletePromoCode = id => del(`admin/promo-codes/delete/${id}`)
export const getPromoCodeDetail = id => get(`admin/promo-codes/${id}`)
