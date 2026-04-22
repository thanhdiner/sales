import { useLayoutEffect, useRef, useState } from 'react'

const MODAL_VERTICAL_OFFSET = 220
const MODAL_MAX_VIEWPORT_RATIO = 0.7
const MODAL_BODY_BASE_STYLE = {
  overflowX: 'hidden',
  paddingTop: 16
}

function getModalMaxBodyHeight() {
  if (typeof window === 'undefined') {
    return 0
  }

  return Math.max(
    280,
    Math.min(window.innerHeight * MODAL_MAX_VIEWPORT_RATIO, window.innerHeight - MODAL_VERTICAL_OFFSET)
  )
}

export function useModalBodyScroll(isOpen) {
  const contentRef = useRef(null)
  const [bodyStyle, setBodyStyle] = useState(MODAL_BODY_BASE_STYLE)

  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current) {
      setBodyStyle(MODAL_BODY_BASE_STYLE)
      return undefined
    }

    const updateBodyStyle = () => {
      const contentHeight = contentRef.current?.scrollHeight || 0
      const maxBodyHeight = getModalMaxBodyHeight()
      const shouldScroll = contentHeight > maxBodyHeight

      setBodyStyle({
        ...MODAL_BODY_BASE_STYLE,
        maxHeight: shouldScroll ? `${Math.floor(maxBodyHeight)}px` : 'none',
        overflowY: shouldScroll ? 'auto' : 'visible'
      })
    }

    const frameId = window.requestAnimationFrame(updateBodyStyle)
    const observer =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => {
            updateBodyStyle()
          })
        : null

    observer?.observe(contentRef.current)
    window.addEventListener('resize', updateBodyStyle)

    return () => {
      window.cancelAnimationFrame(frameId)
      observer?.disconnect()
      window.removeEventListener('resize', updateBodyStyle)
    }
  }, [isOpen])

  return { bodyStyle, contentRef }
}
