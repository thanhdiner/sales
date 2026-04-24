import { Button, Input, Space, Tag, Typography } from 'antd'

const { Text } = Typography

export default function AdminChatbotRulesStringListEditor({
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
      <Text strong>{title}</Text>

      <div className="mt-2 min-h-[36px]">
        <Space size={[8, 8]} wrap>
          {items.map(item => (
            <Tag key={item} closable color={tagColor} onClose={() => onRemove(item)}>
              {item}
            </Tag>
          ))}
        </Space>
      </div>

      <Space.Compact className={`mt-3 w-full ${compactClassName}`}>
        <Input
          value={inputValue}
          onChange={event => onInputChange(event.target.value)}
          onPressEnter={event => {
            event.preventDefault()
            onAdd()
          }}
          placeholder={placeholder}
        />

        <Button onClick={onAdd} type={buttonType} className={buttonType === 'primary' ? 'bg-blue-600' : ''}>
          {buttonLabel}
        </Button>
      </Space.Compact>
    </div>
  )
}
