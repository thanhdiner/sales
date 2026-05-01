import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useChatbotToolLogs from './hooks/useChatbotToolLogs'
import ChatbotToolLogsFilters from './sections/ChatbotToolLogsFilters'
import ChatbotToolLogsHeader from './sections/ChatbotToolLogsHeader'
import ChatbotToolLogsLoadingState from './sections/ChatbotToolLogsLoadingState'
import ChatbotToolLogsTable from './sections/ChatbotToolLogsTable'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'
import './index.scss'

export default function ChatbotToolLogs() {
  const { t } = useTranslation('adminChatbotToolLogs')
  const {
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
  } = useChatbotToolLogs()

  const paginationMeta = {
    currentPage,
    pageSize,
    totalLogs,
    totalPages,
    canGoNext,
    canGoPrev,
    paginationEnabled,
    pageLoadError,
    lastLoadedPage,
    lastLoadedLimit
  }

  const paginationActions = {
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange
  }

  if (loading) {
    return <ChatbotToolLogsLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <ChatbotToolLogsHeader
        logsLoading={logsLoading}
        onReload={handleReload}
      />

      <ChatbotToolLogsFilters
        toolOptions={toolOptions}
        toolLogsMeta={toolLogsMeta}
        toolNameFilter={toolNameFilter}
        sessionIdFilter={sessionIdFilter}
        onToolNameFilterChange={handleToolNameFilterChange}
        onSessionIdFilterChange={handleSessionIdFilterChange}
      />

      <ChatbotToolLogsTable
        logsLoading={logsLoading}
        toolLogs={toolLogs}
        toolLogsMeta={toolLogsMeta}
        paginationMeta={paginationMeta}
        paginationActions={paginationActions}
      />
    </div>
  )
}
