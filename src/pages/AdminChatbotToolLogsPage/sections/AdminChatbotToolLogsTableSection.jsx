import { Alert, Card, Pagination, Table, Tag, Tooltip, Typography } from 'antd'
import {
  formatDateTime,
  formatJsonCompact,
  OUTCOME_COLORS
} from '@/pages/AdminChatbotShared/utils'

const { Paragraph, Text } = Typography

const logColumns = [
  {
    title: 'Thời gian',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 140,
    render: value => <Text>{formatDateTime(value)}</Text>
  },
  {
    title: 'Tool',
    key: 'tool',
    width: 180,
    render: (_, log) => (
      <div>
        <div className="admin-chatbot-primary-text font-medium">
          {log.toolLabel || log.toolName}
        </div>
        <Text type="secondary" className="text-xs">
          {log.toolName}
        </Text>
      </div>
    )
  },
  {
    title: 'Phiên',
    dataIndex: 'sessionId',
    key: 'sessionId',
    width: 180,
    render: value => (
      <Tooltip title={value}>
        <Text code>{value?.slice(0, 22) || '--'}</Text>
      </Tooltip>
    )
  },
  {
    title: 'Kết quả',
    dataIndex: 'outcome',
    key: 'outcome',
    width: 110,
    render: value => (
      <Tag color={OUTCOME_COLORS[value] || 'default'}>
        {value || 'success'}
      </Tag>
    )
  },
  {
    title: 'Duration',
    dataIndex: 'durationMs',
    key: 'durationMs',
    width: 100,
    render: value => <Text>{value || 0}ms</Text>
  },
  {
    title: 'Input',
    dataIndex: 'toolArgs',
    key: 'toolArgs',
    render: value => (
      <Tooltip title={formatJsonCompact(value)}>
        <Paragraph className="!mb-0 font-mono text-xs" ellipsis={{ rows: 2, expandable: false }}>
          {formatJsonCompact(value)}
        </Paragraph>
      </Tooltip>
    )
  },
  {
    title: 'Preview',
    dataIndex: 'resultPreview',
    key: 'resultPreview',
    render: value => (
      <Tooltip title={value}>
        <Paragraph className="!mb-0 text-sm" ellipsis={{ rows: 2, expandable: false }}>
          {value || '--'}
        </Paragraph>
      </Tooltip>
    )
  }
]

export default function AdminChatbotToolLogsTableSection({
  logsLoading,
  toolLogs,
  toolLogsMeta,
  paginationMeta,
  paginationActions
}) {
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

  return (
    <Card className="admin-chatbot-card">
      {pageLoadError && (
        <Alert
          className="admin-chatbot-alert mb-4"
          type="warning"
          showIcon
          message="Backend hiện chưa hỗ trợ phân trang log đầy đủ"
          description="Đang fallback về trang đầu tiên với giới hạn bản ghi hiện có."
        />
      )}

      <Table
        className="admin-chatbot-table"
        rowKey="_id"
        columns={logColumns}
        dataSource={toolLogs}
        loading={logsLoading}
        pagination={false}
        scroll={{ x: 1150 }}
        locale={{
          emptyText: 'Chưa có tool call log nào'
        }}
      />

      <div className="admin-chatbot-logs-footer mt-4 flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
        <Text type="secondary" className="text-sm">
          Hiển thị {toolLogs.length} logs • page {lastLoadedPage}/{totalPages} • limit {lastLoadedLimit} • tổng {toolLogsMeta.total || totalLogs}
        </Text>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={paginationEnabled ? totalLogs : toolLogs.length}
          showSizeChanger
          showQuickJumper
          onChange={paginationActions.onPageChange}
          onShowSizeChange={paginationActions.onPageSizeChange}
        />
      </div>
    </Card>
  )
}
