import { get, patch, post } from '@/utils/request'

const buildToolLogsQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', params.page)
  if (params.limit) searchParams.set('limit', params.limit)
  if (params.toolName) searchParams.set('toolName', params.toolName)
  if (params.sessionId) searchParams.set('sessionId', params.sessionId)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getChatbotConfig = () => {
  return get('admin/chatbot-config')
}

export const updateChatbotConfig = data => {
  return patch('admin/chatbot-config', data)
}

export const testChatbotConnection = data => {
  return post('admin/chatbot-config/test', data)
}

export const getChatbotToolLogs = (params = {}) => {
  return get(`admin/chatbot-config/tool-logs${buildToolLogsQueryString(params)}`)
}
