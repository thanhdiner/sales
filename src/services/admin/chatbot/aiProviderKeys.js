import { del, get, patch, post } from '@/utils/request'

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') searchParams.set(key, value)
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getAIProviderKeySettings = () => get('admin/ai-provider-keys/settings')

export const updateAIProviderKeySettings = payload => patch('admin/ai-provider-keys/settings', payload)

export const getAIProviderKeys = params => get(`admin/ai-provider-keys${buildQuery(params)}`)

export const getAIProviderKeyLogs = params => get(`admin/ai-provider-keys/logs${buildQuery(params)}`)

export const createAIProviderKey = payload => post('admin/ai-provider-keys/create', payload)

export const updateAIProviderKey = (id, payload) => patch(`admin/ai-provider-keys/update/${id}`, payload)

export const toggleAIProviderKey = id => patch(`admin/ai-provider-keys/toggle/${id}`)

export const deleteAIProviderKey = id => del(`admin/ai-provider-keys/delete/${id}`)

export const testAIProviderKey = id => post(`admin/ai-provider-keys/test/${id}`)

export const reorderAIProviderKey = (id, direction) => patch(`admin/ai-provider-keys/reorder/${id}`, { direction })
