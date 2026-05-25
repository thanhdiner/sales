import { useCallback, useEffect, useRef, useState } from 'react'

const BOTTOM_THRESHOLD = 72
const SCROLL_RETRY_DELAYS = [0, 40, 120, 260, 500]
const STICKY_LOOP_EXTENSION_MS = 700

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
  const userScrollIntentRef = useRef(false)
  const userScrollIntentTimerRef = useRef(null)
  const lastScrollTopRef = useRef(0)
  const touchStartYRef = useRef(null)
  const latestMessageKeyRef = useRef('')
  const stickyLoopFrameRef = useRef(null)
  const stickyLoopUntilRef = useRef(0)
  const cancelScheduledScrollRef = useRef(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [newIncomingCount, setNewIncomingCount] = useState(0)

  const getScrollDistanceFromBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) return 0

    return Math.max(container.scrollHeight - container.scrollTop - container.clientHeight, 0)
  }, [])

  const syncScrollState = useCallback((source = 'system') => {
    const container = containerRef.current

    if (!container) {
      shouldStickToBottomRef.current = true
      setShowScrollToBottom(false)
      return
    }

    const canScroll = container.scrollHeight > container.clientHeight + 4
    const nearBottom = getScrollDistanceFromBottom() <= BOTTOM_THRESHOLD
    const scrollingUp = container.scrollTop < lastScrollTopRef.current - 1

    if (source === 'user') {
      if (nearBottom) {
        shouldStickToBottomRef.current = true
      } else if (scrollingUp) {
        shouldStickToBottomRef.current = false
        if (stickyLoopFrameRef.current) {
          cancelAnimationFrame(stickyLoopFrameRef.current)
          stickyLoopFrameRef.current = null
        }
        stickyLoopUntilRef.current = 0
      }
    }

    lastScrollTopRef.current = container.scrollTop
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

  const stopStickyLoop = useCallback(() => {
    if (stickyLoopFrameRef.current) {
      cancelAnimationFrame(stickyLoopFrameRef.current)
      stickyLoopFrameRef.current = null
    }
    stickyLoopUntilRef.current = 0
  }, [])

  const startStickyLoop = useCallback((durationMs = STICKY_LOOP_EXTENSION_MS) => {
    stickyLoopUntilRef.current = Math.max(stickyLoopUntilRef.current, Date.now() + durationMs)

    if (stickyLoopFrameRef.current) return

    const tick = () => {
      if (!shouldStickToBottomRef.current || Date.now() > stickyLoopUntilRef.current) {
        stickyLoopFrameRef.current = null
        return
      }

      scrollToBottom('auto')
      stickyLoopFrameRef.current = requestAnimationFrame(tick)
    }

    stickyLoopFrameRef.current = requestAnimationFrame(tick)
  }, [scrollToBottom])

  const scheduleScrollToBottom = useCallback((behavior = 'auto') => {
    const frameIds = []
    const timeoutIds = []
    const scrollIfSticky = nextBehavior => {
      if (shouldStickToBottomRef.current) {
        scrollToBottom(nextBehavior)
        startStickyLoop()
      }
    }

    frameIds.push(
      requestAnimationFrame(() => {
        scrollIfSticky(behavior)
        frameIds.push(requestAnimationFrame(() => scrollIfSticky('auto')))
      })
    )

    SCROLL_RETRY_DELAYS.filter(delay => delay > 0).forEach(delay => {
      timeoutIds.push(window.setTimeout(() => scrollIfSticky('auto'), delay))
    })

    return () => {
      frameIds.forEach(cancelAnimationFrame)
      timeoutIds.forEach(clearTimeout)
    }
  }, [scrollToBottom, startStickyLoop])

  const scrollToBottomAndStick = useCallback((behavior = 'smooth') => {
    cancelScheduledScrollRef.current?.()
    cancelScheduledScrollRef.current = null
    scrollToBottom(behavior)
    startStickyLoop(1200)
  }, [scrollToBottom, startStickyLoop])

  const markUserScrollIntent = useCallback(() => {
    userScrollIntentRef.current = true

    if (userScrollIntentTimerRef.current) {
      window.clearTimeout(userScrollIntentTimerRef.current)
    }

    userScrollIntentTimerRef.current = window.setTimeout(() => {
      userScrollIntentRef.current = false
      userScrollIntentTimerRef.current = null
    }, 160)
  }, [])

  const releaseStickyFromUserScroll = useCallback(() => {
    markUserScrollIntent()
    shouldStickToBottomRef.current = false
    cancelScheduledScrollRef.current?.()
    cancelScheduledScrollRef.current = null
    stopStickyLoop()
    syncScrollState()
  }, [markUserScrollIntent, stopStickyLoop, syncScrollState])

  const handleScroll = useCallback(() => {
    syncScrollState(userScrollIntentRef.current ? 'user' : 'system')
  }, [syncScrollState])

  const handleWheel = useCallback(event => {
    if (event.deltaY < 0) {
      releaseStickyFromUserScroll()
    }
  }, [releaseStickyFromUserScroll])

  const handleTouchStart = useCallback(event => {
    markUserScrollIntent()
    touchStartYRef.current = event.touches?.[0]?.clientY ?? null
  }, [markUserScrollIntent])

  const handleTouchMove = useCallback(event => {
    const startY = touchStartYRef.current
    const currentY = event.touches?.[0]?.clientY

    if (typeof startY === 'number' && typeof currentY === 'number' && currentY > startY + 4) {
      releaseStickyFromUserScroll()
    }
  }, [releaseStickyFromUserScroll])

  useEffect(() => {
    const isChatOpen = open && view === 'chat'
    if (!isChatOpen) {
      wasChatOpenRef.current = false
      queueMicrotask(() => {
        setShowScrollToBottom(false)
        setNewIncomingCount(0)
      })
      shouldStickToBottomRef.current = true
      lastScrollTopRef.current = 0
      stopStickyLoop()
      return
    }

    const container = containerRef.current
    if (!container) return

    syncScrollState()
    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })

    const handleKeyDown = event => {
      if (['ArrowUp', 'PageUp', 'Home'].includes(event.key)) {
        releaseStickyFromUserScroll()
        return
      }

      if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) {
        markUserScrollIntent()
      }
    }
    container.addEventListener('keydown', handleKeyDown)

    const keepBottomIfNeeded = () => {
      cancelScheduledScrollRef.current?.()
      cancelScheduledScrollRef.current = null

      if (shouldStickToBottomRef.current) {
        cancelScheduledScrollRef.current = scheduleScrollToBottom('auto')
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
      cancelScheduledScrollRef.current?.()
      cancelScheduledScrollRef.current = null
      stopStickyLoop()
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('keydown', handleKeyDown)
      container.removeEventListener('load', handleContentLoad, true)
      if (userScrollIntentTimerRef.current) {
        window.clearTimeout(userScrollIntentTimerRef.current)
        userScrollIntentTimerRef.current = null
        userScrollIntentRef.current = false
      }
      touchStartYRef.current = null
      mutationObserver?.disconnect()
      resizeObserver?.disconnect()
    }
  }, [open, view, handleScroll, handleTouchMove, handleTouchStart, handleWheel, markUserScrollIntent, releaseStickyFromUserScroll, scheduleScrollToBottom, stopStickyLoop, syncScrollState])

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

    syncScrollState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, view, messages, scheduleScrollToBottom, syncScrollState, ...dependencies])

  return {
    bottomRef,
    containerRef,
    handleScroll,
    showScrollToBottom,
    newIncomingCount,
    scrollToBottom: scrollToBottomAndStick
  }
}
