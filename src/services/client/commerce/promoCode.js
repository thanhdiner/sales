import { get, post } from '@/utils/clientRequest'

export const getPromoCodes = () => {
  return get('promo-codes')
}

export const validatePromoCode = data => {
  return post('promo-codes/validate', data)
}