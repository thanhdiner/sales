import { useCallback, useEffect, useState } from 'react'

import { getActiveQuickReplies, recordQuickReplyUsage } from '@/services/admin/agent/quickReply'

import { resolveQuickReplyVariables } from './quickReplyUtils'

export function useQuickReplies({
  language,
  selectedConversation,
  agentName,
  websiteConfig,
  inputRef,
  focusInputWithoutScroll,
  setInput
}) {
  const quickReplyLanguage = String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi'
  const [quickReplies, setQuickReplies] = useState([])
  const [quickRepliesLoading, setQuickRepliesLoading] = useState(false)

  const loadQuickReplies = useCallback(async () => {
    setQuickRepliesLoading(true)

    try {
      const response = await getActiveQuickReplies({ limit: 100, language: quickReplyLanguage })
      setQuickReplies(response?.data || [])
    } catch {
      setQuickReplies([])
    } finally {
      setQuickRepliesLoading(false)
    }
  }, [quickReplyLanguage])

  useEffect(() => {
    void loadQuickReplies()
  }, [loadQuickReplies])

  const handleInsertQuickReply = useCallback((quickReply) => {
    const resolvedContent = resolveQuickReplyVariables(quickReply?.content, {
      customerName: selectedConversation?.customer?.name || '',
      agentName,
      storeName: websiteConfig?.siteName || 'SmartMall',
      orderCode: selectedConversation?.orderCode || '',
      productName: selectedConversation?.productName || ''
    }).trim()

    if (!resolvedContent) {
      return
    }

    setInput(currentInput => {
      const trimmedInput = currentInput.trimEnd()
      return trimmedInput ? `${trimmedInput}\n${resolvedContent}` : resolvedContent
    })

    window.requestAnimationFrame(() => {
      const currentInput = inputRef.current

      if (currentInput) {
        currentInput.style.height = 'auto'
        currentInput.style.height = `${Math.min(currentInput.scrollHeight, 100)}px`
      }

      focusInputWithoutScroll()
    })

    if (quickReply?._id) {
      void recordQuickReplyUsage(quickReply._id).catch(() => {})
    }
  }, [
    agentName,
    focusInputWithoutScroll,
    inputRef,
    selectedConversation?.customer?.name,
    selectedConversation?.orderCode,
    selectedConversation?.productName,
    setInput,
    websiteConfig?.siteName
  ])

  return {
    quickReplies,
    quickRepliesLoading,
    handleInsertQuickReply
  }
}
