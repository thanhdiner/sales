import { Button, Form } from 'antd'

export default function AdminFormActions({
  cancelButtonClassName,
  cancelDisabled,
  cancelLabel,
  className,
  containerClassName,
  extra,
  formItemClassName,
  loading,
  onCancel,
  submitButtonClassName,
  submitDisabled,
  submitLabel,
  submittingLabel,
  submitType = 'primary'
}) {
  const buttons = (
    <>
      <Button
        className={cancelButtonClassName}
        disabled={cancelDisabled ?? loading}
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>

      {extra}

      <Button
        className={submitButtonClassName}
        disabled={submitDisabled ?? loading}
        htmlType="submit"
        loading={loading}
        type={submitType}
      >
        {loading && submittingLabel ? submittingLabel : submitLabel}
      </Button>
    </>
  )

  const content = containerClassName ? <div className={containerClassName}>{buttons}</div> : buttons

  if (formItemClassName) {
    return <Form.Item className={formItemClassName}>{content}</Form.Item>
  }

  return <div className={className}>{content}</div>
}
