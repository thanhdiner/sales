import { get, patch } from '@/utils/request'

export const getHomeWhyChooseUsContent = () => {
  return get('admin/home-why-choose-us')
}

export const updateHomeWhyChooseUsContent = data => {
  return patch('admin/home-why-choose-us', data)
}
