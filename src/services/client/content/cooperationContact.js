import { get } from '@/utils/clientRequest'

export const getCooperationContactContent = () => {
  return get('cooperation-contact')
}
