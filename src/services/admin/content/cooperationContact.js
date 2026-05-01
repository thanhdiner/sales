import { get, patch } from '@/utils/request'

export const getCooperationContactContent = () => {
  return get('admin/cooperation-contact')
}

export const updateCooperationContactContent = data => {
  return patch('admin/cooperation-contact', data)
}
