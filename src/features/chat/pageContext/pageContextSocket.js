import { getSocket } from '@/services/realtime/socket'

export function emitPageContextUpdate(sessionId, context) {
  if (!sessionId || typeof window === 'undefined') return Promise.resolve(null)

  return new Promise(resolve => {
    const timeout = window.setTimeout(() => {
      resolve(null)
    }, 1200)

    getSocket().emit('chat:page_context_update', {
      sessionId,
      context
    }, response => {
      window.clearTimeout(timeout)

      if (response?.success === false) {
        resolve(null)
        return
      }

      resolve(response?.pageContext || null)
    })
  })
}
