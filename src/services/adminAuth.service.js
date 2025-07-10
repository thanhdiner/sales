import { post } from '../utils/request'

export const authAdminLogin = async data => {
  return await post(`admin/auth/login`, data)
}

export const authAdminLogout = async () => {
  return await post(`admin/auth/logout`)
}

export const authAdminRefresh = async () => {
  return await post('admin/auth/refresh-token')
}
