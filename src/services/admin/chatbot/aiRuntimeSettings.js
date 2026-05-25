import { get, patch, post } from '@/utils/request'

export const getAIRuntimeSettings = () => get('admin/ai-runtime-settings')

export const updateAIRuntimeSettings = payload => patch('admin/ai-runtime-settings', payload)

export const testAIRuntimeSettings = payload => post('admin/ai-runtime-settings/test', payload)
