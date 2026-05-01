import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Divider, Form, Input, Row, Space, Spin, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import { getPrivacyPolicyContent, updatePrivacyPolicyContent } from '@/services/admin/content/privacyPolicy'
import {
  DEFAULT_PRIVACY_POLICY_CONTENT,
  DEFAULT_PRIVACY_POLICY_TRANSLATIONS,
  alignPrivacyPolicyTranslation,
  normalizePrivacyPolicyContent
} from '@/pages/client/PrivacyPolicy/privacyPolicyContent'
import './index.scss'

const { Title, Text } = Typography
const { TextArea } = Input

const clone = value => JSON.parse(JSON.stringify(value || {}))

function PrivacyPolicy() {
  const { t } = useTranslation('adminPrivacyPolicy')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getPrivacyPolicyContent()
      const data = response?.data || {}
      const content = normalizePrivacyPolicyContent(data.content, 'vi')
      const englishTranslation = alignPrivacyPolicyTranslation(content, data.translations?.en || {})

      form.setFieldsValue({
        content,
        translations: {
          en: englishTranslation
        }
      })
    } catch {
      form.setFieldsValue({
        content: clone(DEFAULT_PRIVACY_POLICY_CONTENT),
        translations: clone(DEFAULT_PRIVACY_POLICY_TRANSLATIONS)
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
    const englishTranslation = alignPrivacyPolicyTranslation(content, values.translations?.en || {})

    setSaving(true)

    try {
      const response = await updatePrivacyPolicyContent({
        content,
        translations: {
          en: englishTranslation
        }
      })
      const data = response?.data || {}
      const savedContent = normalizePrivacyPolicyContent(data.content || content, 'vi')

      form.setFieldsValue({
        content: savedContent,
        translations: {
          en: alignPrivacyPolicyTranslation(savedContent, data.translations?.en || englishTranslation)
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
    <section className="admin-privacy-policy-section">
      <div className="admin-privacy-policy-section__header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-privacy-policy-list">
      <div className="admin-privacy-policy-list__header">
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
            <div className="admin-privacy-policy-list-item admin-privacy-policy-list-item--inline" key={field.key}>
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

  const renderTextObjectList = ({ root, path, title, addText, titleLabel, descriptionLabel }) => (
    <Form.List name={fieldName(root, ...path)}>
      {(fields, { add, remove }) => (
        <ListShell title={title} addText={addText} onAdd={() => add({ title: '', description: '' })}>
          {fields.map(field => (
            <div className="admin-privacy-policy-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label={titleLabel} name={[field.name, 'title']}>
                    <Input placeholder={titleLabel} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={16}>
                  <Form.Item label={descriptionLabel} name={[field.name, 'description']}>
                    <TextArea rows={2} placeholder={descriptionLabel} />
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

  const renderSections = root => (
    <Form.List name={fieldName(root, 'sections')}>
      {fields => (
        <Section title={t('sections.sidebarItems')} description={t('sections.sidebarItemsDescription')}>
          {fields.map(field => (
            <Row gutter={16} key={field.key}>
              <Col xs={24} md={8}>
                <Form.Item label={t('fields.anchorId')} name={[field.name, 'id']}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={16}>
                <Form.Item label={t('fields.sectionTitle')} name={[field.name, 'title']}>
                  <Input placeholder={t('fields.sectionTitle')} />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Section>
      )}
    </Form.List>
  )

  const renderDataTypes = root => (
    <Form.List name={fieldName(root, 'dataCollectionSection', 'dataTypes')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.dataTypes')} addText={t('actions.addDataType')} onAdd={() => add({ title: '', items: [] })}>
          {fields.map(field => (
            <div className="admin-privacy-policy-list-item" key={field.key}>
              <Form.Item label={t('fields.title')} name={[field.name, 'title']}>
                <Input placeholder={t('fields.title')} />
              </Form.Item>
              <Form.List name={[field.name, 'items']}>
                {(itemFields, { add: addItem, remove: removeItem }) => (
                  <ListShell title={t('sections.dataTypeItems')} addText={t('actions.addItem')} onAdd={() => addItem('')}>
                    {itemFields.map(itemField => (
                      <div className="admin-privacy-policy-list-item admin-privacy-policy-list-item--inline" key={itemField.key}>
                        <Form.Item {...itemField} label={t('fields.item')} name={itemField.name}>
                          <Input placeholder={t('fields.item')} />
                        </Form.Item>
                        <RemoveButton onClick={() => removeItem(itemField.name)} />
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

  const renderCookies = root => (
    <Form.List name={fieldName(root, 'cookiesSection', 'categories')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.cookieCategories')}
          addText={t('actions.addCookie')}
          onAdd={() => add({ key: '', title: '', description: '' })}
        >
          {fields.map(field => (
            <div className="admin-privacy-policy-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.key')} name={[field.name, 'key']}>
                    <Input placeholder="essential" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.title')} name={[field.name, 'title']}>
                    <Input placeholder={t('fields.title')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
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

  const renderFaq = root => (
    <Form.List name={fieldName(root, 'faqSection', 'items')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.faqItems')} addText={t('actions.addFaq')} onAdd={() => add({ question: '', answer: '' })}>
          {fields.map(field => (
            <div className="admin-privacy-policy-list-item" key={field.key}>
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
          <Col xs={24} md={8}>
            <TextField root={root} path={['pageHeader', 'updatedAt']} label={t('fields.updatedAt')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['pageHeader', 'gdpr']} label={t('fields.gdpr')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['pageHeader', 'iso']} label={t('fields.iso')} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.summary')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['summary', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['summary', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['sidebar', 'title']} label={t('fields.sidebarTitle')} />
          </Col>
        </Row>
      </Section>

      {renderSections(root)}

      <Section title={t('sections.dataCollection')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['dataCollectionSection', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['dataCollectionSection', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['dataCollectionSection', 'importantNoteTitle']} label={t('fields.importantNoteTitle')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField
              root={root}
              path={['dataCollectionSection', 'importantNoteDescription']}
              label={t('fields.importantNoteDescription')}
              rows={2}
            />
          </Col>
        </Row>
        {renderDataTypes(root)}
      </Section>

      <Section title={t('sections.usage')}>
        <TextField root={root} path={['informationUsageSection', 'title']} label={t('fields.sectionTitle')} />
        {renderTextObjectList({
          root,
          path: ['informationUsageSection', 'items'],
          title: t('sections.usageItems'),
          addText: t('actions.addUsage'),
          titleLabel: t('fields.title'),
          descriptionLabel: t('fields.description')
        })}
      </Section>

      <Section title={t('sections.sharing')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['informationSharingSection', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['informationSharingSection', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['informationSharingSection', 'allowedTitle']} label={t('fields.allowedTitle')} />
            {renderStringList({
              root,
              path: ['informationSharingSection', 'allowed'],
              title: t('sections.allowedItems'),
              addText: t('actions.addItem'),
              label: t('fields.item')
            })}
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['informationSharingSection', 'disallowedTitle']} label={t('fields.disallowedTitle')} />
            {renderStringList({
              root,
              path: ['informationSharingSection', 'disallowed'],
              title: t('sections.disallowedItems'),
              addText: t('actions.addItem'),
              label: t('fields.item')
            })}
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.security')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['securitySection', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['securitySection', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['securitySection', 'commitmentTitle']} label={t('fields.commitmentTitle')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['securitySection', 'commitmentDescription']} label={t('fields.commitmentDescription')} rows={2} />
          </Col>
        </Row>
        {renderTextObjectList({
          root,
          path: ['securitySection', 'measures'],
          title: t('sections.securityMeasures'),
          addText: t('actions.addSecurityMeasure'),
          titleLabel: t('fields.title'),
          descriptionLabel: t('fields.description')
        })}
      </Section>

      <Section title={t('sections.userRights')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['userRightsSection', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['userRightsSection', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['userRightsSection', 'howToTitle']} label={t('fields.howToTitle')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['userRightsSection', 'howToDescription']} label={t('fields.howToDescription')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['userRightsSection', 'contactButton']} label={t('fields.contactButton')} />
          </Col>
        </Row>
        {renderStringList({
          root,
          path: ['userRightsSection', 'rights'],
          title: t('sections.userRightItems'),
          addText: t('actions.addRight'),
          label: t('fields.right')
        })}
      </Section>

      <Section title={t('sections.cookies')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['cookiesSection', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['cookiesSection', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['cookiesSection', 'manageButton']} label={t('fields.manageButton')} />
          </Col>
        </Row>
        {renderCookies(root)}
      </Section>

      <Section title={t('sections.faq')}>
        <TextField root={root} path={['faqSection', 'title']} label={t('fields.sectionTitle')} />
        {renderFaq(root)}
      </Section>

      <Section title={t('sections.contact')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactSection', 'title']} label={t('fields.title')} />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['contactSection', 'description']} label={t('fields.description')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactSection', 'email']} label={t('fields.emailLabel')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactSection', 'hotline']} label={t('fields.hotlineLabel')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactSection', 'website']} label={t('fields.websiteLabel')} />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactModal', 'title']} label={t('fields.modalTitle')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactModal', 'supportTitle']} label={t('fields.supportTitle')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactModal', 'supportEmail']} label={t('fields.supportEmail')} />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['contactModal', 'supportDescription']} label={t('fields.supportDescription')} rows={2} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactModal', 'hotline']} label={t('fields.hotlineLabel')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactModal', 'email']} label={t('fields.supportEmailValue')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['contactModal', 'phone']} label={t('fields.supportPhoneValue')} />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['contactModal', 'note']} label={t('fields.note')} rows={3} />
          </Col>
        </Row>
      </Section>
    </>
  )

  return (
    <div className="admin-privacy-policy-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-privacy-policy-card">
        <div className="admin-privacy-policy-header">
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-privacy-policy-form">
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

export default PrivacyPolicy
