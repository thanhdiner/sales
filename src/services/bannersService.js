import { get } from '@/utils/clientRequest'

export const getActiveBanners = async () => {
  return await get('banners')
}
