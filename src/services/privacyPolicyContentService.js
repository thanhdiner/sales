import { get as adminGet, patch } from '@/utils/request'
import { get as clientGet } from '@/utils/clientRequest'

export const getPrivacyPolicyContent = async () => {
  return await clientGet('privacy-policy')
}

export const getAdminPrivacyPolicyContent = async () => {
  return await adminGet('admin/privacy-policy')
}

export const updateAdminPrivacyPolicyContent = async data => {
  return await patch('admin/privacy-policy', data)
}
