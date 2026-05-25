import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, DatePicker, Drawer, Empty, Input, Select, Space, Statistic, Table, Tag, Tooltip, Typography, message } from 'antd'
import { FileSearchOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import SEO from '@/components/shared/SEO'
import { getAIProviderKeyLogs } from '@/services/admin/chatbot/aiProviderKeys'
import { getAIProviders } from '@/services/admin/chatbot/aiProviders'
import { LOG_COLORS } from '@/pages/admin/AIProviderKeys/config/providerKeys.constants'
import { formatNumber } from '@/pages/admin/AIProviderKeys/utils/providerKeys.utils'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'
import './index.scss'

const { RangePicker } = DatePicker
const { Paragraph, Text } = Typography

const STATUS_OPTIONS = [
  { label: 'Success', value: 'success' },
  { label: 'Retry', value: 'retry' },
  { label: 'Failed', value: 'failed' }
]

const TYPE_OPTIONS = [
  { label: 'Chatbot', value: 'chatbot' },
  { label: 'Admin test key', value: 'admin-test-key' },
  { label: 'Admin test provider', value: 'admin-test-provider' },
  { label: 'Admin test runtime', value: 'admin-test-runtime' }
]

function normalizeLog(item = {}) {
  return {
    ...item,
    id: item.id || item._id,
    provider: item.provider || item.providerCode || '-',
    key: item.key || item.maskedKey || '-',
    model: item.model || '-',
    type: item.type || 'chatbot',
    status: item.status || 'success',
    retry: item.retry || 'no',
    tokens: Number(item.tokens) || 0,
    error: item.error || '-',
    createdAt: item.createdAt || null,
    time: item.createdAt
      ? new Date(item.createdAt).toLocaleString('vi-VN')
      : item.time || '-'
  }
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function buildOptions(values) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map(value => ({ label: value, value }))
}

function DetailItem({ label, children }) {
  return (
    <div className="admin-ai-provider-log-detail-item">
      <Text type="secondary">{label}</Text>
      <div>{children}</div>
    </div>
  )
}

export default function AIProviderLogs() {
  const [logs, setLogs] = useState([])
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [filters, setFilters] = useState({
    provider: undefined,
    status: undefined,
    type: undefined,
    model: undefined,
    keyword: '',
    range: null
  })

  const loadData = useCallback(async () => {
    setLoading(true)

    try {
      const [logsRes, providersRes] = await Promise.all([
        getAIProviderKeyLogs(),
        getAIProviders()
      ])

      setLogs((logsRes?.data || []).map(normalizeLog))
      setProviders(providersRes?.data || [])
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Khong the tai AI provider logs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0)
    return () => window.clearTimeout(timer)
  }, [loadData])

  const providerOptions = useMemo(() => {
    const providerCodes = providers.map(provider => provider.code)
    return buildOptions([...providerCodes, ...logs.map(log => log.provider)])
  }, [logs, providers])

  const modelOptions = useMemo(() => buildOptions(logs.map(log => log.model).filter(model => model !== '-')), [logs])

  const typeOptions = useMemo(() => {
    const knownTypes = TYPE_OPTIONS.map(option => option.value)
    const customTypes = buildOptions(logs.map(log => log.type).filter(type => !knownTypes.includes(type)))
    return [...TYPE_OPTIONS, ...customTypes]
  }, [logs])

  const filteredLogs = useMemo(() => {
    const keyword = normalizeText(filters.keyword)
    const rangeStart = filters.range?.[0]?.startOf('day')?.valueOf()
    const rangeEnd = filters.range?.[1]?.endOf('day')?.valueOf()

    return logs.filter(log => {
      if (filters.provider && log.provider !== filters.provider) return false
      if (filters.status && log.status !== filters.status) return false
      if (filters.type && log.type !== filters.type) return false
      if (filters.model && log.model !== filters.model) return false

      if (rangeStart || rangeEnd) {
        const timestamp = log.createdAt ? new Date(log.createdAt).getTime() : 0
        if (!timestamp) return false
        if (rangeStart && timestamp < rangeStart) return false
        if (rangeEnd && timestamp > rangeEnd) return false
      }

      if (!keyword) return true

      return [
        log.provider,
        log.key,
        log.model,
        log.type,
        log.status,
        log.error
      ].some(value => normalizeText(value).includes(keyword))
    })
  }, [filters, logs])

  const stats = useMemo(() => {
    const totalTokens = filteredLogs.reduce((sum, log) => sum + log.tokens, 0)
    const failed = filteredLogs.filter(log => log.status === 'failed').length
    const retry = filteredLogs.filter(log => log.status === 'retry' || log.retry === 'yes').length
    const latestError = filteredLogs.find(log => log.error && log.error !== '-')?.error || '-'

    return {
      total: filteredLogs.length,
      failed,
      retry,
      totalTokens,
      latestError
    }
  }, [filteredLogs])

  const resetFilters = () => {
    setFilters({
      provider: undefined,
      status: undefined,
      type: undefined,
      model: undefined,
      keyword: '',
      range: null
    })
  }

  const columns = useMemo(() => [
    {
      title: 'Time',
      dataIndex: 'time',
      width: 170,
      sorter: (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      width: 120,
      render: value => <Tag>{value}</Tag>
    },
    {
      title: 'Key',
      dataIndex: 'key',
      width: 150,
      render: value => <Text code>{value}</Text>
    },
    {
      title: 'Model',
      dataIndex: 'model',
      width: 170,
      ellipsis: true
    },
    {
      title: 'Request type',
      dataIndex: 'type',
      width: 180
    },
    {
      title: 'Tokens',
      dataIndex: 'tokens',
      width: 110,
      align: 'right',
      render: formatNumber,
      sorter: (a, b) => a.tokens - b.tokens
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 110,
      render: value => <Tag color={LOG_COLORS[value] || 'default'}>{value}</Tag>
    },
    {
      title: 'Retry',
      dataIndex: 'retry',
      width: 90
    },
    {
      title: 'Error',
      dataIndex: 'error',
      ellipsis: true,
      render: value => (
        <Tooltip title={value}>
          <span>{value || '-'}</span>
        </Tooltip>
      )
    }
  ], [])

  return (
    <div className="admin-chatbot-page admin-ai-provider-logs mx-auto max-w-7xl">
      <SEO title="AI Provider Logs" noIndex />

      <div className="admin-ai-provider-logs__header">
        <div>
          <h1>AI Provider Logs</h1>
          <Text type="secondary">Monitor provider, model, key usage, tokens, retries, and provider failures.</Text>
        </div>

        <Space>
          <Button onClick={resetFilters}>Reset filters</Button>
          <Button icon={<ReloadOutlined />} loading={loading} onClick={loadData}>
            Refresh
          </Button>
        </Space>
      </div>

      <div className="admin-ai-provider-logs__stats">
        <Card className="admin-chatbot-card">
          <Statistic title="Loaded logs" value={stats.total} prefix={<FileSearchOutlined />} />
          <Text type="secondary" className="admin-ai-provider-logs__stat-desc">
            Provider requests matching the current filters.
          </Text>
        </Card>
        <Card className="admin-chatbot-card">
          <Statistic title="Failed" value={stats.failed} valueStyle={{ color: stats.failed ? '#cf1322' : undefined }} />
          <Text type="secondary" className="admin-ai-provider-logs__stat-desc">
            Requests that ended with provider or key errors.
          </Text>
        </Card>
        <Card className="admin-chatbot-card">
          <Statistic title="Retries" value={stats.retry} />
          <Text type="secondary" className="admin-ai-provider-logs__stat-desc">
            Calls marked retry or routed after a provider issue.
          </Text>
        </Card>
        <Card className="admin-chatbot-card">
          <Statistic title="Tokens" value={stats.totalTokens} formatter={formatNumber} />
          <Text type="secondary" className="admin-ai-provider-logs__stat-desc">
            Total token usage recorded in the visible log set.
          </Text>
        </Card>
      </div>

      <Card className="admin-chatbot-card admin-ai-provider-logs__filters">
        <div className="admin-ai-provider-logs__filters-grid">
          <Select
            allowClear
            placeholder="Provider"
            options={providerOptions}
            value={filters.provider}
            onChange={provider => setFilters(current => ({ ...current, provider }))}
          />
          <Select
            allowClear
            placeholder="Status"
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={status => setFilters(current => ({ ...current, status }))}
          />
          <Select
            allowClear
            placeholder="Request type"
            options={typeOptions}
            value={filters.type}
            onChange={type => setFilters(current => ({ ...current, type }))}
          />
          <Select
            allowClear
            showSearch
            placeholder="Model"
            options={modelOptions}
            value={filters.model}
            onChange={model => setFilters(current => ({ ...current, model }))}
          />
          <RangePicker
            value={filters.range}
            onChange={range => setFilters(current => ({ ...current, range }))}
          />
          <Input
            allowClear
            className="admin-ai-provider-logs__search"
            placeholder="Search key, model, type, error"
            suffix={<SearchOutlined />}
            value={filters.keyword}
            onChange={event => setFilters(current => ({ ...current, keyword: event.target.value }))}
          />
        </div>
      </Card>

      <Card
        className="admin-chatbot-card admin-ai-provider-logs__table-card"
        title="Provider request history"
        extra={<Text type="secondary">Latest error: {stats.latestError}</Text>}
      >
        <Table
          rowKey="id"
          className="admin-chatbot-table"
          loading={loading}
          columns={columns}
          dataSource={filteredLogs}
          scroll={{ x: 1200 }}
          locale={{ emptyText: <Empty description="No provider logs found" /> }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: total => `${formatNumber(total)} logs`
          }}
          onRow={record => ({
            onClick: () => setSelectedLog(record)
          })}
        />
      </Card>

      <Drawer
        title="Provider log detail"
        open={!!selectedLog}
        width={520}
        onClose={() => setSelectedLog(null)}
      >
        {selectedLog && (
          <div className="admin-ai-provider-log-detail">
            <DetailItem label="Time">{selectedLog.time}</DetailItem>
            <DetailItem label="Provider">
              <Tag>{selectedLog.provider}</Tag>
            </DetailItem>
            <DetailItem label="Key">
              <Text code>{selectedLog.key}</Text>
            </DetailItem>
            <DetailItem label="Model">{selectedLog.model}</DetailItem>
            <DetailItem label="Request type">{selectedLog.type}</DetailItem>
            <DetailItem label="Tokens">{formatNumber(selectedLog.tokens)}</DetailItem>
            <DetailItem label="Status">
              <Tag color={LOG_COLORS[selectedLog.status] || 'default'}>{selectedLog.status}</Tag>
            </DetailItem>
            <DetailItem label="Retry">{selectedLog.retry}</DetailItem>
            <DetailItem label="Error">
              <Paragraph copyable={selectedLog.error !== '-'}>{selectedLog.error}</Paragraph>
            </DetailItem>
            <DetailItem label="Key id">
              <Text code>{selectedLog.keyId || '-'}</Text>
            </DetailItem>
          </div>
        )}
      </Drawer>
    </div>
  )
}
