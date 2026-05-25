import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useListSearchParams } from './useListSearchParams'

export const adminResourceQueryKeys = {
  all: ['admin-resource'],
  list: (resource, query) => [...adminResourceQueryKeys.all, resource, query]
}

const noop = () => {}
const identity = value => value
const EMPTY_ITEMS = []

export function useAdminResourceList({
  resource,
  defaultPage = 1,
  defaultPageSize,
  pageKey,
  pageSizeKey,
  sortable = false,
  filterParsers = {},
  queryFn,
  query,
  queryKeyDeps,
  selectItems = response => response?.items,
  selectTotal = response => response?.total,
  enabled = true,
  onError = noop,
  staleTime = 0,
  mapQuery = identity
}) {
  const queryClient = useQueryClient()
  const listParams = useListSearchParams({
    defaultPage,
    defaultPageSize,
    pageKey,
    pageSizeKey,
    sortable,
    filterParsers
  })
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filters,
    setFilters
  } = listParams

  const listQuery = useMemo(() => {
    const baseQuery = {
      page,
      ...(pageSize !== undefined ? { limit: pageSize } : {}),
      ...(sortable ? { sortField, sortOrder } : {}),
      ...filters,
      ...query
    }

    return mapQuery(baseQuery)
  }, [filters, mapQuery, page, pageSize, query, sortField, sortOrder, sortable])

  const queryKey = useMemo(() => adminResourceQueryKeys.list(resource, { ...listQuery, __deps: queryKeyDeps }), [listQuery, queryKeyDeps, resource])
  const result = useQuery({
    queryKey,
    queryFn: ({ signal }) => queryFn(listQuery, { signal }),
    enabled: Boolean(enabled && queryFn),
    staleTime,
    placeholderData: previousData => previousData,
    meta: { persist: false }
  })

  useEffect(() => {
    if (result.error) onError(result.error)
  }, [onError, result.error])

  const items = useMemo(() => {
    const selectedItems = selectItems(result.data)
    return Array.isArray(selectedItems) ? selectedItems : EMPTY_ITEMS
  }, [result.data, selectItems])
  const selectedTotal = Number(selectTotal(result.data)) || 0
  const [localItems, setLocalItems] = useState(EMPTY_ITEMS)
  const [localTotal, setLocalTotal] = useState(0)

  useEffect(() => {
    queueMicrotask(() => {
      setLocalItems(items)
      setLocalTotal(selectedTotal)
    })
  }, [items, selectedTotal])

  const total = localTotal
  const pagination = useMemo(
    () => ({
      current: page,
      pageSize,
      total
    }),
    [page, pageSize, total]
  )

  const refresh = useCallback(() => result.refetch(), [result])
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: [...adminResourceQueryKeys.all, resource] }),
    [queryClient, resource]
  )

  return {
    ...listParams,
    items: localItems,
    setItems: setLocalItems,
    total,
    setTotal: setLocalTotal,
    loading: result.isLoading,
    fetching: result.isFetching,
    error: result.error,
    query: listQuery,
    queryKey,
    pagination,
    refresh,
    refetch: refresh,
    invalidate,
    setPage,
    setPageSize,
    setFilters,
    setSortField,
    setSortOrder
  }
}

export function useAdminResourceColumns({ storageKey, defaults, required = ['actions'] }) {
  const requiredColumns = useMemo(() => new Set(required), [required])
  const normalizeColumns = useCallback(
    value => {
      const nextColumns = {
        ...defaults,
        ...(value && typeof value === 'object' ? value : {})
      }

      requiredColumns.forEach(key => {
        nextColumns[key] = true
      })

      return nextColumns
    },
    [defaults, requiredColumns]
  )
  const [columnsVisible, setColumnsVisibleState] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return normalizeColumns(stored ? JSON.parse(stored) : null)
    } catch {
      return normalizeColumns(null)
    }
  })

  const setColumnsVisible = useCallback(
    nextColumns => {
      setColumnsVisibleState(current => normalizeColumns(typeof nextColumns === 'function' ? nextColumns(current) : nextColumns))
    },
    [normalizeColumns]
  )

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(columnsVisible))
    } catch {
      return
    }
  }, [columnsVisible, storageKey])

  return {
    columnsVisible,
    setColumnsVisible,
    normalizeColumns
  }
}

export function buildAdminResourceCsv(rows) {
  if (!rows.length) return ''

  const headers = Object.keys(rows[0])
  const escapeCell = value => {
    const text = String(value ?? '')
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }

  return [headers.map(escapeCell).join(','), ...rows.map(row => headers.map(header => escapeCell(row[header])).join(','))].join('\n')
}

export function downloadAdminResourceCsv({ rows, filename, onEmpty, onSuccess }) {
  if (!rows.length) {
    onEmpty?.()
    return false
  }

  const blob = new Blob([`\uFEFF${buildAdminResourceCsv(rows)}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  onSuccess?.()
  return true
}
