import { get } from '@/utils/clientRequest'

export const getActiveWidgets = () => {
  return get('widgets')
}