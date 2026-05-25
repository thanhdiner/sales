import { del, get, patch, post } from '@/utils/request'

export const getAIAgents = () => get('admin/ai-agents')

export const createAIAgent = payload => post('admin/ai-agents/create', payload)

export const updateAIAgent = (id, payload) => patch(`admin/ai-agents/update/${id}`, payload)

export const toggleAIAgent = id => patch(`admin/ai-agents/toggle/${id}`)

export const setDefaultAIAgent = id => patch(`admin/ai-agents/set-default/${id}`)

export const reorderAIAgent = (id, direction) => patch(`admin/ai-agents/reorder/${id}`, { direction })

export const deleteAIAgent = id => del(`admin/ai-agents/delete/${id}`)
