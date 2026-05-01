import { get } from '@/utils/clientRequest'

export const getFaqContent = () => {
  return get('faq/page')
}