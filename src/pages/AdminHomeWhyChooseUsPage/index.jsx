import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row, Space, Spin, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/SEO'
import {
  getAdminHomeWhyChooseUsContent,
  updateAdminHomeWhyChooseUsContent
} from '@/services/homeWhyChooseUsContentService'
import clientHomeEn from '@/i18n/locales/en/client/home.json'
import clientHomeVi from '@/i18n/locales/vi/client/home.json'
import './AdminHomeWhyChooseUsPage.scss'

const { Title, Text } = Typography
const { TextArea } = Input

const ITEM_KEYS = [
  'fastActivation',
  'fastDelivery',
  'flexiblePayment',
  'clearWarranty',
  'regularOffers',
  'dedicatedSupport'
]

const clone = value => JSON.parse(JSON.stringify(value || {}))

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeDefaults(defaultValue, value) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value) ? value : clone(defaultValue)
  }

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

function getDefaultContent(homeLocale) {
  return homeLocale.whyChooseUsSection || {}
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
    content: mergeDefaults(getDefaultContent(clientHomeVi), getEditableBaseContent(data)),
    translations: {
      en: mergeDefaults(getDefaultContent(clientHomeEn), data?.translations?.en || {})
    }
  }
}

function AdminHomeWhyChooseUsPage() {
  const { t } = useTranslation('adminHomeWhyChooseUs')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(null)
  const queryClient = useQueryClient()

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getAdminHomeWhyChooseUsContent()
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
    const payload = values.content || {}

    setSaving(true)

    try {
      const response = await updateAdminHomeWhyChooseUsContent({
        ...payload,
        translations: {
          en: values.translations?.en || {}
        }
      })
      const savedContent = response?.data || null

      setContent(savedContent)
      form.setFieldsValue(getInitialValues(savedContent))
      queryClient.invalidateQueries({ queryKey: ['homeWhyChooseUsContent'] })
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
    <section className="admin-home-wcu-section">
      <div className="admin-home-wcu-section__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-home-wcu-list">
      <div className="admin-home-wcu-list__header">
        <h4>{title}</h4>
        <Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
          {addText}
        </Button>
      </div>
      {children}
    </div>
  )

  const RemoveButton = ({ onClick }) => (
    <Button danger type="text" icon={<DeleteOutlined />} onClick={onClick}>
      {t('actions.remove')}
    </Button>
  )

  const renderPhrases = root => (
    <Form.List name={fieldName(root, 'descPhrases')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.descPhrases')} addText={t('actions.addPhrase')} onAdd={() => add('')}>
          {fields.map((field, index) => (
            <div className="admin-home-wcu-list-item admin-home-wcu-list-item--inline" key={field.key}>
              <Form.Item {...field} label={t('fields.phrase', { index: index + 1 })} name={field.name}>
                <TextArea rows={2} placeholder={t('fields.phrasePlaceholder')} />
              </Form.Item>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderItems = root => (
    <div className="admin-home-wcu-items">
      {ITEM_KEYS.map(key => (
        <div className="admin-home-wcu-list-item" key={key}>
          <div className="admin-home-wcu-list-item__title">{t(`itemLabels.${key}`)}</div>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['items', key, 'title']} label={t('fields.cardTitle')} required />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['items', key, 'desc']} label={t('fields.cardDescription')} rows={2} required />
            </Col>
          </Row>
        </div>
      ))}
    </div>
  )

  const renderContentFields = root => (
    <>
      <Section title={t('sections.header')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['eyebrow']} label={t('fields.eyebrow')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['cta']} label={t('fields.cta')} required />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.descPhrases')} description={t('sections.descPhrasesDescription')}>
        {renderPhrases(root)}
      </Section>

      <Section title={t('sections.cards')} description={t('sections.cardsDescription')}>
        {renderItems(root)}
      </Section>
    </>
  )

  return (
    <div className="admin-home-wcu-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-home-wcu-card">
        <div className="admin-home-wcu-header">
          <div>
            <Title level={2}>{t('page.title')}</Title>
            <Text>{t('page.description')}</Text>
          </div>

          <Space wrap>
            <Button icon={<EyeOutlined />} onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}>
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-home-wcu-form">
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

export default AdminHomeWhyChooseUsPage
