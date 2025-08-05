import { get, post, patch, del } from '../utils/request'

export const getBanners = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const url = query ? `admin/banners?${query}` : 'admin/banners'
  return await get(url)
}

export const createBanner = async data => {
  return await post('admin/banners', data)
}

export const updateBannerById = async (id, data) => {
  return await patch(`admin/banners/${id}`, data)
}

export const deleteBannerById = async id => {
  return await del(`admin/banners/${id}`)
}
