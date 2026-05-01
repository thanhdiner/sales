import { get, patch } from '@/utils/request'

export const getPrivacyPolicyContent = () => {
  return get('admin/privacy-policy')
}

export const updatePrivacyPolicyContent = data => {
  return patch('admin/privacy-policy', data)
}
