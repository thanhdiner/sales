import { get, patch } from '@/utils/request'

export const getContactPageContent = () => {
  return get('admin/contact-page')
}

export const updateContactPageContent = data => {
  return patch('admin/contact-page', data)
}
