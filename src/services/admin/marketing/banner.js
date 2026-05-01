import { del, get, patch, post } from '@/utils/request'

export const getBanners = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const url = query ? `admin/banners?${query}` : 'admin/banners'

  return get(url)
}

export const createBanner = data => {
  return post('admin/banners', data)
}

export const updateBanner = (id, data) => {
  return patch(`admin/banners/${id}`, data)
}

export const deleteBanner = id => {
  return del(`admin/banners/${id}`)
}

export const updateBannerById = updateBanner
export const deleteBannerById = deleteBanner
