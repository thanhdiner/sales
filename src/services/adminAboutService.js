import { get, patch } from '@/utils/request'

export const getAdminAboutContent = async () => {
  return await get('admin/about')
}

export const updateAdminAboutContent = async data => {
  return await patch('admin/about', data)
}
