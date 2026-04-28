import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_FILTER, FILTER_QUERY_PARAM, FILTERS } from '../constants'

const getValidParamValue = (value, options, fallback) => {
  if (!value) return fallback
  return options.some(option => option.id === value) ? value : fallback
}

export function useWishlistUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeFilter = useMemo(
    () => getValidParamValue(searchParams.get(FILTER_QUERY_PARAM), FILTERS, DEFAULT_FILTER),
    [searchParams]
  )

  const updateSearchParam = useCallback(
    (key, value, defaultValue) => {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev)

          if (!value || value === defaultValue) {
            next.delete(key)
          } else {
            next.set(key, value)
          }

          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const handleChangeFilter = useCallback(
    filterId => {
      const nextFilter = getValidParamValue(filterId, FILTERS, DEFAULT_FILTER)
      updateSearchParam(FILTER_QUERY_PARAM, nextFilter, DEFAULT_FILTER)
    },
    [updateSearchParam]
  )

  return {
    activeFilter,
    handleChangeFilter
  }
}
