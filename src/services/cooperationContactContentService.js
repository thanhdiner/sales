import { get } from '@/utils/clientRequest'
import { get as adminGet, patch as adminPatch } from '@/utils/request'

export const getCooperationContactContent = async () => {
  return await get('cooperation-contact')
}

export const getAdminCooperationContactContent = async () => {
  return await adminGet('admin/cooperation-contact')
}

export const updateAdminCooperationContactContent = async data => {
  return await adminPatch('admin/cooperation-contact', data)
}
