import { useEffect, useMemo, useRef } from 'react'

export function useFilterInitialValues(filterValues, pageSize, defaults = {}) {
  return useMemo(
    () => ({
      ...filterValues,
      ...defaults,
      ...(pageSize !== undefined ? { show: String(pageSize) } : {})
    }),
    [defaults, filterValues, pageSize]
  )
}

export function useDebouncedFilterSync(callback, values, delay) {
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      callback()
    }, delay)

    return () => clearTimeout(timerRef.current)
  }, values)
}
