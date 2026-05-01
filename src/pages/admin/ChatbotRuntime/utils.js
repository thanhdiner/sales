export const CHATBOT_RUNTIME_PROVIDER_OPTIONS = [
  {
    value: 'openai',
    label: 'OpenAI',
    models: ['gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-5.4-nano', 'gpt-5.1', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4.1-mini']
  },
  {
    value: 'deepseek',
    label: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner']
  },
  {
    value: 'groq',
    label: 'Groq',
    models: [
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'moonshotai/kimi-k2-instruct',
      'qwen/qwen3-32b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'gemma2-9b-it'
    ]
  },
  {
    value: '9router',
    label: '9Router',
    models: [
      'cx/gpt-5.5',
      'cx/gpt-5.4',
      'gpt-5.5',
      'gpt-5.4-mini',
      'gpt-5.1',
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'claude-sonnet-4.5',
      'claude-opus-4.1',
      'deepseek-chat',
      'deepseek-reasoner'
    ]
  }
]

export const DEFAULT_CHATBOT_RUNTIME_PROVIDER = '9router'
export const DEFAULT_CHATBOT_RUNTIME_MODEL = 'cx/gpt-5.4'

export const getChatbotRuntimeProvider = value => CHATBOT_RUNTIME_PROVIDER_OPTIONS.find(item => item.value === value)

export const getChatbotRuntimeProviderModels = providerValue => getChatbotRuntimeProvider(providerValue)?.models || []

export const isValidChatbotRuntimeModel = (providerValue, modelValue) => getChatbotRuntimeProviderModels(providerValue).includes(modelValue)
