import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row, Space, Spin, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/shared/SEO'
import {
  getAdminTermsContent,
  updateAdminTermsContent
} from '@/services/admin/content/terms'
import clientTermsEn from '@/i18n/locales/en/client/terms.json'
import clientTermsVi from '@/i18n/locales/vi/client/terms.json'
import './index.scss'

const { Title, Text } = Typography
const { TextArea } = Input

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

  return value ?? defaultValue ?? ''
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
    content: mergeDefaults(clientTermsVi, getEditableBaseContent(data)),
    translations: {
      en: mergeDefaults(clientTermsEn, data?.translations?.en || {})
    }
  }
}

function Terms() {
  const { t } = useTranslation('adminTerms')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [termsContent, setTermsContent] = useState(null)
  const queryClient = useQueryClient()

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getAdminTermsContent()
      const data = response?.data || null

      setTermsContent(data)
      form.setFieldsValue(getInitialValues(data))
    } catch {
      setTermsContent(null)
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
    const content = values.content || {}

    setSaving(true)

    try {
      const response = await updateAdminTermsContent({
        ...content,
        translations: {
          en: values.translations?.en || {}
        }
      })
      const savedContent = response?.data || null

      setTermsContent(savedContent)
      form.setFieldsValue(getInitialValues(savedContent))
      queryClient.invalidateQueries({ queryKey: ['termsContent'] })
      message.success(t('messages.saveSuccess'))
    } catch (error) {
      message.error(error.message || t('messages.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue(getInitialValues(termsContent))
    message.info(t('messages.resetDone'))
  }

  const TextField = ({ root, path, label, required = false, rows = 0, placeholder }) => (
    <Form.Item label={label} name={fieldName(root, ...path)} rules={required ? requiredRule : undefined}>
      {rows > 0 ? <TextArea rows={rows} placeholder={placeholder || label} /> : <Input placeholder={placeholder || label} />}
    </Form.Item>
  )

  const Section = ({ title, description, children }) => (
    <section className="admin-terms-section">
      <div className="admin-terms-section__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-terms-list">
      <div className="admin-terms-list__header">
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

  const renderStringList = ({ name, title, addText, label }) => (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <ListShell title={title} addText={addText} onAdd={() => add('')}>
          {fields.map(field => (
            <div className="admin-terms-list-item admin-terms-list-item--inline" key={field.key}>
              <Form.Item {...field} label={label} name={field.name}>
                <Input placeholder={label} />
              </Form.Item>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderTermsSections = root => (
    <Form.List name={fieldName(root, 'sections')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.termsSections')}
          addText={t('actions.addSection')}
          onAdd={() => add({ id: '', title: '', paragraphs: [], items: [], footer: '' })}
        >
          {fields.map((field, index) => (
            <div className="admin-terms-list-item" key={field.key}>
              <div className="admin-terms-list-item__title">
                <span>{t('sections.sectionItem', { index: index + 1 })}</span>
                <RemoveButton onClick={() => remove(field.name)} />
              </div>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.sectionId')} name={[field.name, 'id']}>
                    <Input placeholder="introduction" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={16}>
                  <Form.Item label={t('fields.sectionTitle')} name={[field.name, 'title']}>
                    <Input placeholder={t('fields.sectionTitle')} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  {renderStringList({
                    name: [field.name, 'paragraphs'],
                    title: t('sections.paragraphs'),
                    addText: t('actions.addParagraph'),
                    label: t('fields.paragraph')
                  })}
                </Col>
                <Col xs={24}>
                  {renderStringList({
                    name: [field.name, 'items'],
                    title: t('sections.items'),
                    addText: t('actions.addItem'),
                    label: t('fields.item')
                  })}
                </Col>
                <Col xs={24}>
                  <Form.Item label={t('fields.footer')} name={[field.name, 'footer']}>
                    <TextArea rows={2} placeholder={t('fields.footer')} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderContentFields = root => (
    <>
      <Section title={t('sections.seo')}>
        <Row gutter={16}>
          <Col xs={24} md={10}>
            <TextField root={root} path={['seo', 'title']} label={t('fields.seoTitle')} required />
          </Col>
          <Col xs={24} md={14}>
            <TextField root={root} path={['seo', 'description']} label={t('fields.seoDescription')} rows={2} required />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.header')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['header', 'eyebrow']} label={t('fields.eyebrow')} />
          </Col>
          <Col xs={24} md={10}>
            <TextField root={root} path={['header', 'title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['header', 'updatedAt']} label={t('fields.updatedAt')} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.notice')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['notice', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['notice', 'description']} label={t('fields.description')} rows={3} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.termsSections')} description={t('sections.termsSectionsDescription')}>
        {renderTermsSections(root)}
      </Section>
    </>
  )

  return (
    <div className="admin-terms-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-terms-card">
        <div className="admin-terms-header">
          <div>
            <Title level={2}>{t('page.title')}</Title>
            <Text>{t('page.description')}</Text>
          </div>

          <Space wrap>
            <Button icon={<EyeOutlined />} onClick={() => window.open('/terms-of-service', '_blank', 'noopener,noreferrer')}>
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-terms-form">
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

export default Terms