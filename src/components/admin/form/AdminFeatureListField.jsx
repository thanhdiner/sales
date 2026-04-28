import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'

export default function AdminFeatureListField({
  addButtonClassName,
  addLabel,
  fieldClassName,
  inputClassName,
  label,
  name = 'features',
  placeholder,
  removeButtonClassName,
  removeLabel,
  rowClassName,
  requiredRules
}) {
  const resolvePlaceholder = fieldName =>
    typeof placeholder === 'function' ? placeholder(fieldName) : placeholder

  return (
    <Form.Item label={label}>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <div className={fieldClassName}>
            {fields.map(({ key, name: fieldName, ...restField }) => (
              <div key={key} className={rowClassName}>
                <Form.Item
                  {...restField}
                  name={fieldName}
                  rules={requiredRules}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input className={inputClassName} placeholder={resolvePlaceholder(fieldName)} />
                </Form.Item>

                <Button
                  className={removeButtonClassName}
                  danger
                  onClick={() => remove(fieldName)}
                  type="text"
                >
                  {removeLabel}
                </Button>
              </div>
            ))}

            <Button
              block
              className={addButtonClassName}
              icon={<PlusOutlined />}
              onClick={() => add()}
              type="dashed"
            >
              {addLabel}
            </Button>
          </div>
        )}
      </Form.List>
    </Form.Item>
  )
}
