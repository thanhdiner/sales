import { Alert, Card, Empty, Pagination, Tag, Tooltip, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  formatDateTime,
  formatJsonCompact,
  OUTCOME_COLORS
} from '@/pages/AdminChatbotShared/utils'

const { Paragraph, Text } = Typography

const tableHeadingKeys = ['time', 'tool', 'session', 'outcome', 'duration', 'input', 'preview']
const paginationLocaleKeys = [
  'items_per_page',
  'jump_to',
  'jump_to_confirm',
  'page',
  'prev_page',
  'next_page',
  'prev_5',
  'next_5',
  'prev_3',
  'next_3'
]

function getOutcomeValue(log) {
  return log.outcome || 'success'
}

function LogOutcomeTag({ value, t }) {
  const outcome = value || 'success'

  return (
    <Tag color={OUTCOME_COLORS[outcome] || 'default'} className="admin-chatbot-tool-log-outcome">
      {t(`table.outcomes.${outcome}`, { defaultValue: outcome })}
    </Tag>
  )
}

function ToolCell({ log }) {
  return (
    <div className="min-w-0">
      <div className="admin-chatbot-primary-text truncate font-medium">
        {log.toolLabel || log.toolName || '--'}
      </div>
      <Text type="secondary" className="block truncate text-xs">
        {log.toolName || '--'}
      </Text>
    </div>
  )
}

function SessionCell({ value }) {
  const displayValue = value?.slice(0, 22) || '--'

  return (
    <Tooltip title={value}>
      <Text code className="admin-chatbot-tool-log-code">
        {displayValue}
      </Text>
    </Tooltip>
  )
}

function CompactParagraph({ value, className = '' }) {
  return (
    <Tooltip title={value}>
      <Paragraph className={`!mb-0 ${className}`} ellipsis={{ rows: 2, expandable: false }}>
        {value || '--'}
      </Paragraph>
    </Tooltip>
  )
}

function JsonCell({ value }) {
  return (
    <CompactParagraph
      value={formatJsonCompact(value)}
      className="admin-chatbot-tool-log-json font-mono text-xs"
    />
  )
}

function PreviewCell({ value }) {
  return (
    <CompactParagraph
      value={value || '--'}
      className="admin-chatbot-tool-log-preview-text text-sm"
    />
  )
}

function DetailBlock({ label, children }) {
  return (
    <div className="admin-chatbot-tool-log-detail-block">
      <div className="admin-chatbot-tool-log-detail-label">{label}</div>
      {children}
    </div>
  )
}

function ToolLogRow({ log, dateLocale, labels, t }) {
  return (
    <div className="admin-chatbot-tool-log-row admin-chatbot-tool-log-grid">
      <div className="admin-chatbot-tool-log-cell admin-chatbot-tool-log-time">
        <Text>{formatDateTime(log.createdAt, dateLocale)}</Text>
      </div>

      <div className="admin-chatbot-tool-log-cell admin-chatbot-tool-log-tool">
        <ToolCell log={log} />
      </div>

      <div className="admin-chatbot-tool-log-cell admin-chatbot-tool-log-session">
        <SessionCell value={log.sessionId} />
      </div>

      <div className="admin-chatbot-tool-log-cell admin-chatbot-tool-log-result">
        <LogOutcomeTag value={getOutcomeValue(log)} t={t} />
      </div>

      <div className="admin-chatbot-tool-log-cell admin-chatbot-tool-log-duration">
        <Text>{log.durationMs || 0}ms</Text>
      </div>

      <div className="admin-chatbot-tool-log-cell admin-chatbot-tool-log-input" data-label={labels.input}>
        <JsonCell value={log.toolArgs} />
      </div>

      <div className="admin-chatbot-tool-log-cell admin-chatbot-tool-log-preview" data-label={labels.preview}>
        <PreviewCell value={log.resultPreview} />
      </div>
    </div>
  )
}

function ToolLogMobileRow({ log, dateLocale, labels, t }) {
  return (
    <article className="admin-chatbot-tool-log-mobile-row">
      <div className="flex items-start justify-between gap-3">
        <ToolCell log={log} />
        <LogOutcomeTag value={getOutcomeValue(log)} t={t} />
      </div>

      <div className="admin-chatbot-tool-log-mobile-meta">
        <span>{formatDateTime(log.createdAt, dateLocale)}</span>
        <span>{log.durationMs || 0}ms</span>
      </div>

      <DetailBlock label={labels.session}>
        <SessionCell value={log.sessionId} />
      </DetailBlock>

      <DetailBlock label={labels.input}>
        <JsonCell value={log.toolArgs} />
      </DetailBlock>

      <DetailBlock label={labels.preview}>
        <PreviewCell value={log.resultPreview} />
      </DetailBlock>
    </article>
  )
}

function LogsEmptyState() {
  const { t } = useTranslation('adminChatbotToolLogs')

  return (
    <div className="admin-chatbot-tool-logs-state">
      <Empty description={<span>{t('table.empty')}</span>} />
    </div>
  )
}

function LogsLoadingState() {
  const { t } = useTranslation('adminChatbotToolLogs')

  return (
    <div className="admin-chatbot-tool-logs-state">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--chatbot-border)] border-t-[var(--chatbot-accent)]" />
        <Text type="secondary">{t('table.loading')}</Text>
      </div>
    </div>
  )
}

export default function AdminChatbotToolLogsTableSection({
  logsLoading,
  toolLogs,
  toolLogsMeta,
  paginationMeta,
  paginationActions
}) {
  const { t, i18n } = useTranslation('adminChatbotToolLogs')
  const {
    currentPage,
    pageSize,
    totalLogs,
    totalPages,
    paginationEnabled,
    pageLoadError,
    lastLoadedPage,
    lastLoadedLimit
  } = paginationMeta

  const dateLocale = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN'
  const labels = tableHeadingKeys.reduce((acc, key) => ({
    ...acc,
    [key]: t(`table.headings.${key}`)
  }), {})
  const tableHeadings = tableHeadingKeys.map(key => ({ key, label: labels[key] }))
  const paginationLocale = paginationLocaleKeys.reduce((acc, key) => ({
    ...acc,
    [key]: t(`pagination.${key}`)
  }), {})
  const paginationTotal = paginationEnabled ? totalLogs : toolLogs.length
  const footerSummary = t('table.footerSummary', {
    count: toolLogs.length,
    page: lastLoadedPage,
    totalPages,
    limit: lastLoadedLimit,
    total: toolLogsMeta.total || totalLogs
  })

  return (
    <Card className="admin-chatbot-card admin-chatbot-tool-logs-card">
      {pageLoadError && (
        <Alert
          className="admin-chatbot-alert mb-4"
          type="warning"
          showIcon
          message={t('table.pageLoadErrorMessage')}
          description={t('table.pageLoadErrorDescription')}
        />
      )}

      <div className="admin-chatbot-tool-logs-table">
        <div className="admin-chatbot-tool-log-head admin-chatbot-tool-log-grid">
          {tableHeadings.map(heading => (
            <div key={heading.key} className={`admin-chatbot-tool-log-heading admin-chatbot-tool-log-${heading.key}`}>
              {heading.label}
            </div>
          ))}
        </div>

        {logsLoading ? (
          <LogsLoadingState />
        ) : toolLogs.length === 0 ? (
          <LogsEmptyState />
        ) : (
          <>
            <div className="admin-chatbot-tool-log-body">
              {toolLogs.map(log => (
                <ToolLogRow key={log._id} log={log} dateLocale={dateLocale} labels={labels} t={t} />
              ))}
            </div>

            <div className="admin-chatbot-tool-log-mobile-list">
              {toolLogs.map(log => (
                <ToolLogMobileRow key={log._id} log={log} dateLocale={dateLocale} labels={labels} t={t} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="admin-chatbot-logs-footer mt-4 flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
        <Text type="secondary" className="admin-chatbot-tool-logs-summary text-sm">
          {footerSummary}
        </Text>

        <Pagination
          className="admin-chatbot-tool-logs-pagination"
          current={currentPage}
          pageSize={pageSize}
          total={paginationTotal}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) => t('table.showTotal', {
            rangeStart: range[0],
            rangeEnd: range[1],
            total
          })}
          responsive
          disabled={logsLoading}
          locale={paginationLocale}
          onChange={paginationActions.onPageChange}
          onShowSizeChange={paginationActions.onPageSizeChange}
        />
      </div>
    </Card>
  )
}
