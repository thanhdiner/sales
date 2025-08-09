import { get } from '@/utils/clientRequest'

export const getActiveBankInfo = () => get('bank-info/active')
