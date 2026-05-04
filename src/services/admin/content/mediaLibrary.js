import { del, get, patch } from '@/utils/request'

export const getMediaAssets = params => {
  const searchParams = new URLSearchParams()
  if (params?.keyword) searchParams.set('keyword', params.keyword)
  if (params?.resourceType) searchParams.set('resourceType', params.resourceType)
  const query = searchParams.toString()
  return get(`admin/media-library${query ? `?${query}` : ''}`)
}

export const updateMediaAsset = (id, payload) => patch(`admin/media-library/${id}`, payload)
export const deleteMediaAsset = id => del(`admin/media-library/${id}`)
