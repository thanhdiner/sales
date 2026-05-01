import { Form } from 'antd'
import TiptapEditor from '@/components/shared/TiptapEditor'

export default function AdminRichTextField({
  editorClassName,
  form,
  label,
  name,
  rules
}) {
  const value = Form.useWatch(name, form)

  return (
    <Form.Item name={name} label={label} rules={rules}>
      <div className={editorClassName}>
        <TiptapEditor value={value || ''} onChange={nextValue => form.setFieldValue(name, nextValue)} />
      </div>
    </Form.Item>
  )
}
