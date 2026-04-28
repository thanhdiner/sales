import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row, Space, Spin, Tabs, Typography, message } from 'antd'
import { EyeOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/SEO'
import {
  getAdminComingSoonContent,
  updateAdminComingSoonContent
} from '@/services/comingSoonContentService'
import clientComingSoonEn from '@/i18n/locales/en/client/comingSoon.json'
import clientComingSoonVi from '@/i18n/locales/vi/client/comingSoon.json'
import './AdminComingSoonPage.scss'

const { Title, Text } = Typography
const { TextArea } = Input

const PAGE_CONFIG = {
  community: {
    contentKey: 'community',
    routeKey: 'community',
    previewPath: '/community',
    labelKey: 'community'
  },
  'quick-support': {
    contentKey: 'quickSupport',
    routeKey: 'quick-support',
    previewPath: '/quick-support',
    labelKey: 'quickSupport'
  },
  license: {
    contentKey: 'license',
    routeKey: 'license',
    previewPath: '/license',
    labelKey: 'license'
  }
}

const clone = value => JSON.parse(JSON.stringify(value || {}))

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeDefaults(defaultValue, value) {
  if (isPlainObject(defaultValue)) {
    const source = isPlainObject(value) ? value : {}
    const keys = new Set([...Object.keys(defaultValue), ...Object.keys(source)])

    return Array.from(keys).reduce((result, key) => {
      result[key] = Object.prototype.hasOwnProperty.call(source, key)
        ? mergeDefaults(defaultValue[key], source[key])
        : clone(defaultValue[key])
      return result
    }, {})
  }

  if (typeof defaultValue === 'string') {
    if (typeof value !== 'string') return defaultValue
    return value.trim() === '[object Object]' ? defaultValue : value
  }

  return value ?? defaultValue ?? ''
}

function getEditableBaseContent(data) {
  if (!data) return {}

  const {
    _id,
    __v,
    key,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    translations,
    ...content
  } = data

  return content
}

function getInitialValues(data, config) {
  return {
    content: mergeDefaults(clientComingSoonVi[config.contentKey] || {}, getEditableBaseContent(data)),
    translations: {
      en: mergeDefaults(clientComingSoonEn[config.contentKey] || {}, data?.translations?.en || {})
    }
  }
}

function AdminComingSoonPage() {
  const { t } = useTranslation('adminComingSoonPages')
  const location = useLocation()
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(null)

  const routeKey = location.pathname.replace(/^\/admin\/?/, '').split('/')[0]
  const config = useMemo(() => PAGE_CONFIG[routeKey] || PAGE_CONFIG.community, [routeKey])
  const pageName = t(`pages.${config.labelKey}`)

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getAdminComingSoonContent(config.routeKey)
      const data = response?.data || null

      setContent(data)
      form.setFieldsValue(getInitialValues(data, config))
    } catch {
      setContent(null)
      form.setFieldsValue(getInitialValues(null, config))
      message.error(t('messages.fetchError', { page: pageName }))
    } finally {
      setLoading(false)
    }
  }, [config, form, pageName, t])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true)

    setSaving(true)

    try {
      const response = await updateAdminComingSoonContent(config.routeKey, {
        ...(values.content || {}),
        translations: {
          en: values.translations?.en || {}
        }
      })
      const savedContent = response?.data || null

      setContent(savedContent)
      form.setFieldsValue(getInitialValues(savedContent, config))
      queryClient.invalidateQueries({ queryKey: ['comingSoonContent', config.routeKey] })
      message.success(t('messages.saveSuccess', { page: pageName }))
    } catch (error) {
      message.error(error.message || t('messages.saveError', { page: pageName }))
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue(getInitialValues(content, config))
    message.info(t('messages.resetDone'))
  }

  const TextField = ({ root, path, label, required = false, rows = 0, placeholder }) => (
    <Form.Item label={label} name={fieldName(root, ...path)} rules={required ? requiredRule : undefined}>
      {rows > 0 ? <TextArea rows={rows} placeholder={placeholder || label} /> : <Input placeholder={placeholder || label} />}
    </Form.Item>
  )

  const Section = ({ title, description, children }) => (
    <section className="admin-coming-soon-section">
      <div className="admin-coming-soon-section__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )

  const renderContentFields = root => (
    <>
      <Section title={t('sections.seo')}>
        <Row gutter={16}>
          <Col xs={24} md={10}>
            <TextField root={root} path={['seo', 'title']} label={t('fields.seoTitle')} required />
          </Col>
          <Col xs={24} md={14}>
            <TextField root={root} path={['seo', 'description']} label={t('fields.seoDescription')} rows={2} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.content')} description={t('sections.contentDescription')}>
        <Row gutter={16}>
          <Col xs={24}>
            <TextField root={root} path={['title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['description']} label={t('fields.description')} rows={3} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['descriptionSecondLine']} label={t('fields.descriptionSecondLine')} rows={3} />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['status']} label={t('fields.status')} required />
          </Col>
        </Row>
      </Section>
    </>
  )

  return (
    <div className="admin-coming-soon-page">
      <SEO title={t('seo.title', { page: pageName })} noIndex />

      <div className="admin-coming-soon-card">
        <div className="admin-coming-soon-header">
          <div>
            <Title level={2}>{t('page.title', { page: pageName })}</Title>
            <Text>{t('page.description', { page: pageName })}</Text>
          </div>

          <Space wrap>
            <Button icon={<EyeOutlined />} onClick={() => window.open(config.previewPath, '_blank', 'noopener,noreferrer')}>
              {t('actions.preview')}
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchContent} disabled={loading || saving}>
              {t('actions.reload')}
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={loading || saving}>
              {t('actions.reset')}
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
              {t('actions.save')}
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-coming-soon-form">
            <Tabs
              destroyInactiveTabPane={false}
              items={[
                {
                  key: 'vi',
                  label: t('tabs.vi'),
                  children: renderContentFields(['content'])
                },
                {
                  key: 'en',
                  label: t('tabs.en'),
                  children: renderContentFields(['translations', 'en'])
                }
              ]}
            />
          </Form>
        </Spin>
      </div>
    </div>
  )
}

export default AdminComingSoonPage
