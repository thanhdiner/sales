import { get } from '@/utils/clientRequest'

export const getContactPageContent = () => {
  return get('contact/page')
}
