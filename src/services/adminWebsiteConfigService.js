import { get, patch } from '@/utils/request'

export const getAdminWebsiteConfig = async () => {
  return await get(`admin/website-config`)
}

export const editAdminWebsiteConfig = async data => {
  return await patch(`admin/website-config/edit`, data)
}
