import { Card, Form, Input, Switch } from 'antd'
import { RobotOutlined } from '@ant-design/icons'

const { TextArea } = Input

export default function AdminChatbotConfigFormSection({ form }) {
  return (
    <Form form={form} layout="vertical">
      <Card
        title={(
          <span className="flex items-center gap-2">
            <RobotOutlined /> Hồ sơ agent
          </span>
        )}
        className="dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Form.Item name="agentName" label="Tên agent">
            <Input placeholder="Ví dụ: Trợ lý mua hàng" />
          </Form.Item>

          <Form.Item name="agentTone" label="Giọng điệu">
            <Input placeholder="Ví dụ: thân thiện, ngắn gọn" />
          </Form.Item>

          <Form.Item name="isEnabled" label="Bật agent" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </div>

        <Form.Item
          name="agentRole"
          label="Vai trò"
          extra="Mô tả ngắn agent này được phép hỗ trợ việc gì."
        >
          <TextArea rows={3} placeholder="Hỗ trợ tìm sản phẩm, tư vấn, tra cứu khuyến mãi..." />
        </Form.Item>
      </Card>
    </Form>
  )
}
