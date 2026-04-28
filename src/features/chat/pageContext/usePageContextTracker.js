import { useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import { useLocation } from 'react-router-dom'
import { detectPageType } from './detectPageType'
import { emitPageContextUpdate } from './pageContextSocket'
import { usePageContext } from './PageContextProvider'

function buildRoute(location) {
  return `${location.pathname}${location.search || ''}`
}

export function usePageContextTracker(sessionId) {
  const location = useLocation()
  const pageContext = usePageContext()
  const [visibleSection, setVisibleSection] = useState(null)
  const lastPayloadRef = useRef('')

  const debouncedEmit = useMemo(() => debounce((nextSessionId, context) => {
    emitPageContextUpdate(nextSessionId, context)
  }, 500), [])

  const route = buildRoute(location)
  const currentSection = pageContext?.sectionOverride || visibleSection || null

  useEffect(() => () => debouncedEmit.cancel(), [debouncedEmit])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return undefined

    const observedSections = Array.from(document.querySelectorAll('[data-page-section]'))
    if (observedSections.length === 0) return undefined

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .map(entry => entry.target.dataset.pageSection)
        .filter(Boolean)

      if (visible.length > 0) {
        setVisibleSection(current => (current === visible[0] ? current : visible[0]))
      }
    }, { threshold: 0.45 })

    observedSections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [location.pathname])

  useEffect(() => {
    const context = {
      route,
      pageType: detectPageType(location.pathname),
      currentSection,
      entity: pageContext?.entity || null
    }
    const payloadKey = JSON.stringify(context)

    if (lastPayloadRef.current === payloadKey) return

    lastPayloadRef.current = payloadKey
    debouncedEmit(sessionId, context)
  }, [sessionId, route, location.pathname, currentSection, pageContext?.entity, debouncedEmit])
}
