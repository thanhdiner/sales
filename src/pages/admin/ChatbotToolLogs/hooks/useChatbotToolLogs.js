import { useCallback, useEffect, useState } from 'react'
import useChatbotConfigData from '@/pages/admin/ChatbotShared/hooks/useChatbotConfigData'

const DEFAULT_LOGS_PAGE = 1
const DEFAULT_LOGS_PAGE_SIZE = 50

export default function useChatbotToolLogs() {
  const [toolNameFilter, setToolNameFilter] = useState(undefined)
  const [sessionIdFilter, setSessionIdFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(DEFAULT_LOGS_PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_LOGS_PAGE_SIZE)
  const [paginationEnabled, setPaginationEnabled] = useState(true)
  const [lastLoadedPage, setLastLoadedPage] = useState(DEFAULT_LOGS_PAGE)
  const [lastLoadedLimit, setLastLoadedLimit] = useState(DEFAULT_LOGS_PAGE_SIZE)
  const [effectiveTotal, setEffectiveTotal] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [pageLoadError, setPageLoadError] = useState(false)

  const {
    toolRegistry,
    loading,
    logsLoading,
    toolLogs,
    toolLogsMeta,
    loadToolLogs
  } = useChatbotConfigData({ loadLogs: true, logLimit: DEFAULT_LOGS_PAGE_SIZE })

  const requestLogs = useCallback(async ({ page, limit, silent = false, withLoading = true }) => {
    const response = await loadToolLogs(
      {
        page,
        limit,
        toolName: toolNameFilter,
        sessionId: sessionIdFilter.trim() || undefined
      },
      { silent, withLoading }
    )

    return response
  }, [loadToolLogs, sessionIdFilter, toolNameFilter])

  const fallbackTotal = currentPage * pageSize + (hasNextPage ? 1 : 0)
  const totalLogs = paginationEnabled ? effectiveTotal || toolLogsMeta.total || fallbackTotal : toolLogs.length
  const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize))
  const canGoNext = paginationEnabled ? currentPage < totalPages : hasNextPage
  const canGoPrev = currentPage > 1


  useEffect(() => {
    setCurrentPage(DEFAULT_LOGS_PAGE)
  }, [toolNameFilter, sessionIdFilter])

  useEffect(() => {
    let mounted = true

    const run = async () => {
      setPageLoadError(false)
      const response = await requestLogs({ page: currentPage, limit: pageSize })

      if (!mounted) return

      const responseTotal = Number(response?.meta?.total || 0)
      const responsePage = Number(response?.meta?.page || currentPage)
      const responseLimit = Number(response?.meta?.limit || pageSize)
      const currentCount = Array.isArray(response?.data) ? response.data.length : 0
      const supportsPagination = response?.meta?.page !== undefined || response?.meta?.limit !== undefined || currentPage === DEFAULT_LOGS_PAGE

      setPaginationEnabled(supportsPagination)
      setLastLoadedPage(responsePage)
      setLastLoadedLimit(responseLimit)
      setHasNextPage(currentCount === responseLimit)
      setEffectiveTotal(responseTotal || ((responsePage - 1) * responseLimit + currentCount + (currentCount === responseLimit ? 1 : 0)))

      if (!supportsPagination && currentPage > DEFAULT_LOGS_PAGE) {
        setPageLoadError(true)
        setCurrentPage(DEFAULT_LOGS_PAGE)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [currentPage, pageSize, requestLogs])

  useEffect(() => {
    if (!paginationEnabled) return
    if (toolLogs.length > 0) return
    if (currentPage === DEFAULT_LOGS_PAGE) return

    setCurrentPage(previousPage => Math.max(DEFAULT_LOGS_PAGE, previousPage - 1))
  }, [currentPage, paginationEnabled, toolLogs.length])

  const toolOptions = toolRegistry.map(tool => ({
    value: tool.name,
    label: tool.label || tool.name
  }))

  const handleReload = () => {
    void requestLogs({ page: currentPage, limit: pageSize })
  }

  const handleToolNameFilterChange = value => {
    setToolNameFilter(value)
  }

  const handleSessionIdFilterChange = value => {
    setSessionIdFilter(value)
  }

  const handlePageChange = page => {
    if (!paginationEnabled && page > DEFAULT_LOGS_PAGE) return
    setCurrentPage(page)
  }

  const handlePageSizeChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }
  return {
    loading,
    logsLoading,
    toolOptions,
    toolLogs,
    toolLogsMeta,
    toolNameFilter,
    sessionIdFilter,
    currentPage,
    pageSize,
    totalLogs,
    totalPages,
    canGoNext,
    canGoPrev,
    paginationEnabled,
    pageLoadError,
    lastLoadedPage,
    lastLoadedLimit,
    handleReload,
    handleToolNameFilterChange,
    handleSessionIdFilterChange,
    handlePageChange,
    handlePageSizeChange
  }
}
