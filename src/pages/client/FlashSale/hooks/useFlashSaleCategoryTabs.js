import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useFlashSaleCategoryTabs({ categories, loading, selectedCategory }) {
  const tabsRef = useRef(null)
  const dragStateRef = useRef({ active: false, startX: 0, scrollLeft: 0, dragged: false })
  const [isDraggingTabs, setIsDraggingTabs] = useState(false)
  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (loading || selectedCategory === 'all') return
    if (!categories.some(category => category.key === selectedCategory)) {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev)
          next.delete('category')
          return next
        },
        { replace: true }
      )
    }
  }, [categories, loading, selectedCategory, setSearchParams])

  const handleCategoryChange = categoryKey => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)

      if (categoryKey === 'all') {
        next.delete('category')
      } else {
        next.set('category', categoryKey)
      }

      return next
    })
  }

  const handleScrollTabs = direction => {
    tabsRef.current?.scrollBy({
      left: direction === 'prev' ? -260 : 260,
      behavior: 'smooth'
    })
  }

  const handleTabsPointerDown = event => {
    if (!tabsRef.current) return

    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: tabsRef.current.scrollLeft,
      dragged: false
    }
    setIsDraggingTabs(true)
  }

  const handleTabsPointerMove = event => {
    const dragState = dragStateRef.current
    if (!dragState.active || !tabsRef.current) return

    const distance = event.clientX - dragState.startX
    if (Math.abs(distance) <= 8) return

    event.preventDefault()
    dragState.dragged = true
    tabsRef.current.scrollLeft = dragState.scrollLeft - distance
  }

  const handleTabsPointerUp = () => {
    dragStateRef.current.active = false
    setIsDraggingTabs(false)
  }

  const handleTabsClickCapture = event => {
    if (!dragStateRef.current.dragged) return

    event.preventDefault()
    event.stopPropagation()
    dragStateRef.current.dragged = false
  }

  return {
    handleCategoryChange,
    handleScrollTabs,
    handleTabsClickCapture,
    handleTabsPointerDown,
    handleTabsPointerMove,
    handleTabsPointerUp,
    isDraggingTabs,
    selectedCategory,
    tabsRef
  }
}
