import { UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Slider, Switch, Tag, Typography, Upload } from 'antd'
import { useMemo } from 'react'
import { RISK_COLORS } from '@/pages/admin/ChatbotShared/utils'

const { Text } = Typography

const LOCALE_OPTIONS = [
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'English', value: 'en' }
]

const getFormFileList = event => (Array.isArray(event) ? event : event?.fileList)

function ToolOptionLabel({ tool }) {
  const label = tool.label || tool.name
  const riskLevel = tool.riskLevel || 'safe'

  return (
    <div className="admin-ai-agent-tool-option">
      <div className="admin-ai-agent-tool-option__main">
        <span className="admin-ai-agent-tool-option__label">{label}</span>
        <span className="admin-ai-agent-tool-option__name">{tool.name}</span>
      </div>

      <div className="admin-ai-agent-tool-option__tags">
        <Tag color={RISK_COLORS[riskLevel] || 'default'}>{riskLevel}</Tag>
        {tool.requiresConfirmation && <Tag color="warning">confirm</Tag>}
        {tool.enabled === false && <Tag>global off</Tag>}
      </div>
    </div>
  )
}

export default function AIAgentModal({
  form,
  open,
  editingAgent,
  saving,
  providerOptions = [],
  toolRegistry = [],
  onOk,
  onCancel,
  onAvatarBeforeUpload,
  onAvatarRemove
}) {
  const providerCode = Form.useWatch('providerCode', form)

  const modelOptions = useMemo(() => {
    const provider = providerOptions.find(item => item.value === providerCode)
    if (!provider) return []
    return provider.models.map(model => ({ label: model, value: model }))
  }, [providerCode, providerOptions])

  const toolOptions = useMemo(() => {
    const groups = new Map()

    toolRegistry.forEach(tool => {
      if (!tool?.name) return
      const group = tool.group || 'other'
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group).push(tool)
    })

    return Array.from(groups.entries()).map(([group, tools]) => ({
      label: group,
      options: tools.map(tool => ({
        value: tool.name,
        title: tool.label || tool.name,
        searchText: [
          tool.name,
          tool.label,
          tool.description,
          tool.group,
          tool.riskLevel
        ].filter(Boolean).join(' '),
        label: <ToolOptionLabel tool={tool} />
      }))
    }))
  }, [toolRegistry])

  const popupProps = {
    getPopupContainer: () => document.body,
    dropdownStyle: { zIndex: 9999 }
  }

  return (
    <Modal
      title={editingAgent ? 'Edit AI agent' : 'Create AI agent'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingAgent ? 'Save changes' : 'Create agent'}
      confirmLoading={saving}
      destroyOnClose
      width={760}
      className="admin-chatbot-modal admin-ai-agent-modal"
      styles={{
        body: {
          overflowX: 'hidden'
        }
      }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label="Agent name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="Sales assistant" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="code"
              label="Code"
              rules={[
                { required: true, message: 'Code is required' },
                { pattern: /^[a-z0-9-_]+$/i, message: 'Only letters, numbers, - or _' }
              ]}
              extra="Unique identifier, used in runtime selection"
            >
              <Input placeholder="sales-assistant" disabled={!!editingAgent} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={2} placeholder="What does this agent do?" />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={8}>
            <Form.Item name="providerCode" label="Provider" rules={[{ required: true }]}>
              <Select {...popupProps} options={providerOptions} placeholder="Select provider" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="model" label="Model" rules={[{ required: true }]}>
              <Select
                {...popupProps}
                options={modelOptions}
                placeholder="Select model"
                disabled={!modelOptions.length}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="locale" label="Locale">
              <Select {...popupProps} options={LOCALE_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="systemPrompt"
          label="System prompt"
          rules={[{ required: true, message: 'System prompt is required' }]}
        >
          <Input.TextArea rows={6} placeholder="You are a helpful sales assistant for..." />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item name="greeting" label="Greeting">
              <Input.TextArea rows={2} placeholder="Hi, how can I help you today?" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="fallbackMessage" label="Fallback message">
              <Input.TextArea rows={2} placeholder="Sorry, I cannot help with that." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={8}>
            <Form.Item name="temperature" label="Temperature">
              <Slider min={0} max={2} step={0.1} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="topP" label="Top P">
              <Slider min={0} max={1} step={0.05} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="maxTokens" label="Max tokens">
              <InputNumber className="w-full" min={1} max={32000} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item name="stopSequences" label="Stop sequences" extra="Comma-separated">
              <Input placeholder="</response>, ###" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="toolIds"
              label="Built-in tools"
              extra="Per-agent whitelist. Runtime uses global enabled tools intersected with these selected tools; leave empty to inherit global tools."
            >
              <Select
                {...popupProps}
                mode="multiple"
                allowClear
                showSearch
                maxTagCount="responsive"
                optionLabelProp="title"
                optionFilterProp="searchText"
                popupClassName="admin-ai-agent-tool-dropdown"
                options={toolOptions}
                placeholder="Select chatbot tools"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={8}>
            <Form.Item name="color" label="Accent color">
              <Input type="color" style={{ height: 36, padding: 4 }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="avatar"
              label="Avatar"
              valuePropName="fileList"
              getValueFromEvent={getFormFileList}
            >
              <Upload
                className="admin-ai-agent-avatar-upload"
                listType="picture"
                maxCount={1}
                accept="image/*"
                beforeUpload={onAvatarBeforeUpload}
                onRemove={onAvatarRemove}
              >
                <Button icon={<UploadOutlined />}>Upload avatar</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="enabled" label="Enabled" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="isDefault" label="Default agent" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Text type="secondary">
          Default agent is auto-selected when no specific agent is requested by runtime.
        </Text>
      </Form>
    </Modal>
  )
}
