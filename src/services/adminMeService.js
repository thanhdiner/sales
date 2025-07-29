import { get } from '../utils/request'

export const getAdminMe = async () => {
  return await get('admin/me')
}
