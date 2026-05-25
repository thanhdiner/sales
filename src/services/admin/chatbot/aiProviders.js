import { del, get, patch, post } from '@/utils/request'

export const getAIProviders = () => get('admin/ai-providers')

export const createAIProvider = payload => post('admin/ai-providers/create', payload)

export const updateAIProvider = (id, payload) => patch(`admin/ai-providers/update/${id}`, payload)

export const toggleAIProvider = id => patch(`admin/ai-providers/toggle/${id}`)

export const testAIProvider = (id, payload) => post(`admin/ai-providers/test/${id}`, payload)

export const deleteAIProvider = id => del(`admin/ai-providers/delete/${id}`)
