import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row, Space, Spin, Tabs, Typography, message } from 'antd'
import { EyeOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/SEO'
import {
  getAdminGameAccountContent,
  updateAdminGameAccountContent
} from '@/services/gameAccountContentService'
import clientComingSoonEn from '@/i18n/locales/en/client/comingSoon.json'
import clientComingSoonVi from '@/i18n/locales/vi/client/comingSoon.json'
import './AdminGameAccountPage.scss'

const { Title, Text } = Typography
const { TextArea } = Input

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

function getDefaultContent(locale) {
  return locale.gameAccount || {}
}

function getEditableBaseContent(data) {
  if (!data) return {}

  const {
    _id,
    __v,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    translations,
    ...content
  } = data

  return content
}

function getInitialValues(data) {
  return {
    content: mergeDefaults(getDefaultContent(clientComingSoonVi), getEditableBaseContent(data)),
    translations: {
      en: mergeDefaults(getDefaultContent(clientComingSoonEn), data?.translations?.en || {})
    }
  }
}

function AdminGameAccountPage() {
  const { t } = useTranslation('adminGameAccount')
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(null)

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getAdminGameAccountContent()
      const data = response?.data || null

      setContent(data)
      form.setFieldsValue(getInitialValues(data))
    } catch {
      setContent(null)
      form.setFieldsValue(getInitialValues(null))
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [form, t])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true)

    setSaving(true)

    try {
      const response = await updateAdminGameAccountContent({
        ...(values.content || {}),
        translations: {
          en: values.translations?.en || {}
        }
      })
      const savedContent = response?.data || null

      setContent(savedContent)
      form.setFieldsValue(getInitialValues(savedContent))
      queryClient.invalidateQueries({ queryKey: ['gameAccountContent'] })
      message.success(t('messages.saveSuccess'))
    } catch (error) {
      message.error(error.message || t('messages.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue(getInitialValues(content))
    message.info(t('messages.resetDone'))
  }

  const TextField = ({ root, path, label, required = false, rows = 0, placeholder }) => (
    <Form.Item label={label} name={fieldName(root, ...path)} rules={required ? requiredRule : undefined}>
      {rows > 0 ? <TextArea rows={rows} placeholder={placeholder || label} /> : <Input placeholder={placeholder || label} />}
    </Form.Item>
  )

  const Section = ({ title, description, children }) => (
    <section className="admin-game-account-section">
      <div className="admin-game-account-section__header">
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
          <Col xs={24} md={8}>
            <TextField root={root} path={['eyebrow']} label={t('fields.eyebrow')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['description']} label={t('fields.description')} rows={4} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['note']} label={t('fields.note')} rows={3} />
          </Col>
        </Row>
      </Section>
    </>
  )

  return (
    <div className="admin-game-account-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-game-account-card">
        <div className="admin-game-account-header">
          <div>
            <Title level={2}>{t('page.title')}</Title>
            <Text>{t('page.description')}</Text>
          </div>

          <Space wrap>
            <Button icon={<EyeOutlined />} onClick={() => window.open('/game-account', '_blank', 'noopener,noreferrer')}>
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-game-account-form">
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

export default AdminGameAccountPage
