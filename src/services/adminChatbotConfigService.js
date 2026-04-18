import { get, patch, post } from '@/utils/request'

export const getChatbotConfig = async () => {
  return await get('admin/chatbot-config')
}

export const updateChatbotConfig = async (data) => {
  return await patch('admin/chatbot-config', data)
}

export const testChatbotConnection = async () => {
  return await post('admin/chatbot-config/test')
}
