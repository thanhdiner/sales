import { get } from '@/utils/request'

export const getMe = () => {
  return get('admin/me')
}

export const getAdminMe = getMe
