import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import ChatbotToolsLoadingState from './sections/ChatbotToolsLoadingState'
import ChatbotToolsHeader from './sections/ChatbotToolsHeader'
import ChatbotToolsStats from './sections/ChatbotToolsStats'
import ChatbotToolsTable from './sections/ChatbotToolsTable'
import useChatbotTools from './hooks/useChatbotTools'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'

const DEFAULT_PAGE_SIZE = 10

export default function ChatbotTools() {
  const { t } = useTranslation('adminChatbotTools')
  const {
    loading,
    saving,
    toolRegistry,
    enabledTools,
    disabledTools,
    handleReload,
    handleSave,
    handleToggleTool
  } = useChatbotTools()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return toolRegistry.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, toolRegistry])

  if (loading) {
    return <ChatbotToolsLoadingState />
  }

  return (
    <div className="admin-chatbot-page mx-auto max-w-7xl">
      <SEO title={t('seo.title')} noIndex />

      <ChatbotToolsHeader
        saving={saving}
        onReload={handleReload}
        onSave={handleSave}
      />

      <ChatbotToolsStats
        totalTools={toolRegistry.length}
        enabledTools={enabledTools}
        disabledTools={disabledTools}
      />

      <ChatbotToolsTable
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
