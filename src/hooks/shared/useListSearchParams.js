import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value || '', 10)
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed
}

export function useListSearchParams({
  defaultPage = 1,
  defaultPageSize,
  pageKey = 'page',
  pageSizeKey = 'show',
  sortable = false,
  filterParsers = {}
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = useMemo(() => parsePositiveInt(searchParams.get(pageKey), defaultPage), [defaultPage, pageKey, searchParams])

  const pageSize = useMemo(() => {
    if (defaultPageSize === undefined) return undefined
    return parsePositiveInt(searchParams.get(pageSizeKey), defaultPageSize)
  }, [defaultPageSize, pageSizeKey, searchParams])

  const sortField = sortable ? searchParams.get('sortField') || null : null
  const sortOrder = sortable ? searchParams.get('sortOrder') || null : null

  const filters = useMemo(() => {
    return Object.entries(filterParsers).reduce((acc, [key, parser]) => {
      const rawValue = searchParams.get(key)
      const parsedValue = parser(rawValue)

      if (parsedValue !== undefined) {
        acc[key] = parsedValue
      }

      return acc
    }, {})
  }, [filterParsers, searchParams])

  const updateParams = useCallback(
    updater => {
      const params = new URLSearchParams(searchParams)
      updater(params)
      setSearchParams(params, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  const setPage = useCallback(
    nextPage => {
      const resolvedPage = typeof nextPage === 'function' ? nextPage(page) : nextPage
      const normalizedPage = parsePositiveInt(String(resolvedPage), defaultPage)

      updateParams(params => {
        if (normalizedPage > defaultPage) params.set(pageKey, String(normalizedPage))
        else params.delete(pageKey)
      })
    },
    [defaultPage, page, pageKey, updateParams]
  )

  const setPageSize = useCallback(
    nextPageSize => {
      if (defaultPageSize === undefined) return

      const normalizedPageSize = parsePositiveInt(String(nextPageSize), defaultPageSize)

      updateParams(params => {
        if (normalizedPageSize !== defaultPageSize) params.set(pageSizeKey, String(normalizedPageSize))
        else params.delete(pageSizeKey)
        params.delete(pageKey)
      })
    },
    [defaultPageSize, pageKey, pageSizeKey, updateParams]
  )

  const setSortField = useCallback(
    nextField => {
      if (!sortable) return

      updateParams(params => {
        if (nextField) params.set('sortField', nextField)
        else params.delete('sortField')
        params.delete(pageKey)
      })
    },
    [pageKey, sortable, updateParams]
  )

  const setSortOrder = useCallback(
    nextOrder => {
      if (!sortable) return

      const resolvedOrder = typeof nextOrder === 'function' ? nextOrder(sortOrder) : nextOrder

      updateParams(params => {
        if (resolvedOrder) params.set('sortOrder', resolvedOrder)
        else params.delete('sortOrder')
        if (!resolvedOrder) params.delete('sortField')
        params.delete(pageKey)
      })
    },
    [pageKey, sortOrder, sortable, updateParams]
  )

  const setFilters = useCallback(
    nextFilters => {
      updateParams(params => {
        Object.keys(filterParsers).forEach(key => params.delete(key))

        Object.entries(nextFilters || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value))
          }
        })

        params.delete(pageKey)
      })
    },
    [filterParsers, pageKey, updateParams]
  )

  return {
    searchParams,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filters,
    setFilters,
    updateParams
  }
}

export const stringFilter = value => value || undefined
export const numberFilter = value => (value === null ? undefined : Number(value))
