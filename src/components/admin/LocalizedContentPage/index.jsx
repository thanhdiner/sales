import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Space, Spin, Tabs, Typography, message } from 'antd'
import { EyeOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/shared/SEO'

const { Title, Text } = Typography
const { TextArea } = Input

export const cloneContent = value => {
  if (value === undefined || value === null) return value
  return JSON.parse(JSON.stringify(value))
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function mergeDefaults(defaultValue, value) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value) ? value : cloneContent(defaultValue)
  }

  if (isPlainObject(defaultValue)) {
    const source = isPlainObject(value) ? value : {}
    const keys = new Set([...Object.keys(defaultValue), ...Object.keys(source)])

    return Array.from(keys).reduce((result, key) => {
      result[key] = Object.prototype.hasOwnProperty.call(source, key)
        ? mergeDefaults(defaultValue[key], source[key])
        : cloneContent(defaultValue[key])
      return result
    }, {})
  }

  if (typeof defaultValue === 'string') {
    if (typeof value !== 'string') return defaultValue
    return value.trim() === '[object Object]' ? defaultValue : value
  }

  return value ?? defaultValue ?? ''
}

export function getEditableBaseContent(data, omittedKeys = []) {
  if (!data) return {}

  const omit = new Set([
    '_id',
    '__v',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'translations',
    ...omittedKeys
  ])

  return Object.keys(data).reduce((result, key) => {
    if (!omit.has(key)) result[key] = data[key]
    return result
  }, {})
}

export function buildLocalizedInitialValues(data, defaults, options = {}) {
  return {
    content: mergeDefaults(defaults.vi || {}, getEditableBaseContent(data, options.omittedKeys)),
    translations: {
      en: mergeDefaults(defaults.en || {}, data?.translations?.en || {})
    }
  }
}

const defaultGetResponseData = response => response?.data || null

function resolveValue(value, fallback) {
  return value === undefined ? fallback : value
}

function AdminLocalizedContentPage({
  namespace,
  classPrefix,
  getContent,
  updateContent,
  renderFields,
  getInitialValues,
  buildPayload,
  getResponseData = defaultGetResponseData,
  queryKey,
  context,
  seoTitleKey = 'seo.title',
  pageTitleKey = 'page.title',
  pageDescriptionKey = 'page.description',
  textParams,
  previewPath,
  showReset = true,
  showPreview,
  actions,
  formClassName,
  onSaved
}) {
  const { t } = useTranslation(namespace)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(null)

  const resolvedTextParams = useMemo(() => (
    typeof textParams === 'function' ? textParams(t, context) : textParams
  ), [context, t, textParams])

  const fieldName = useCallback((root, ...path) => [...root, ...path], [])
  const requiredRule = useMemo(() => [{ required: true, message: t('validation.required') }], [t])

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

  const resolveInitialValues = useCallback(data => (
    typeof getInitialValues === 'function' ? getInitialValues(data, context) : {}
  ), [context, getInitialValues])

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getContent(context)
      const data = getResponseData(response, context)

      setContent(data)
      form.setFieldsValue(resolveInitialValues(data))
    } catch {
      setContent(null)
      form.setFieldsValue(resolveInitialValues(null))
      message.error(t('messages.fetchError', resolvedTextParams))
    } finally {
      setLoading(false)
    }
  }, [context, form, getContent, getResponseData, resolveInitialValues, resolvedTextParams, t])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true)
    const payload = typeof buildPayload === 'function'
      ? buildPayload(values, context)
      : {
          ...(values.content || {}),
          translations: {
            en: values.translations?.en || {}
          }
        }

    setSaving(true)

    try {
      const response = await updateContent(payload, context)
      const savedContent = getResponseData(response, context)

      setContent(savedContent)
      form.setFieldsValue(resolveInitialValues(savedContent))

      const resolvedQueryKey = typeof queryKey === 'function' ? queryKey(context, savedContent) : queryKey
      if (resolvedQueryKey) {
        queryClient.invalidateQueries({ queryKey: resolvedQueryKey })
      }

      if (typeof onSaved === 'function') {
        onSaved({ response, savedContent, queryClient, context })
      }

      message.success(t('messages.saveSuccess', resolvedTextParams))
    } catch (error) {
      message.error(error.message || t('messages.saveError', resolvedTextParams))
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue(resolveInitialValues(content))
    message.info(t('messages.resetDone', resolvedTextParams))
  }

  const resolvedPreviewPath = typeof previewPath === 'function' ? previewPath(context) : previewPath
  const shouldShowPreview = resolveValue(showPreview, Boolean(resolvedPreviewPath))
  const renderedFields = renderFields({
    root: ['content'],
    t,
    form,
    context,
    Section,
    TextField,
    fieldName,
    requiredRule
  })
  const renderedTranslationFields = renderFields({
    root: ['translations', 'en'],
    t,
    form,
    context,
    Section,
    TextField,
    fieldName,
    requiredRule
  })

  return (
    <div className={`${classPrefix}-page`}>
      <SEO title={t(seoTitleKey, resolvedTextParams)} noIndex />

      <div className={`${classPrefix}-card`}>
        <div className={`${classPrefix}-header`}>
          <div>
            <Title level={2}>{t(pageTitleKey, resolvedTextParams)}</Title>
            <Text>{t(pageDescriptionKey, resolvedTextParams)}</Text>
          </div>

          <Space wrap>
            {shouldShowPreview ? (
              <Button icon={<EyeOutlined />} onClick={() => window.open(resolvedPreviewPath, '_blank', 'noopener,noreferrer')}>
                {t('actions.preview')}
              </Button>
            ) : null}
            <Button icon={<ReloadOutlined />} onClick={fetchContent} disabled={loading || saving}>
              {t('actions.reload')}
            </Button>
            {showReset ? (
              <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={loading || saving}>
                {t('actions.reset')}
              </Button>
            ) : null}
            {actions ? actions({ loading, saving, fetchContent, handleReset, form, context, t }) : null}
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
              {t('actions.save')}
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} className={formClassName || `${classPrefix}-form`}>
            <Tabs
              destroyInactiveTabPane={false}
              items={[
                {
                  key: 'vi',
                  label: t('tabs.vi'),
                  children: renderedFields
                },
                {
                  key: 'en',
                  label: t('tabs.en'),
                  children: renderedTranslationFields
                }
              ]}
            />
          </Form>
        </Spin>
      </div>
    </div>
  )
}

export default AdminLocalizedContentPage
