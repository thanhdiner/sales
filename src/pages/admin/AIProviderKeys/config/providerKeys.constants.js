export const PROVIDERS = ['9router', 'openai', 'openrouter', 'gemini', 'claude']

export const ENVIRONMENTS = ['dev', 'production']

export const INITIAL_KEYS = [
  {
    id: 'openai-prod-main',
    provider: 'OpenAI',
    alias: 'GPT production main',
    maskedKey: 'sk-...x7K9',
    env: 'production',
    enabled: true,
    health: 'enabled',
    weight: 50,
    requestLimit: 10000,
    tokenLimit: 5000000,
    requestsToday: 7240,
    tokensToday: 3180000,
    lastUsed: '1 min ago',
    lastError: '-'
  },
  {
    id: 'gemini-prod-backup',
    provider: 'Gemini',
    alias: 'Gemini backup',
    maskedKey: 'AIza...82Lp',
    env: 'production',
    enabled: true,
    health: 'rate limited',
    weight: 30,
    requestLimit: 5000,
    tokenLimit: 2000000,
    requestsToday: 2180,
    tokensToday: 890000,
    lastUsed: '9 min ago',
    lastError: '429 rate limit'
  },
  {
    id: 'claude-prod-longform',
    provider: 'Claude',
    alias: 'Claude long form',
    maskedKey: 'sk-ant...Q1mN',
    env: 'production',
    enabled: true,
    health: 'quota exceeded',
    weight: 20,
    requestLimit: 2500,
    tokenLimit: 1500000,
    requestsToday: 2500,
    tokensToday: 1500000,
    lastUsed: '24 min ago',
    lastError: 'Daily token quota exceeded'
  },
  {
    id: 'openai-dev',
    provider: 'OpenAI',
    alias: 'Dev testing',
    maskedKey: 'sk-...D4v1',
    env: 'dev',
    enabled: false,
    health: 'disabled',
    weight: 10,
    requestLimit: 1000,
    tokenLimit: 500000,
    requestsToday: 42,
    tokensToday: 22000,
    lastUsed: '2h ago',
    lastError: '-'
  }
]

export const INITIAL_LOGS = [
  {
    id: 1,
    time: '10:42:11',
    provider: 'OpenAI',
    key: 'sk-...x7K9',
    model: 'gpt-4o-mini',
    type: 'product-description',
    tokens: 1240,
    status: 'success',
    retry: 'no',
    error: '-'
  },
  {
    id: 2,
    time: '10:42:13',
    provider: 'Gemini',
    key: 'AIza...82Lp',
    model: 'gemini-1.5',
    type: 'chatbot',
    tokens: 880,
    status: 'retry',
    retry: 'yes',
    error: 'OpenAI rate limited'
  },
  {
    id: 3,
    time: '10:44:01',
    provider: 'Claude',
    key: 'sk-ant...Q1mN',
    model: 'claude-sonnet',
    type: 'fraud-check',
    tokens: 2100,
    status: 'failed',
    retry: 'no',
    error: 'quota exceeded'
  },
  {
    id: 4,
    time: '10:45:19',
    provider: 'OpenAI',
    key: 'sk-...x7K9',
    model: 'gpt-4o-mini',
    type: 'review-summary',
    tokens: 640,
    status: 'success',
    retry: 'no',
    error: '-'
  }
]

export const HEALTH_COLORS = {
  enabled: 'green',
  disabled: 'default',
  error: 'red',
  'quota exceeded': 'orange',
  'rate limited': 'gold',
  testing: 'blue'
}

export const LOG_COLORS = {
  success: 'green',
  retry: 'blue',
  failed: 'red'
}