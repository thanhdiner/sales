import { Button, Input, Space, Tag, Typography } from 'antd'

const { Text } = Typography

export default function ChatbotRulesStringListEditor({
  title,
  items,
  tagColor,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
  buttonLabel,
  buttonType = 'default',
  compactClassName = 'max-w-xl'
}) {
  return (
    <div>
      <Text strong className="admin-chatbot-primary-text">{title}</Text>

      <div className="mt-2 min-h-[36px]">
        <Space size={[8, 8]} wrap>
          {items.map(item => (
            <Tag key={item} closable color={tagColor} onClose={() => onRemove(item)} className="admin-chatbot-string-tag">
              {item}
            </Tag>
          ))}
        </Space>
      </div>

      <Space.Compact className={`admin-chatbot-rule-input mt-3 w-full ${compactClassName}`}>
        <Input
          value={inputValue}
          onChange={event => onInputChange(event.target.value)}
          onPressEnter={event => {
            event.preventDefault()
            onAdd()
          }}
          placeholder={placeholder}
        />

        <Button
          onClick={onAdd}
          type={buttonType}
          className={buttonType === 'primary' ? 'admin-chatbot-primary-btn' : 'admin-chatbot-action-btn'}
        >
          {buttonLabel}
        </Button>
      </Space.Compact>
    </div>
  )
}
