import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Space, Spin, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import { getAdminFaqContent, updateAdminFaqContent } from '@/services/faqContentService'
import {
  DEFAULT_FAQ_CONTENT,
  DEFAULT_FAQ_TRANSLATIONS,
  alignFaqTranslation,
  normalizeFaqContent
} from '@/pages/FAQPage/faqContent'
import './AdminFaqPage.scss'

const { Title, Text } = Typography
const { TextArea } = Input

const clone = value => JSON.parse(JSON.stringify(value || {}))

function AdminFaqPage() {
  const { t } = useTranslation('adminFaq')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getAdminFaqContent()
      const data = response?.data || {}
      const content = normalizeFaqContent(data.content, { language: 'vi', phone: '{{phone}}' })
      const englishTranslation = alignFaqTranslation(content, data.translations?.en || {})

      form.setFieldsValue({
        content,
        translations: {
          en: englishTranslation
        }
      })
    } catch {
      form.setFieldsValue({
        content: clone(DEFAULT_FAQ_CONTENT),
        translations: clone(DEFAULT_FAQ_TRANSLATIONS)
      })
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
    const englishTranslation = alignFaqTranslation(content, values.translations?.en || {})

    setSaving(true)

    try {
      const response = await updateAdminFaqContent({
        content,
        translations: {
          en: englishTranslation
        }
      })
      const data = response?.data || {}
      const savedContent = normalizeFaqContent(data.content || content, { language: 'vi', phone: '{{phone}}' })

      form.setFieldsValue({
        content: savedContent,
        translations: {
          en: alignFaqTranslation(savedContent, data.translations?.en || englishTranslation)
        }
      })
      message.success(t('messages.saveSuccess'))
    } catch (error) {
      message.error(error.message || t('messages.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const TextField = ({ root, path, label, required = false, rows = 0, placeholder }) => (
    <Form.Item label={label} name={fieldName(root, ...path)} rules={required ? requiredRule : undefined}>
      {rows > 0 ? <TextArea rows={rows} placeholder={placeholder || label} /> : <Input placeholder={placeholder || label} />}
    </Form.Item>
  )

  const Section = ({ title, description, children }) => (
    <section className="admin-faq-section">
      <div className="admin-faq-section__header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-faq-list">
      <div className="admin-faq-list__header">
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

  const renderFaqItems = root => (
    <Form.List name={fieldName(root, 'items')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.items')} addText={t('actions.addItem')} onAdd={() => add({ id: '', question: '', answer: '' })}>
          {fields.map(field => (
            <div className="admin-faq-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.id')} name={[field.name, 'id']}>
                    <Input placeholder="order-placement" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={16}>
                  <Form.Item label={t('fields.question')} name={[field.name, 'question']}>
                    <Input placeholder={t('fields.question')} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label={t('fields.answer')} name={[field.name, 'answer']}>
                    <TextArea rows={3} placeholder={t('fields.answer')} />
                  </Form.Item>
                </Col>
              </Row>
              <RemoveButton onClick={() => remove(field.name)} />
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
            <TextField root={root} path={['page', 'eyebrow']} label={t('fields.eyebrow')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['page', 'title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['page', 'description']} label={t('fields.description')} rows={2} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.items')} description={t('sections.itemsDescription')}>
        {renderFaqItems(root)}
      </Section>

      <Section title={t('sections.support')}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <TextField root={root} path={['support', 'text']} label={t('fields.supportText')} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['support', 'link']} label={t('fields.supportLink')} />
          </Col>
        </Row>
      </Section>
    </>
  )

  return (
    <div className="admin-faq-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-faq-card">
        <div className="admin-faq-header">
          <div>
            <Title level={2}>{t('page.title')}</Title>
            <Text>{t('page.description')}</Text>
          </div>

          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={fetchContent} disabled={loading || saving}>
              {t('actions.reload')}
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
              {t('actions.save')}
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-faq-form">
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

export default AdminFaqPage
