import { get, patch } from '@/utils/request'

export const getWebsiteConfig = () => {
  return get('admin/website-config')
}

export const updateWebsiteConfig = data => {
  return patch('admin/website-config/edit', data)
}

export const editWebsiteConfig = updateWebsiteConfig
