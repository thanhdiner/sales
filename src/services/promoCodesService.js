import { get, post } from '@/utils/clientRequest'

export const getPromoCodes = () => get('promo-codes')
export const validatePromoCode = data => post('promo-codes/validate', data)
