import { get, patch } from '@/utils/request'

export const getHomeBuildYourKitContent = () => {
  return get('admin/home-build-your-kit')
}

export const updateHomeBuildYourKitContent = data => {
  return patch('admin/home-build-your-kit', data)
}

