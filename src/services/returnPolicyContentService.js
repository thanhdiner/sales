import { get as adminGet, patch } from '@/utils/request'
import { get as clientGet } from '@/utils/clientRequest'

export const getReturnPolicyContent = async () => {
  return await clientGet('return-policy/page')
}

export const getAdminReturnPolicyContent = async () => {
  return await adminGet('admin/return-policy')
}

export const updateAdminReturnPolicyContent = async data => {
  return await patch('admin/return-policy', data)
}
