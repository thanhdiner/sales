import { Button, Modal, Space, message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateProductContent } from '@/services/admin/commerce/product'

const ACTIONS = ['suggest', 'improve', 'complete']

const getNestedValue = (source, path) => {
  if (!source || !path) return undefined
  return path.split('.').reduce((value, key) => value?.[key], source)
}

const setNestedValue = (form, path, value) => {
  const name = path.includes('.') ? path.split('.') : path
  form.setFieldValue(name, value)
}

const normalizeResultValue = (result, target) => {
  if (target === 'all') return result
  return getNestedValue(result, target)
}

const renderPreviewValue = value => {
  if (Array.isArray(value)) {
    return (
      <ul>
        {value.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    )
  }

  if (value && typeof value === 'object') {
    return <pre>{JSON.stringify(value, null, 2)}</pre>
  }

  return <div dangerouslySetInnerHTML={{ __html: String(value || '') }} />
}

export default function ProductAIAssistant({ classNamePrefix, form, language = 'vi', size = 'small', target }) {
  const { t } = useTranslation('adminProducts')
  const availableActions = target === 'all' ? ['generate_all'] : ACTIONS
  const [action, setAction] = useState(availableActions[0])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState(null)

  const requestContent = async nextAction => {
    setAction(nextAction)
    setLoading(true)

    try {
      const response = await generateProductContent({
        action: nextAction,
        target,
        language,
        product: form.getFieldsValue(true)
      })
      setResult(response?.data?.result || null)
      setOpen(true)
    } catch (error) {
      message.error(error?.response?.message || t('form.ai.error'))
    } finally {
      setLoading(false)
    }
  }

  const applyResult = () => {
    if (!result) return

    if (target === 'all') {
      form.setFieldsValue(result)
    } else {
      const value = normalizeResultValue(result, target)
      if (value !== undefined) setNestedValue(form, target, value)
    }

    setOpen(false)
    message.success(t('form.ai.applied'))
  }

  const previewValue = normalizeResultValue(result, target)

  return (
    <div className={`${classNamePrefix}__ai-assistant`}>
      <Space size={6} wrap>
        {availableActions.map(item => (
          <Button
            className={`${classNamePrefix}__ai-btn`}
            key={item}
            loading={loading && action === item}
            onClick={() => requestContent(item)}
            size={size}
            type={item === 'suggest' ? 'primary' : 'default'}
          >
            {t(`form.ai.actions.${item}`)}
          </Button>
        ))}
      </Space>

      <Modal
        className={`${classNamePrefix}__ai-modal`}
        rootClassName={`${classNamePrefix}__ai-modal-root`}
        cancelText={t('form.ai.cancel')}
        okText={t('form.ai.apply')}
        onCancel={() => setOpen(false)}
        onOk={applyResult}
        open={open}
        title={t('form.ai.previewTitle')}
        width={760}
      >
        <div className={`${classNamePrefix}__ai-preview`}>{renderPreviewValue(previewValue)}</div>
        <Button loading={loading} onClick={() => requestContent(action)} size="small">
          {t('form.ai.regenerate')}
        </Button>
      </Modal>
    </div>
  )
}
