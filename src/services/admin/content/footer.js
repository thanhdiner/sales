import { get, patch } from '@/utils/request'

export const getFooterContent = () => {
  return get('admin/footer')
}

export const updateFooterContent = data => {
  return patch('admin/footer', data)
}
