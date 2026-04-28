import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useAdminChatbotToolLogsPage from './hooks/useAdminChatbotToolLogsPage'
import AdminChatbotToolLogsFiltersSection from './sections/AdminChatbotToolLogsFiltersSection'
import AdminChatbotToolLogsHeaderSection from './sections/AdminChatbotToolLogsHeaderSection'
import AdminChatbotToolLogsLoadingState from './sections/AdminChatbotToolLogsLoadingState'
import AdminChatbotToolLogsTableSection from './sections/AdminChatbotToolLogsTableSection'
import '@/pages/AdminChatbotShared/AdminChatbotTheme.scss'
import './AdminChatbotToolLogsPage.scss'

export default function AdminChatbotToolLogsPage() {
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
  } = useAdminChatbotToolLogsPage()

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
    return <AdminChatbotToolLogsLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <AdminChatbotToolLogsHeaderSection
        logsLoading={logsLoading}
        onReload={handleReload}
      />

      <AdminChatbotToolLogsFiltersSection
        toolOptions={toolOptions}
        toolLogsMeta={toolLogsMeta}
        toolNameFilter={toolNameFilter}
        sessionIdFilter={sessionIdFilter}
        onToolNameFilterChange={handleToolNameFilterChange}
        onSessionIdFilterChange={handleSessionIdFilterChange}
      />

      <AdminChatbotToolLogsTableSection
        logsLoading={logsLoading}
        toolLogs={toolLogs}
        toolLogsMeta={toolLogsMeta}
        paginationMeta={paginationMeta}
        paginationActions={paginationActions}
      />
    </div>
  )
}
