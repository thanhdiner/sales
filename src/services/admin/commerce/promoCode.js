import { del, get, patch, post } from '@/utils/request'

const buildPromoCodeQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getPromoCodes = (params = {}) => {
  return get(`admin/promo-codes${buildPromoCodeQueryString(params)}`)
}

export const createPromoCode = formData => {
  return post('admin/promo-codes/create', formData)
}

export const updatePromoCode = (id, formData) => {
  return patch(`admin/promo-codes/update/${id}`, formData)
}

export const deletePromoCode = id => {
  return del(`admin/promo-codes/delete/${id}`)
}

export const getPromoCode = id => {
  return get(`admin/promo-codes/${id}`)
}

export const getPromoCodeDetail = getPromoCode
