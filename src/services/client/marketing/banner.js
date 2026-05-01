import { get } from '@/utils/clientRequest'

export const getActiveBanners = () => {
  return get('banners')
}