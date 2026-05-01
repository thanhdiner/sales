import { useEffect, useRef, useState } from 'react'

export default function useAutoHideHeader() {
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)
  const hasUserScrolled = useRef(false)

  useEffect(() => {
    const threshold = 10
    lastScrollY.current = window.scrollY

    const markUserScroll = () => {
      hasUserScrolled.current = true
      lastScrollY.current = window.scrollY
    }

    const handleScroll = () => {
      const currentY = window.scrollY

      if (!hasUserScrolled.current) {
        lastScrollY.current = currentY
        setHeaderHidden(false)
        return
      }

      if (currentY < 80) {
        setHeaderHidden(false)
      } else if (currentY - lastScrollY.current > threshold) {
        setHeaderHidden(true)
      } else if (lastScrollY.current - currentY > threshold) {
        setHeaderHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('wheel', markUserScroll, { passive: true })
    window.addEventListener('touchmove', markUserScroll, { passive: true })
    window.addEventListener('keydown', markUserScroll)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', markUserScroll)
      window.removeEventListener('touchmove', markUserScroll)
      window.removeEventListener('keydown', markUserScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return headerHidden
}
