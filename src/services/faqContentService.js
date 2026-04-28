import { get as adminGet, patch } from '@/utils/request'
import { get as clientGet } from '@/utils/clientRequest'

export const getFaqContent = async () => {
  return await clientGet('faq/page')
}

export const getAdminFaqContent = async () => {
  return await adminGet('admin/faq')
}

export const updateAdminFaqContent = async data => {
  return await patch('admin/faq', data)
}
