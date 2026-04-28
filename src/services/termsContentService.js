import { get } from '@/utils/clientRequest'
import { get as adminGet, patch as adminPatch } from '@/utils/request'

export const getTermsContent = async () => {
  return await get('terms')
}

export const getAdminTermsContent = async () => {
  return await adminGet('admin/terms')
}

export const updateAdminTermsContent = async data => {
  return await adminPatch('admin/terms', data)
}
