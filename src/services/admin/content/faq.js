import { get, patch } from '@/utils/request'

export const getFaqContent = () => {
  return get('admin/faq')
}

export const updateFaqContent = data => {
  return patch('admin/faq', data)
}
