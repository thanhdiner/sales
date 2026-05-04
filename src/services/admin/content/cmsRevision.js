import { get, post } from '@/utils/request'

export const getCmsRevisions = params => {
  const searchParams = new URLSearchParams()
  if (params?.entityType) searchParams.set('entityType', params.entityType)
  if (params?.entityId) searchParams.set('entityId', params.entityId)
  if (params?.key) searchParams.set('key', params.key)
  const query = searchParams.toString()
  return get(`admin/cms-revisions${query ? `?${query}` : ''}`)
}

export const restoreCmsRevision = id => post(`admin/cms-revisions/${id}/restore`)
