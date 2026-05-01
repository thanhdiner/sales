import { get } from '@/utils/clientRequest'

export const getTermsContent = () => {
  return get('terms')
}