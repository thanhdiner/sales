import { get } from '@/utils/clientRequest'
import { get as adminGet, patch as adminPatch } from '@/utils/request'

export const getHomeWhyChooseUsContent = async () => {
  return await get('home-why-choose-us')
}

export const getAdminHomeWhyChooseUsContent = async () => {
  return await adminGet('admin/home-why-choose-us')
}

export const updateAdminHomeWhyChooseUsContent = async data => {
  return await adminPatch('admin/home-why-choose-us', data)
}
