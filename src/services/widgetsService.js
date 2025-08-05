import { get } from '@/utils/clientRequest'

export const getActiveWidgets = async () => {
  return await get('widgets')
}
