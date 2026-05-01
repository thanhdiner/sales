import { get, patch } from '@/utils/request'

export const getTermsContent = () => {
  return get('admin/terms')
}

export const updateTermsContent = data => {
  return patch('admin/terms', data)
}

export const getAdminTermsContent = getTermsContent
export const updateAdminTermsContent = updateTermsContent
