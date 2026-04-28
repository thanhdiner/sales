import { PlusOutlined } from '@ant-design/icons'
import { Form, Upload } from 'antd'

const defaultGetValueFromEvent = event => (Array.isArray(event) ? event : event?.fileList || [])

export default function AdminUploadField({
  accept = 'image/*',
  addLabel,
  beforeUpload,
  children,
  className,
  extra,
  getValueFromEvent = defaultGetValueFromEvent,
  label,
  listType = 'picture-card',
  maxCount,
  multiple,
  name,
  rules,
  triggerClassName,
  triggerTextClassName,
  uploadProps
}) {
  const trigger = children || (
    <div className={triggerClassName}>
      <PlusOutlined />
      <div className={triggerTextClassName}>{addLabel}</div>
    </div>
  )

  return (
    <Form.Item
      extra={extra}
      getValueFromEvent={getValueFromEvent}
      label={label}
      name={name}
      rules={rules}
      valuePropName="fileList"
    >
      <Upload
        accept={accept}
        beforeUpload={beforeUpload}
        className={className}
        listType={listType}
        maxCount={maxCount}
        multiple={multiple}
        {...uploadProps}
      >
        {trigger}
      </Upload>
    </Form.Item>
  )
}
