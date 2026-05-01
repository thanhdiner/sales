import { useCallback, useState } from 'react'
import { message as antdMessage } from 'antd'

import { apiFetch } from '../utils'

export function useChatActions({
  selectedSession,
  agentId,
  agentName,
  agentAvatar,
  loadHistory,
  loadCounts,
  setActiveTab,
  setSelectedConversation,
  setConversations,
  updateChatSearchParams,
  t
}) {
  const [assigning, setAssigning] = useState(false)
  const [resolving, setResolving] = useState(false)

  const handleAssign = useCallback(async () => {
    if (!selectedSession) {
      return
    }

    if (!agentId) {
      antdMessage.error(t('errors.missingAgent'))
      return
    }

    setAssigning(true)

    try {
      const response = await apiFetch(`chat/assign/${selectedSession}`, {
        method: 'PATCH',
        body: JSON.stringify({ agentId, agentName, agentAvatar }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response?.success) {
        throw new Error(response?.message || t('errors.assignFailed'))
      }

      const nextConversation = response.data || {
        status: 'open',
        assignedAgent: {
          agentId,
          agentName,
          agentAvatar,
          assignedAt: new Date()
        }
      }

      setSelectedConversation(prevConversation =>
        prevConversation ? { ...prevConversation, ...nextConversation, status: 'open' } : prevConversation
      )
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.sessionId === selectedSession
            ? { ...conversation, ...nextConversation, status: 'open' }
            : conversation
        )
      )
      setActiveTab('mine')
      updateChatSearchParams({ tab: 'mine', session: selectedSession })
      await loadHistory(selectedSession)
      loadCounts()
    } catch (error) {
      antdMessage.error(error?.message || t('errors.assignFailed'))
    } finally {
      setAssigning(false)
    }
  }, [
    agentAvatar,
    agentId,
    agentName,
    loadCounts,
    loadHistory,
    selectedSession,
    setActiveTab,
    setConversations,
    setSelectedConversation,
    t,
    updateChatSearchParams
  ])

  const handleResolve = useCallback(async () => {
    if (!selectedSession) {
      return
    }

    setResolving(true)

    try {
      const response = await apiFetch(`chat/resolve/${selectedSession}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response?.success) {
        throw new Error(response?.message || t('errors.resolveFailed'))
      }

      const nextConversation = response.data || { status: 'resolved' }

      setSelectedConversation(prevConversation =>
        prevConversation ? { ...prevConversation, ...nextConversation, status: 'resolved' } : prevConversation
      )
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.sessionId === selectedSession
            ? { ...conversation, ...nextConversation, status: 'resolved' }
            : conversation
        )
      )
      setActiveTab('resolved')
      updateChatSearchParams({ tab: 'resolved', session: selectedSession })
      await loadHistory(selectedSession)
      loadCounts()
    } catch (error) {
      antdMessage.error(error?.message || t('errors.resolveFailed'))
    } finally {
      setResolving(false)
    }
  }, [
    loadCounts,
    loadHistory,
    selectedSession,
    setActiveTab,
    setConversations,
    setSelectedConversation,
    t,
    updateChatSearchParams
  ])

  return {
    assigning,
    resolving,
    handleAssign,
    handleResolve
  }
}
