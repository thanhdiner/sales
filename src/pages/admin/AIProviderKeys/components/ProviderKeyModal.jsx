import { Alert, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Switch, Typography } from 'antd'
import { ENVIRONMENTS } from '../config/providerKeys.constants'

const { Text } = Typography

export default function ProviderKeyModal({ form, open, editingKey, providerOptions = [], providerLocked = false, onOk, onCancel }) {
  const environmentOptions = ENVIRONMENTS.map(value => ({
    label: value,
    value
  }))
  const selectPopupProps = {
    getPopupContainer: () => document.body,
    dropdownStyle: {
      zIndex: 9999
    }
  }

  return (
    <Modal
      title={editingKey ? 'Edit API key' : 'Add API key'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingKey ? 'Save changes' : 'Add key'}
      destroyOnClose
      width={providerLocked ? 560 : 680}
      className="admin-chatbot-modal"
      styles={{
        body: {
          overflowX: 'hidden'
        }
      }}
    >
      <div className="admin-provider-key-modal">
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          message="API key is encrypted at rest. Full key will not be visible after saving."
        />

        <Form form={form} layout="vertical">
          {providerLocked ? (
            <Form.Item name="env" label="Environment" rules={[{ required: true }]}>
              <Select {...selectPopupProps} options={environmentOptions} />
            </Form.Item>
          ) : (
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item name="provider" label="Provider" rules={[{ required: true }]}>
                  <Select {...selectPopupProps} options={providerOptions} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="env" label="Environment" rules={[{ required: true }]}>
                  <Select {...selectPopupProps} options={environmentOptions} />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item name="alias" label="Key alias" rules={[{ required: true }]}>
            <Input placeholder="OpenAI Production Main" />
          </Form.Item>

          <Form.Item name="apiKey" label="API key" rules={editingKey ? [] : [{ required: true }]}>
            <Input.Password placeholder={editingKey ? 'Leave blank to keep current key' : 'Paste provider API key'} />
          </Form.Item>

          {providerLocked ? (
            <Form.Item name="enabled" label="Enabled" valuePropName="checked">
              <Switch />
            </Form.Item>
          ) : (
            <>
              <Row gutter={[12, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="requestLimit" label="Daily request limit" rules={[{ required: true }]}>
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="tokenLimit" label="Daily token limit" rules={[{ required: true }]}>
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[12, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="weight" label="Weight">
                    <InputNumber className="w-full" min={0} max={100} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="enabled" label="Enabled" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={3} placeholder="Usage purpose, owner, allowed models..." />
              </Form.Item>

              <Divider />

              <Text type="secondary">
                Saved display format: <Text code>sk-...x7K9</Text>. Full API key cannot be revealed later.
              </Text>
            </>
          )}
        </Form>
      </div>
    </Modal>
  )
}
