import { get, patch } from '@/utils/request'

export const getReturnPolicyContent = () => {
  return get('admin/return-policy')
}

export const updateReturnPolicyContent = data => {
  return patch('admin/return-policy', data)
}
