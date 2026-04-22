import { useCallback, useEffect, useRef, useState } from 'react'

const BOTTOM_THRESHOLD = 96
const SCROLL_RETRY_DELAYS = [0, 40, 120]

export function useAutoScroll({ dependencies, open, view }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)
  const wasChatOpenRef = useRef(false)
  const shouldStickToBottomRef = useRef(true)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  const isNearBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) return true

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    return distanceFromBottom <= BOTTOM_THRESHOLD
  }, [])

  const syncScrollState = useCallback(() => {
    const nearBottom = isNearBottom()
    shouldStickToBottomRef.current = nearBottom
    setShowScrollToBottom(!nearBottom)
  }, [isNearBottom])

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

  useEffect(() => {
    const isChatOpen = open && view === 'chat'
    if (!isChatOpen) {
      wasChatOpenRef.current = false
      setShowScrollToBottom(false)
      return
    }

    const container = containerRef.current
    if (!container) return

    syncScrollState()
    container.addEventListener('scroll', syncScrollState, { passive: true })

    return () => {
      container.removeEventListener('scroll', syncScrollState)
    }
  }, [open, view, syncScrollState])

  useEffect(() => {
    const isChatOpen = open && view === 'chat'
    if (!isChatOpen) return

    const justOpened = !wasChatOpenRef.current
    wasChatOpenRef.current = true

    if (justOpened || shouldStickToBottomRef.current) {
      return scheduleScrollToBottom(justOpened ? 'auto' : 'smooth')
    }

    setShowScrollToBottom(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, view, scheduleScrollToBottom, ...dependencies])

  return {
    bottomRef,
    containerRef,
    showScrollToBottom,
    scrollToBottom
  }
}
