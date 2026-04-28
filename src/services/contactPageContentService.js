import { get as adminGet, patch } from '@/utils/request'
import { get as clientGet } from '@/utils/clientRequest'

export const getContactPageContent = async () => {
  return await clientGet('contact/page')
}

export const getAdminContactPageContent = async () => {
  return await adminGet('admin/contact-page')
}

export const updateAdminContactPageContent = async data => {
  return await patch('admin/contact-page', data)
}
