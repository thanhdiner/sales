import { Alert, Card, Form, Input, Select } from 'antd'
import AdminChatbotRulesStringListEditor from '../components/AdminChatbotRulesStringListEditor'

const { TextArea } = Input

export default function AdminChatbotRulesContentSection({
  form,
  watchedKeywords,
  watchedRules,
  keywordInput,
  ruleInput,
  onKeywordInputChange,
  onRuleInputChange,
  onAddKeyword,
  onRemoveKeyword,
  onAddRule,
  onRemoveRule
}) {
  return (
    <>
      <Alert
        className="mb-4"
        type="info"
        showIcon
        message="Rules nên chỉ chứa chính sách hành vi và guardrail"
        description="Nếu là cấu hình model/provider thì dùng Runtime & Provider. Nếu là quyền bật/tắt tool thì dùng Agent Tools."
      />

      <Form form={form} layout="vertical">
        <Card title="Prompt, rules và fallback" className="dark:border-gray-700 dark:bg-gray-800">
          <Form.Item
            name="brandVoice"
            label="Brand voice"
            extra="Hướng dẫn cách agent nên giao tiếp với khách."
          >
            <TextArea
              rows={4}
              placeholder="Ví dụ: Thân thiện, xưng mình/bạn, ngắn gọn, không vòng vo..."
            />
          </Form.Item>

          <Form.Item
            name="systemPromptOverride"
            label="System prompt override"
            extra="Nếu điền, prompt này sẽ thay thế prompt động mặc định."
          >
            <TextArea rows={6} placeholder="Để trống để dùng prompt mặc định..." />
          </Form.Item>

          <Form.Item
            name="fallbackMessage"
            label="Fallback message"
            extra="Tin nhắn trả về khi AI gặp lỗi hoặc không xử lý được."
          >
            <TextArea rows={2} placeholder="Xin lỗi, mình đang gặp chút trục trặc..." />
          </Form.Item>

          <Form.Item name="systemRules" hidden>
            <Select mode="multiple" />
          </Form.Item>

          <div className="mb-4">
            <AdminChatbotRulesStringListEditor
              title="Quy tắc hệ thống"
              items={watchedRules}
              tagColor="blue"
              inputValue={ruleInput}
              onInputChange={onRuleInputChange}
              onAdd={onAddRule}
              onRemove={onRemoveRule}
              placeholder="Thêm quy tắc như: Không tự tạo đơn nếu khách chưa xác nhận"
              buttonLabel="Thêm rule"
              buttonType="primary"
              compactClassName="max-w-2xl"
            />
          </div>

          <Form.Item name="autoEscalateKeywords" hidden>
            <Select mode="multiple" />
          </Form.Item>

          <AdminChatbotRulesStringListEditor
            title="Từ khóa auto-escalate"
            items={watchedKeywords}
            tagColor="orange"
            inputValue={keywordInput}
            onInputChange={onKeywordInputChange}
            onAdd={onAddKeyword}
            onRemove={onRemoveKeyword}
            placeholder="Ví dụ: hoàn tiền, hủy đơn, gặp nhân viên"
            buttonLabel="Thêm"
          />
        </Card>
      </Form>
    </>
  )
}
