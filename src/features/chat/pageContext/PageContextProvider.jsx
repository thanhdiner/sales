import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const PageContextContext = createContext(null)

export function PageContextProvider({ children }) {
  const [entity, setEntity] = useState(null)
  const [sectionOverride, setSectionOverride] = useState(null)

  const registerEntity = useCallback(nextEntity => {
    setEntity(nextEntity || null)

    return () => {
      setEntity(current => (current === nextEntity ? null : current))
    }
  }, [])

  const setCurrentSection = useCallback(section => {
    setSectionOverride(section || null)
  }, [])

  const value = useMemo(() => ({
    entity,
    registerEntity,
    sectionOverride,
    setCurrentSection
  }), [entity, registerEntity, sectionOverride, setCurrentSection])

  return (
    <PageContextContext.Provider value={value}>
      {children}
    </PageContextContext.Provider>
  )
}

export function usePageContext() {
  return useContext(PageContextContext)
}

export function useRegisterPageEntity(entity) {
  const context = usePageContext()

  useEffect(() => {
    if (!context) return undefined
    return context.registerEntity(entity)
  }, [context, entity])
}

export function useSetPageSection(section) {
  const context = usePageContext()

  useEffect(() => {
    if (!context) return undefined
    context.setCurrentSection(section)
    return () => context.setCurrentSection(null)
  }, [context, section])
}
