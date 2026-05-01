import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row, Space, Spin, Switch, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/shared/SEO'
import { getAdminVipContent, updateAdminVipContent } from '@/services/admin/content/vip'
import clientVipEn from '@/i18n/locales/en/client/vip.json'
import clientVipVi from '@/i18n/locales/vi/client/vip.json'
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

  if (typeof defaultValue === 'string') {
    return typeof value === 'string' ? value : defaultValue
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
    content: mergeDefaults(clientVipVi, getEditableBaseContent(data)),
    translations: {
      en: mergeDefaults(clientVipEn, data?.translations?.en || {})
    }
  }
}

function Vip() {
  const { t } = useTranslation('adminVip')
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
      const response = await getAdminVipContent()
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
    const baseContent = values.content || {}

    setSaving(true)

    try {
      const response = await updateAdminVipContent({
        ...baseContent,
        translations: {
          en: values.translations?.en || {}
        }
      })
      const savedContent = response?.data || null

      setContent(savedContent)
      form.setFieldsValue(getInitialValues(savedContent))
      queryClient.invalidateQueries({ queryKey: ['vipContent'] })
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
    <section className="admin-vip-section">
      <div className="admin-vip-section__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-vip-list">
      <div className="admin-vip-list__header">
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
            <div className="admin-vip-list-item admin-vip-list-item--inline" key={field.key}>
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

  const renderBenefits = (root, path = 'benefits', title = t('sections.benefitItems'), addText = t('actions.addBenefit')) => (
    <Form.List name={fieldName(root, path)}>
      {(fields, { add, remove }) => (
        <ListShell title={title} addText={addText} onAdd={() => add({ title: '', description: '' })}>
          {fields.map(field => (
            <div className="admin-vip-list-item" key={field.key}>
              <Form.Item label={t('fields.itemTitle')} name={[field.name, 'title']}>
                <Input placeholder={t('fields.itemTitle')} />
              </Form.Item>
              <Form.Item label={t('fields.itemDescription')} name={[field.name, 'description']}>
                <TextArea rows={2} placeholder={t('fields.itemDescription')} />
              </Form.Item>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderComparisonRows = root => (
    <Form.List name={fieldName(root, 'comparisonRows')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.comparisonRows')}
          addText={t('actions.addComparisonRow')}
          onAdd={() => add({ benefit: '', silver: '', gold: '', diamond: '' })}
        >
          {fields.map((field, index) => (
            <div className="admin-vip-list-item" key={field.key}>
              <div className="admin-vip-list-item__title">
                <span>{t('sections.comparisonRow', { index: index + 1 })}</span>
                <RemoveButton onClick={() => remove(field.name)} />
              </div>

              <Row gutter={16}>
                <Col xs={24} md={9}>
                  <Form.Item label={t('fields.comparisonBenefit')} name={[field.name, 'benefit']}>
                    <Input placeholder={t('fields.comparisonBenefit')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item label={t('fields.silver')} name={[field.name, 'silver']}>
                    <Input placeholder="5%" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item label={t('fields.gold')} name={[field.name, 'gold']}>
                    <Input placeholder="10%" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item label={t('fields.diamond')} name={[field.name, 'diamond']}>
                    <Input placeholder="15%" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderPlans = root => (
    <Form.List name={fieldName(root, 'plans')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.planItems')}
          addText={t('actions.addPlan')}
          onAdd={() => add({ name: '', badge: '', price: '', period: '', description: '', features: [], ctaLabel: '', ctaLink: '', highlighted: false })}
        >
          {fields.map((field, index) => (
            <div className="admin-vip-list-item" key={field.key}>
              <div className="admin-vip-list-item__title">
                <span>{t('sections.planItem', { index: index + 1 })}</span>
                <RemoveButton onClick={() => remove(field.name)} />
              </div>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.planName')} name={[field.name, 'name']}>
                    <Input placeholder={t('fields.planName')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.badge')} name={[field.name, 'badge']}>
                    <Input placeholder={t('fields.badge')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.highlighted')} name={[field.name, 'highlighted']} valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.price')} name={[field.name, 'price']}>
                    <Input placeholder="199.000đ" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.period')} name={[field.name, 'period']}>
                    <Input placeholder="/ tháng" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.ctaLabel')} name={[field.name, 'ctaLabel']}>
                    <Input placeholder={t('fields.ctaLabel')} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label={t('fields.ctaLink')} name={[field.name, 'ctaLink']}>
                    <Input placeholder="/contact" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label={t('fields.description')} name={[field.name, 'description']}>
                    <TextArea rows={2} placeholder={t('fields.description')} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  {renderStringList({
                    name: [field.name, 'features'],
                    title: t('sections.planFeatures'),
                    addText: t('actions.addFeature'),
                    label: t('fields.feature')
                  })}
                </Col>
              </Row>
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderFaqs = root => (
    <Form.List name={fieldName(root, 'faqs')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.faqItems')} addText={t('actions.addFaq')} onAdd={() => add({ question: '', answer: '' })}>
          {fields.map(field => (
            <div className="admin-vip-list-item" key={field.key}>
              <Form.Item label={t('fields.question')} name={[field.name, 'question']}>
                <Input placeholder={t('fields.question')} />
              </Form.Item>
              <Form.Item label={t('fields.answer')} name={[field.name, 'answer']}>
                <TextArea rows={3} placeholder={t('fields.answer')} />
              </Form.Item>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderSectionFields = (root, path) => (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <TextField root={root} path={[...path, 'eyebrow']} label={t('fields.eyebrow')} />
      </Col>
      <Col xs={24} md={16}>
        <TextField root={root} path={[...path, 'title']} label={t('fields.sectionTitle')} />
      </Col>
      <Col xs={24}>
        <TextField root={root} path={[...path, 'description']} label={t('fields.sectionDescription')} rows={2} />
      </Col>
    </Row>
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

      <Section title={t('sections.hero')} description={t('sections.heroDescription')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['hero', 'eyebrow']} label={t('fields.eyebrow')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['hero', 'title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['hero', 'description']} label={t('fields.description')} rows={3} required />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['hero', 'status']} label={t('fields.status')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['hero', 'primaryButton']} label={t('fields.primaryButton')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['hero', 'primaryButtonLink']} label={t('fields.primaryButtonLink')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['hero', 'secondaryButton']} label={t('fields.secondaryButton')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['hero', 'secondaryButtonLink']} label={t('fields.secondaryButtonLink')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['hero', 'imageUrl']} label={t('fields.imageUrl')} />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['hero', 'imageAlt']} label={t('fields.imageAlt')} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.quickBenefits')}>
        {renderBenefits(root, 'quickBenefits', t('sections.quickBenefitItems'), t('actions.addQuickBenefit'))}
      </Section>

      <Section title={t('sections.benefits')}>
        {renderSectionFields(root, ['benefitsSection'])}
        {renderBenefits(root)}
      </Section>

      <Section title={t('sections.plans')}>
        {renderSectionFields(root, ['plansSection'])}
        {renderPlans(root)}
      </Section>

      <Section title={t('sections.comparison')}>
        {renderSectionFields(root, ['comparisonSection'])}
        {renderComparisonRows(root)}
      </Section>

      <Section title={t('sections.faq')}>
        {renderSectionFields(root, ['faqSection'])}
        {renderFaqs(root)}
      </Section>

      <Section title={t('sections.cta')}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <TextField root={root} path={['cta', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['cta', 'button']} label={t('fields.button')} />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['cta', 'buttonLink']} label={t('fields.buttonLink')} />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['cta', 'description']} label={t('fields.description')} rows={2} />
          </Col>
        </Row>
      </Section>
    </>
  )

  return (
    <div className="admin-vip-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-vip-card">
        <div className="admin-vip-header">
          <div>
            <Title level={2}>{t('page.title')}</Title>
            <Text>{t('page.description')}</Text>
          </div>

          <Space wrap>
            <Button icon={<EyeOutlined />} onClick={() => window.open('/vip', '_blank', 'noopener,noreferrer')}>
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-vip-form">
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

export default Vip