import { get, patch } from '@/utils/request'

export const getVipContent = () => {
  return get('admin/vip')
}

export const updateVipContent = data => {
  return patch('admin/vip', data)
}

export const getAdminVipContent = getVipContent
export const updateAdminVipContent = updateVipContent
