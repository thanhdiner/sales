export const CHATBOT_RUNTIME_PROVIDER_OPTIONS = [
  {
    value: 'openai',
    label: 'OpenAI',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  {
    value: 'deepseek',
    label: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner']
  },
  {
    value: 'groq',
    label: 'Groq',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it', 'mixtral-8x7b-32768']
  },
  {
    value: '9router',
    label: '9Router',
    models: ['gemini-2.5-flash', 'gpt-4.1-mini', 'claude-3.5-sonnet']
  }
]

export const DEFAULT_CHATBOT_RUNTIME_PROVIDER = 'openai'
export const DEFAULT_CHATBOT_RUNTIME_MODEL = 'gpt-4o-mini'

export const getChatbotRuntimeProvider = value =>
  CHATBOT_RUNTIME_PROVIDER_OPTIONS.find(item => item.value === value)
