import { useCallback, useEffect, useRef, useState } from 'react'

const BOTTOM_THRESHOLD = 72
const SCROLL_RETRY_DELAYS = [0, 40, 120, 260, 500]

const getMessageKey = message => {
  if (!message) return ''
  return String(
    message.clientTempId ||
    message._id ||
    `${message.sender || ''}:${message.type || ''}:${message.createdAt || ''}:${message.message || ''}`
  )
}

const isCustomerMessage = message => message?.sender === 'customer' || message?.sender === 'guest'
const isIncomingSupportMessage = message => message?.sender === 'agent' || message?.sender === 'bot'

export function useAutoScroll({ dependencies = [], messages = [], open, view }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)
  const wasChatOpenRef = useRef(false)
  const shouldStickToBottomRef = useRef(true)
  const latestMessageKeyRef = useRef('')
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [newIncomingCount, setNewIncomingCount] = useState(0)

  const getScrollDistanceFromBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) return 0

    return Math.max(container.scrollHeight - container.scrollTop - container.clientHeight, 0)
  }, [])

  const syncScrollState = useCallback(() => {
    const container = containerRef.current

    if (!container) {
      shouldStickToBottomRef.current = true
      setShowScrollToBottom(false)
      return
    }

    const canScroll = container.scrollHeight > container.clientHeight + 4
    const nearBottom = getScrollDistanceFromBottom() <= BOTTOM_THRESHOLD

    shouldStickToBottomRef.current = nearBottom
    setShowScrollToBottom(canScroll && !nearBottom)
    if (nearBottom) setNewIncomingCount(0)
  }, [getScrollDistanceFromBottom])

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const container = containerRef.current

    if (container) {
      const top = Math.max(container.scrollHeight - container.clientHeight, 0)

      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ top, behavior })
      } else {
        container.scrollTop = top
      }
    } else {
      bottomRef.current?.scrollIntoView({ behavior, block: 'end' })
    }

    shouldStickToBottomRef.current = true
    setShowScrollToBottom(false)
    setNewIncomingCount(0)
  }, [])

  const scheduleScrollToBottom = useCallback((behavior = 'auto') => {
    const frameIds = []
    const timeoutIds = []

    frameIds.push(
      requestAnimationFrame(() => {
        scrollToBottom(behavior)
        frameIds.push(requestAnimationFrame(() => scrollToBottom('auto')))
      })
    )

    SCROLL_RETRY_DELAYS.filter(delay => delay > 0).forEach(delay => {
      timeoutIds.push(window.setTimeout(() => scrollToBottom('auto'), delay))
    })

    return () => {
      frameIds.forEach(cancelAnimationFrame)
      timeoutIds.forEach(clearTimeout)
    }
  }, [scrollToBottom])

  const handleScroll = useCallback(() => {
    syncScrollState()
  }, [syncScrollState])

  useEffect(() => {
    const isChatOpen = open && view === 'chat'
    if (!isChatOpen) {
      wasChatOpenRef.current = false
      setShowScrollToBottom(false)
      setNewIncomingCount(0)
      return
    }

    const container = containerRef.current
    if (!container) return

    syncScrollState()
    container.addEventListener('scroll', syncScrollState, { passive: true })

    let cancelScheduledScroll
    const keepBottomIfNeeded = () => {
      cancelScheduledScroll?.()

      if (shouldStickToBottomRef.current) {
        cancelScheduledScroll = scheduleScrollToBottom('auto')
        return
      }

      syncScrollState()
    }

    let mutationObserver
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(keepBottomIfNeeded)
      mutationObserver.observe(container, {
        childList: true,
        characterData: true,
        subtree: true
      })
    }

    const handleContentLoad = event => {
      const target = event.target
      if (target?.tagName === 'IMG' || target?.tagName === 'VIDEO') {
        keepBottomIfNeeded()
      }
    }
    container.addEventListener('load', handleContentLoad, true)

    let resizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(keepBottomIfNeeded)
      resizeObserver.observe(container)
    }

    return () => {
      cancelScheduledScroll?.()
      container.removeEventListener('scroll', syncScrollState)
      container.removeEventListener('load', handleContentLoad, true)
      mutationObserver?.disconnect()
      resizeObserver?.disconnect()
    }
  }, [open, view, scheduleScrollToBottom, syncScrollState])

  useEffect(() => {
    const isChatOpen = open && view === 'chat'
    if (!isChatOpen) return

    const justOpened = !wasChatOpenRef.current
    wasChatOpenRef.current = true
    const latestMessage = messages[messages.length - 1]
    const latestMessageKey = getMessageKey(latestMessage)
    const hasNewLatestMessage = Boolean(latestMessageKey && latestMessageKey !== latestMessageKeyRef.current)
    latestMessageKeyRef.current = latestMessageKey

    if (justOpened) {
      setNewIncomingCount(0)
      return scheduleScrollToBottom('auto')
    }

    if (hasNewLatestMessage && isCustomerMessage(latestMessage)) {
      setNewIncomingCount(0)
      return scheduleScrollToBottom('smooth')
    }

    if (shouldStickToBottomRef.current) {
      setNewIncomingCount(0)
      return scheduleScrollToBottom('smooth')
    }

    if (hasNewLatestMessage && isIncomingSupportMessage(latestMessage)) {
      setNewIncomingCount(count => count + 1)
    }

    setShowScrollToBottom(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, view, messages, scheduleScrollToBottom, ...dependencies])

  return {
    bottomRef,
    containerRef,
    handleScroll,
    showScrollToBottom,
    newIncomingCount,
    scrollToBottom
  }
}
