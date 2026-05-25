import { Button, Form, Input, Modal, Space, Typography } from 'antd'
import { ExperimentOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function AddProviderModelModal({ form, open, saving, testing, onOk, onCancel, onTest }) {
  const modelId = Form.useWatch('model', form)
  const trimmedModelId = String(modelId || '').trim()

  return (
    <Modal
      title="Add Custom Model"
      open={open}
      onCancel={onCancel}
      destroyOnClose
      width={560}
      className="admin-chatbot-modal"
      footer={(
        <Space className="w-full justify-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" loading={saving} disabled={!trimmedModelId} onClick={onOk}>
            Add Model
          </Button>
        </Space>
      )}
    >
      <Form form={form} layout="vertical">
        <div className="flex items-start gap-2">
          <Form.Item
            className="mb-0 flex-1"
            name="model"
            label="Model ID"
            rules={[
              { required: true, whitespace: true, message: 'Model ID is required' }
            ]}
          >
            <Input placeholder="e.g. claude-opus-4-5" autoFocus />
          </Form.Item>

          <Button
            className="mt-[30px]"
            icon={<ExperimentOutlined />}
            loading={testing}
            disabled={!trimmedModelId}
            onClick={onTest}
          >
            Test
          </Button>
        </div>

        <Text type="secondary">
          Sent to provider as: <Text code>{trimmedModelId || 'model-id'}</Text>
        </Text>
      </Form>
    </Modal>
  )
}
