import { get } from '@/utils/clientRequest'

export const getActiveBankInfo = () => {
  return get('bank-info/active')
}