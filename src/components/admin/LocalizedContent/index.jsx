import { useCallback, useMemo } from 'react'
import { Button, Form, Space, Spin, Tabs, Typography } from 'antd'
import { EyeOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/shared/SEO'
import { useLocalizedContentFields } from './Fields'
import { defaultGetResponseData, useLocalizedContentForm } from './useForm'

export {
  buildLocalizedInitialValues,
  cloneContent,
  getEditableBaseContent,
  isPlainObject,
  mergeDefaults
} from './utils'

const { Title, Text } = Typography

function resolveValue(value, fallback) {
  return value === undefined ? fallback : value
}

function AdminLocalizedContent({
  namespace,
  classPrefix,
  api,
  formConfig,
  pageConfig,
  previewConfig,
  actionsConfig,
  context
}) {
  const {
    getContent,
    getResponseData = defaultGetResponseData,
    queryKey,
    updateContent
  } = api
  const {
    buildPayload,
    formClassName,
    getInitialValues,
    renderFields
  } = formConfig
  const {
    pageDescriptionKey = 'page.description',
    pageTitleKey = 'page.title',
    seoTitleKey = 'seo.title',
    textParams
  } = pageConfig || {}
  const {
    previewPath,
    showPreview,
    showReset = true
  } = previewConfig || {}
  const {
    actions,
    onSaved
  } = actionsConfig || {}

  const { t } = useTranslation(namespace)
  const [form] = Form.useForm()

  const resolvedTextParams = useMemo(() => (
    typeof textParams === 'function' ? textParams(t, context) : textParams
  ), [context, t, textParams])

  const fieldName = useCallback((root, ...path) => [...root, ...path], [])
  const requiredRule = useMemo(() => [{ required: true, message: t('validation.required') }], [t])
  const { Section, TextField } = useLocalizedContentFields({ classPrefix, fieldName, requiredRule })
  const { fetchContent, handleReset, handleSubmit, loading, saving } = useLocalizedContentForm({
    buildPayload,
    context,
    form,
    getContent,
    getInitialValues,
    getResponseData,
    onSaved,
    queryKey,
    resolvedTextParams,
    t,
    updateContent
  })

  const resolvedPreviewPath = typeof previewPath === 'function' ? previewPath(context) : previewPath
  const shouldShowPreview = resolveValue(showPreview, Boolean(resolvedPreviewPath))
  const fieldRenderProps = {
    t,
    form,
    context,
    Section,
    TextField,
    fieldName,
    requiredRule
  }
  const renderedFields = renderFields({
    root: ['content'],
    ...fieldRenderProps
  })
  const renderedTranslationFields = renderFields({
    root: ['translations', 'en'],
    ...fieldRenderProps
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

export default AdminLocalizedContent
