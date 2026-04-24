import { Card, Col, Input, Row, Select, Space, Statistic } from 'antd'
import { FileSearchOutlined } from '@ant-design/icons'

export default function AdminChatbotToolLogsFiltersSection({
  toolOptions,
  toolLogsMeta,
  toolNameFilter,
  sessionIdFilter,
  onToolNameFilterChange,
  onSessionIdFilterChange
}) {
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={4}>
        <Card>
          <Statistic
            title="Tổng logs"
            value={toolLogsMeta.total || 0}
            prefix={<FileSearchOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={4}>
        <Card>
          <Statistic
            title="Lỗi"
            value={toolLogsMeta.errorCount || 0}
            prefix={<FileSearchOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={16}>
        <Card>
          <Space wrap className="w-full">
            <Select
              allowClear
              placeholder="Lọc theo tool"
              className="min-w-[220px]"
              options={toolOptions}
              value={toolNameFilter}
              onChange={onToolNameFilterChange}
            />

            <Input
              placeholder="Lọc theo sessionId"
              className="min-w-[260px]"
              value={sessionIdFilter}
              onChange={event => onSessionIdFilterChange(event.target.value)}
            />
          </Space>
        </Card>
      </Col>
    </Row>
  )
}
