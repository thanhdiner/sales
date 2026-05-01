import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Space, Spin, Switch, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import { getReturnPolicyContent, updateReturnPolicyContent } from '@/services/admin/content/returnPolicy'
import {
  DEFAULT_RETURN_POLICY_CONTENT,
  DEFAULT_RETURN_POLICY_TRANSLATIONS,
  alignReturnPolicyTranslation,
  normalizeReturnPolicyContent
} from '@/pages/client/ReturnPolicy/returnPolicyContent'
import './index.scss'

const { Title, Text } = Typography
const { TextArea } = Input

const clone = value => JSON.parse(JSON.stringify(value || {}))

function ReturnPolicy() {
  const { t } = useTranslation('adminReturnPolicy')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getReturnPolicyContent()
      const data = response?.data || {}
      const content = normalizeReturnPolicyContent(data.content, 'vi')
      const englishTranslation = alignReturnPolicyTranslation(content, data.translations?.en || {})

      form.setFieldsValue({
        content,
        translations: {
          en: englishTranslation
        }
      })
    } catch {
      form.setFieldsValue({
        content: clone(DEFAULT_RETURN_POLICY_CONTENT),
        translations: clone(DEFAULT_RETURN_POLICY_TRANSLATIONS)
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
    const englishTranslation = alignReturnPolicyTranslation(content, values.translations?.en || {})

    setSaving(true)

    try {
      const response = await updateReturnPolicyContent({
        content,
        translations: {
          en: englishTranslation
        }
      })
      const data = response?.data || {}
      const savedContent = normalizeReturnPolicyContent(data.content || content, 'vi')

      form.setFieldsValue({
        content: savedContent,
        translations: {
          en: alignReturnPolicyTranslation(savedContent, data.translations?.en || englishTranslation)
        }
      })
      message.success(t('messages.saveSuccess'))
    } catch (error) {
      message.error(error.message || t('messages.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const TextField = ({ root, path, label, required = false, rows = 0, placeholder, disabled = false }) => (
    <Form.Item label={label} name={fieldName(root, ...path)} rules={required ? requiredRule : undefined}>
      {rows > 0 ? (
        <TextArea rows={rows} placeholder={placeholder || label} disabled={disabled} />
      ) : (
        <Input placeholder={placeholder || label} disabled={disabled} />
      )}
    </Form.Item>
  )

  const Section = ({ title, description, children }) => (
    <section className="admin-return-policy-section">
      <div className="admin-return-policy-section__header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-return-policy-list">
      <div className="admin-return-policy-list__header">
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

  const renderStringList = ({ root, path, title, addText, label }) => (
    <Form.List name={fieldName(root, ...path)}>
      {(fields, { add, remove }) => (
        <ListShell title={title} addText={addText} onAdd={() => add('')}>
          {fields.map(field => (
            <div className="admin-return-policy-list-item admin-return-policy-list-item--inline" key={field.key}>
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

  const renderTextObjectList = ({ root, path, title, addText }) => (
    <Form.List name={fieldName(root, ...path)}>
      {(fields, { add, remove }) => (
        <ListShell title={title} addText={addText} onAdd={() => add({ title: '', description: '' })}>
          {fields.map(field => (
            <div className="admin-return-policy-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.title')} name={[field.name, 'title']}>
                    <Input placeholder={t('fields.title')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={16}>
                  <Form.Item label={t('fields.description')} name={[field.name, 'description']}>
                    <TextArea rows={2} placeholder={t('fields.description')} />
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

  const renderHeaderTags = root => (
    <Form.List name={fieldName(root, 'pageHeader', 'tags')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.headerTags')} addText={t('actions.addTag')} onAdd={() => add({ color: '', label: '' })}>
          {fields.map(field => (
            <div className="admin-return-policy-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.color')} name={[field.name, 'color']}>
                    <Input placeholder="green" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={16}>
                  <Form.Item label={t('fields.label')} name={[field.name, 'label']}>
                    <Input placeholder={t('fields.label')} />
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

  const renderRefundMethods = root => (
    <Form.List name={fieldName(root, 'refund', 'methods')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.refundMethods')}
          addText={t('actions.addRefundMethod')}
          onAdd={() => add({ key: '', method: '', time: '', fee: '', popular: false })}
        >
          {fields.map(field => (
            <div className="admin-return-policy-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={5}>
                  <Form.Item label={t('fields.key')} name={[field.name, 'key']}>
                    <Input placeholder="bankTransfer" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item label={t('fields.method')} name={[field.name, 'method']}>
                    <Input placeholder={t('fields.method')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item label={t('fields.time')} name={[field.name, 'time']}>
                    <Input placeholder={t('fields.time')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item label={t('fields.fee')} name={[field.name, 'fee']}>
                    <Input placeholder={t('fields.fee')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={2}>
                  <Form.Item label={t('fields.popular')} name={[field.name, 'popular']} valuePropName="checked">
                    <Switch />
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

  const renderCategories = root => (
    <Form.List name={fieldName(root, 'categories', 'items')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.categoryItems')}
          addText={t('actions.addCategory')}
          onAdd={() => add({ key: '', category: '', returnPeriod: '', conditions: [], specialNotes: '' })}
        >
          {fields.map(field => (
            <div className="admin-return-policy-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={5}>
                  <Form.Item label={t('fields.key')} name={[field.name, 'key']}>
                    <Input placeholder="electronics" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item label={t('fields.category')} name={[field.name, 'category']}>
                    <Input placeholder={t('fields.category')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.returnPeriod')} name={[field.name, 'returnPeriod']}>
                    <Input placeholder={t('fields.returnPeriod')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.specialNotes')} name={[field.name, 'specialNotes']}>
                    <Input placeholder={t('fields.specialNotes')} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.List name={[field.name, 'conditions']}>
                {(conditionFields, { add: addCondition, remove: removeCondition }) => (
                  <ListShell title={t('sections.categoryConditions')} addText={t('actions.addCondition')} onAdd={() => addCondition('')}>
                    {conditionFields.map(conditionField => (
                      <div className="admin-return-policy-list-item admin-return-policy-list-item--inline" key={conditionField.key}>
                        <Form.Item {...conditionField} label={t('fields.condition')} name={conditionField.name}>
                          <Input placeholder={t('fields.condition')} />
                        </Form.Item>
                        <RemoveButton onClick={() => removeCondition(conditionField.name)} />
                      </div>
                    ))}
                  </ListShell>
                )}
              </Form.List>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderReasons = root => (
    <Form.List name={fieldName(root, 'reasons', 'items')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.reasonItems')}
          addText={t('actions.addReason')}
          onAdd={() => add({ value: '', color: '', label: '' })}
        >
          {fields.map(field => (
            <div className="admin-return-policy-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.value')} name={[field.name, 'value']}>
                    <Input placeholder="defective" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.color')} name={[field.name, 'color']}>
                    <Input placeholder="red" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item label={t('fields.label')} name={[field.name, 'label']}>
                    <Input placeholder={t('fields.label')} />
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

  const renderFaq = root => (
    <Form.List name={fieldName(root, 'faqSection', 'items')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.faqItems')} addText={t('actions.addFaq')} onAdd={() => add({ question: '', answer: '' })}>
          {fields.map(field => (
            <div className="admin-return-policy-list-item" key={field.key}>
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
            <TextField root={root} path={['pageHeader', 'eyebrow']} label={t('fields.eyebrow')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['pageHeader', 'title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['pageHeader', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['pageHeader', 'actions', 'request']} label={t('fields.requestButton')} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['pageHeader', 'actions', 'tracking']} label={t('fields.trackingButton')} />
          </Col>
        </Row>
        {renderHeaderTags(root)}
      </Section>

      <Section title={t('sections.process')}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <TextField root={root} path={['process', 'physical', 'title']} label={t('fields.physicalProcessTitle')} />
            <TextField root={root} path={['process', 'physical', 'noteTitle']} label={t('fields.noteTitle')} />
            <TextField root={root} path={['process', 'physical', 'noteDescription']} label={t('fields.noteDescription')} rows={2} />
            {renderTextObjectList({
              root,
              path: ['process', 'physical', 'steps'],
              title: t('sections.physicalSteps'),
              addText: t('actions.addStep')
            })}
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['process', 'online', 'title']} label={t('fields.onlineProcessTitle')} />
            <TextField root={root} path={['process', 'online', 'noteTitle']} label={t('fields.noteTitle')} />
            {renderStringList({
              root,
              path: ['process', 'online', 'noteDescriptions'],
              title: t('sections.onlineNotes'),
              addText: t('actions.addNote'),
              label: t('fields.note')
            })}
            {renderTextObjectList({
              root,
              path: ['process', 'online', 'steps'],
              title: t('sections.onlineSteps'),
              addText: t('actions.addStep')
            })}
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.conditions')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['conditions', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['conditions', 'acceptedTitle']} label={t('fields.acceptedTitle')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['conditions', 'rejectedTitle']} label={t('fields.rejectedTitle')} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['conditions', 'physicalTitle']} label={t('fields.physicalTitle')} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['conditions', 'digitalTitle']} label={t('fields.digitalTitle')} />
          </Col>
          <Col xs={24} md={12}>
            {renderStringList({
              root,
              path: ['conditions', 'acceptedPhysicalItems'],
              title: t('sections.acceptedPhysical'),
              addText: t('actions.addItem'),
              label: t('fields.item')
            })}
            {renderStringList({
              root,
              path: ['conditions', 'acceptedDigitalItems'],
              title: t('sections.acceptedDigital'),
              addText: t('actions.addItem'),
              label: t('fields.item')
            })}
          </Col>
          <Col xs={24} md={12}>
            {renderStringList({
              root,
              path: ['conditions', 'rejectedPhysicalItems'],
              title: t('sections.rejectedPhysical'),
              addText: t('actions.addItem'),
              label: t('fields.item')
            })}
            {renderStringList({
              root,
              path: ['conditions', 'rejectedDigitalItems'],
              title: t('sections.rejectedDigital'),
              addText: t('actions.addItem'),
              label: t('fields.item')
            })}
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.refund')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['refund', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['refund', 'popular']} label={t('fields.popularLabel')} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['refund', 'timeLabel']} label={t('fields.timeLabel')} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['refund', 'feeLabel']} label={t('fields.feeLabel')} />
          </Col>
        </Row>
        {renderRefundMethods(root)}
      </Section>

      <Section title={t('sections.categories')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['categories', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['categories', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['categories', 'columns', 'category']} label={t('fields.categoryColumn')} />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['categories', 'columns', 'returnPeriod']} label={t('fields.returnPeriodColumn')} />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['categories', 'columns', 'conditions']} label={t('fields.conditionsColumn')} />
          </Col>
          <Col xs={24} md={6}>
            <TextField root={root} path={['categories', 'columns', 'specialNotes']} label={t('fields.specialNotesColumn')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['categories', 'extraTitle']} label={t('fields.extraTitle')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['categories', 'extraDescription']} label={t('fields.extraDescription')} rows={2} />
          </Col>
        </Row>
        {renderCategories(root)}
      </Section>

      <Section title={t('sections.reasons')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['reasons', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['reasons', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['reasons', 'cardDescription']} label={t('fields.cardDescription')} rows={2} />
          </Col>
        </Row>
        {renderReasons(root)}
      </Section>

      <Section title={t('sections.faq')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['faqSection', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['faqSection', 'description']} label={t('fields.description')} rows={2} />
          </Col>
        </Row>
        {renderFaq(root)}
      </Section>

      <Section title={t('sections.support')}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <TextField root={root} path={['support', 'tipsTitle']} label={t('fields.tipsTitle')} />
            {renderStringList({
              root,
              path: ['support', 'tips'],
              title: t('sections.supportTips'),
              addText: t('actions.addTip'),
              label: t('fields.tip')
            })}
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['support', 'supportTitle']} label={t('fields.supportTitle')} />
            <TextField root={root} path={['support', 'hotlineLabel']} label={t('fields.hotlineLabel')} />
            <TextField root={root} path={['support', 'emailLabel']} label={t('fields.emailLabel')} />
            <TextField root={root} path={['support', 'hoursLabel']} label={t('fields.hoursLabel')} />
            <TextField root={root} path={['support', 'contact', 'phone']} label={t('fields.phone')} />
            <TextField root={root} path={['support', 'contact', 'email']} label={t('fields.email')} />
            <TextField root={root} path={['support', 'contact', 'hours']} label={t('fields.hours')} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.footerCta')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['footerCta', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['footerCta', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['footerCta', 'callButton']} label={t('fields.callButton')} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['footerCta', 'emailButton']} label={t('fields.emailButton')} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['footerCta', 'faqButton']} label={t('fields.faqButton')} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['footerCta', 'callUrl']} label={t('fields.callUrl')} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['footerCta', 'emailUrl']} label={t('fields.emailUrl')} />
          </Col>
          <Col xs={24} md={4}>
            <TextField root={root} path={['footerCta', 'faqUrl']} label={t('fields.faqUrl')} />
          </Col>
        </Row>
      </Section>
    </>
  )

  return (
    <div className="admin-return-policy-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-return-policy-card">
        <div className="admin-return-policy-header">
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-return-policy-form">
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

export default ReturnPolicy
