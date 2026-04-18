const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

export const chatService = {
  getHistory: async (sessionId) => {
    const res = await fetch(`${API_BASE}/chat/history/${sessionId}?internal=false`, { credentials: 'include' })
    const data = await res.json()
    if (data?.success) return data.data
    throw new Error('Failed to load history')
  },
  getConversation: async (sessionId) => {
    const res = await fetch(`${API_BASE}/chat/conversation/${sessionId}`, { credentials: 'include' })
    const data = await res.json()
    if (data?.success) return data.data
    throw new Error('Failed to load conversation')
  }
}
