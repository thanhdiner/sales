import { getSocket } from '@/services/realtime/socket'

export function emitPageContextUpdate(sessionId, context) {
  if (!sessionId || typeof window === 'undefined') return

  getSocket().emit('chat:page_context_update', {
    sessionId,
    context
  })
}
