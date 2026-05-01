import { get } from '@/utils/clientRequest'

export const getAboutContent = () => {
  return get('about')
}