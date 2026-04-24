import { get, patch, post } from '@/utils/request'

export const getChatbotConfig = async () => {
  return await get('admin/chatbot-config')
}

export const updateChatbotConfig = async (data) => {
  return await patch('admin/chatbot-config', data)
}

export const testChatbotConnection = async (data) => {
  return await post('admin/chatbot-config/test', data)
}

export const getChatbotToolLogs = async (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', params.page)
  if (params.limit) searchParams.set('limit', params.limit)
  if (params.toolName) searchParams.set('toolName', params.toolName)
  if (params.sessionId) searchParams.set('sessionId', params.sessionId)

  const query = searchParams.toString()
  return await get(`admin/chatbot-config/tool-logs${query ? `?${query}` : ''}`)
}
