import { get, patch } from '@/utils/request'

export const getAboutContent = async () => {
  return get('admin/about')
}

export const updateAboutContent = async data => {
  return patch('admin/about', data)
}

export const getAdminAboutContent = getAboutContent
export const updateAdminAboutContent = updateAboutContent
