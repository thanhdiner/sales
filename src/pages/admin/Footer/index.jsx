import { useCallback, useEffect, useState } from 'react'
import { Button, Checkbox, Col, Form, Input, Row, Space, Spin, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import { getFooterContent, updateFooterContent } from '@/services/admin/content/footer'
import {
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_FOOTER_TRANSLATIONS,
  alignFooterTranslation,
  normalizeFooterContent
} from '@/layouts/client/components/Footer/footerContent'
import './index.scss'

const { Title, Text } = Typography
const { TextArea } = Input

const clone = value => JSON.parse(JSON.stringify(value || {}))

function Footer() {
  const { t } = useTranslation('adminFooter')
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getFooterContent()
      const data = response?.data || {}
      const content = normalizeFooterContent(data.content, { language: 'vi', includeDisabled: true })
      const englishTranslation = alignFooterTranslation(content, data.translations?.en || {})

      form.setFieldsValue({
        content,
        translations: {
          en: englishTranslation
        }
      })
    } catch {
      form.setFieldsValue({
        content: clone(DEFAULT_FOOTER_CONTENT),
        translations: clone(DEFAULT_FOOTER_TRANSLATIONS)
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
    const englishTranslation = alignFooterTranslation(content, values.translations?.en || {})

    setSaving(true)

    try {
      const response = await updateFooterContent({
        content,
        translations: {
          en: englishTranslation
        }
      })
      const data = response?.data || {}
      const savedContent = normalizeFooterContent(data.content || content, { language: 'vi', includeDisabled: true })

      form.setFieldsValue({
        content: savedContent,
        translations: {
          en: alignFooterTranslation(savedContent, data.translations?.en || englishTranslation)
        }
      })
      queryClient.invalidateQueries({ queryKey: ['footer-content'] })
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
    <section className="admin-footer-section">
      <div className="admin-footer-section__header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-footer-list">
      <div className="admin-footer-list__header">
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

  const renderLinks = (root, path, title, addText) => (
    <Form.List name={fieldName(root, ...path)}>
      {(fields, { add, remove }) => (
        <ListShell title={title} addText={addText} onAdd={() => add({ label: '', url: '', external: false })}>
          {fields.map(field => (
            <div className="admin-footer-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={10}>
                  <Form.Item label={t('fields.label')} name={[field.name, 'label']}>
                    <Input placeholder={t('fields.label')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item label={t('fields.url')} name={[field.name, 'url']}>
                    <Input placeholder="/contact" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item className="admin-footer-checkbox" name={[field.name, 'external']} valuePropName="checked">
                    <Checkbox>{t('fields.external')}</Checkbox>
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

  const renderPaymentMethods = root => (
    <Form.List name={fieldName(root, 'payment', 'methods')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.paymentMethods')}
          addText={t('actions.addPayment')}
          onAdd={() => add({ label: '', icon: '', enabled: true })}
        >
          {fields.map(field => (
            <div className="admin-footer-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={9}>
                  <Form.Item label={t('fields.label')} name={[field.name, 'label']}>
                    <Input placeholder="Visa" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={11}>
                  <Form.Item label={t('fields.icon')} name={[field.name, 'icon']}>
                    <Input placeholder="/icons/paymentVisa.svg" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item className="admin-footer-checkbox" name={[field.name, 'enabled']} valuePropName="checked">
                    <Checkbox>{t('fields.enabled')}</Checkbox>
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

  const renderSocialLinks = root => (
    <Form.List name={fieldName(root, 'social', 'links')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.socialLinks')}
          addText={t('actions.addSocial')}
          onAdd={() => add({ label: '', url: '', icon: '', external: true })}
        >
          {fields.map(field => (
            <div className="admin-footer-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.label')} name={[field.name, 'label']}>
                    <Input placeholder="Facebook" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.url')} name={[field.name, 'url']}>
                    <Input placeholder="https://..." />
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item label={t('fields.icon')} name={[field.name, 'icon']}>
                    <Input placeholder="/icons/iconFb.svg" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={3}>
                  <Form.Item className="admin-footer-checkbox" name={[field.name, 'external']} valuePropName="checked">
                    <Checkbox>{t('fields.external')}</Checkbox>
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
      <Section title={t('sections.general')}>
        <TextField root={root} path={['easterEgg']} label={t('fields.easterEgg')} />
      </Section>

      <Section title={t('sections.customerSupport')} description={t('sections.customerSupportDescription')}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <TextField root={root} path={['customerSupport', 'title']} label={t('fields.sectionTitle')} required />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['customerSupport', 'hotlineLabel']} label={t('fields.hotlineLabel')} />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['customerSupport', 'phone']} label={t('fields.phone')} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['customerSupport', 'workingTime']} label={t('fields.workingTime')} />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['customerSupport', 'supportEmailLabel']} label={t('fields.supportEmailLabel')} />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['customerSupport', 'email']} label={t('fields.email')} />
          </Col>
        </Row>
        {renderLinks(root, ['customerSupport', 'links'], t('sections.customerLinks'), t('actions.addLink'))}
      </Section>

      <Section title={t('sections.about')}>
        <TextField root={root} path={['about', 'title']} label={t('fields.sectionTitle')} required />
        {renderLinks(root, ['about', 'links'], t('sections.aboutLinks'), t('actions.addLink'))}
      </Section>

      <Section title={t('sections.services')}>
        <TextField root={root} path={['services', 'title']} label={t('fields.sectionTitle')} required />
        {renderLinks(root, ['services', 'links'], t('sections.serviceLinks'), t('actions.addService'))}
      </Section>

      <Section title={t('sections.payment')}>
        <TextField root={root} path={['payment', 'title']} label={t('fields.sectionTitle')} required />
        {renderPaymentMethods(root)}
      </Section>

      <Section title={t('sections.social')}>
        <TextField root={root} path={['social', 'title']} label={t('fields.sectionTitle')} required />
        {renderSocialLinks(root)}
      </Section>
    </>
  )

  return (
    <div className="admin-footer-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-footer-card">
        <div className="admin-footer-header">
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-footer-form">
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

export default Footer
