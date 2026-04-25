import { useMemo, useState } from 'react'
import AdminChatbotToolsLoadingState from './sections/AdminChatbotToolsLoadingState'
import AdminChatbotToolsHeaderSection from './sections/AdminChatbotToolsHeaderSection'
import AdminChatbotToolsStatsSection from './sections/AdminChatbotToolsStatsSection'
import AdminChatbotToolsTableSection from './sections/AdminChatbotToolsTableSection'
import useAdminChatbotToolsPage from './hooks/useAdminChatbotToolsPage'
import '@/pages/AdminChatbotShared/AdminChatbotTheme.scss'

const DEFAULT_PAGE_SIZE = 10

export default function AdminChatbotToolsPage() {
  const {
    loading,
    saving,
    toolRegistry,
    enabledTools,
    disabledTools,
    handleReload,
    handleSave,
    handleToggleTool
  } = useAdminChatbotToolsPage()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return toolRegistry.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, toolRegistry])

  if (loading) {
    return <AdminChatbotToolsLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <AdminChatbotToolsHeaderSection
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
      />

      <AdminChatbotToolsStatsSection
        totalTools={toolRegistry.length}
        enabledTools={enabledTools}
        disabledTools={disabledTools}
      />

      <AdminChatbotToolsTableSection
        toolRegistry={paginatedTools}
        total={toolRegistry.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={page => setCurrentPage(page)}
        onPageSizeChange={(page, size) => {
          setCurrentPage(page)
          setPageSize(size)
        }}
        onToggleTool={handleToggleTool}
      />
    </div>
  )
}
