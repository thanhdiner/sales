import { get } from '@/utils/clientRequest'

export const getAboutContent = async () => {
  return await get('about')
}
