import { useCallback } from 'react'
import { Form, Input } from 'antd'

const { TextArea } = Input

export function useLocalizedContentFields({ classPrefix, fieldName, requiredRule }) {
  const TextField = useCallback(({ root, path, label, required = false, rows = 0, placeholder, disabled = false }) => (
    <Form.Item label={label} name={fieldName(root, ...path)} rules={required ? requiredRule : undefined}>
      {rows > 0 ? (
        <TextArea rows={rows} placeholder={placeholder || label} disabled={disabled} />
      ) : (
        <Input placeholder={placeholder || label} disabled={disabled} />
      )}
    </Form.Item>
  ), [fieldName, requiredRule])

  const Section = useCallback(({ title, description, children }) => (
    <section className={`${classPrefix}-section`}>
      <div className={`${classPrefix}-section__header`}>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  ), [classPrefix])

  return { Section, TextField }
}
