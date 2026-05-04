import { useCallback, useEffect, useState } from 'react'
import { useListSearchParams } from '@/hooks/shared/useListSearchParams'
import useChatbotConfigData from '@/pages/admin/ChatbotShared/hooks/useChatbotConfigData'

const DEFAULT_LOGS_PAGE = 1
const DEFAULT_LOGS_PAGE_SIZE = 50

export default function useChatbotToolLogs() {
  const [toolNameFilter, setToolNameFilter] = useState(undefined)
  const [sessionIdFilter, setSessionIdFilter] = useState('')
  const {
    page: currentPage,
    setPage: setCurrentPage,
    pageSize,
    setPageSize
  } = useListSearchParams({
    defaultPage: DEFAULT_LOGS_PAGE,
    defaultPageSize: DEFAULT_LOGS_PAGE_SIZE
  })
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
  } = useChatbotConfigData({ loadLogs: false, logLimit: DEFAULT_LOGS_PAGE_SIZE })

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
    let mounted = true

    const run = async () => {
      setPageLoadError(false)
      const response = await requestLogs({ page: currentPage, limit: pageSize })

      if (!mounted) return

      const responseTotal = Number(response?.meta?.total || 0)
      const responsePage = Number(response?.meta?.page || currentPage)
      const responseLimit = Number(response?.meta?.limit || pageSize)
      const currentCount = Array.isArray(response?.data) ? response.data.length : 0
      setPaginationEnabled(true)
      setLastLoadedPage(responsePage)
      setLastLoadedLimit(responseLimit)
      setHasNextPage(currentCount === responseLimit)
      setEffectiveTotal(responseTotal || ((responsePage - 1) * responseLimit + currentCount + (currentCount === responseLimit ? 1 : 0)))
    }

    run()

    return () => {
      mounted = false
    }
  }, [currentPage, pageSize, requestLogs])

  const toolOptions = toolRegistry.map(tool => ({
    value: tool.name,
    label: tool.label || tool.name
  }))

  const handleReload = () => {
    void requestLogs({ page: currentPage, limit: pageSize })
  }

  const handleToolNameFilterChange = value => {
    setToolNameFilter(value)
    setCurrentPage(DEFAULT_LOGS_PAGE)
  }

  const handleSessionIdFilterChange = value => {
    setSessionIdFilter(value)
    setCurrentPage(DEFAULT_LOGS_PAGE)
  }

  const handlePageChange = (page, size) => {
    if (size && size !== pageSize) {
      setPageSize(size)
      return
    }

    setCurrentPage(page)
  }

  const handlePageSizeChange = (_, size) => {
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
