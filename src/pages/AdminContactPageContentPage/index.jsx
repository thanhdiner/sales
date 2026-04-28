import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Divider, Form, Input, Row, Select, Space, Spin, Tabs, Typography, message } from 'antd'
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import {
  getAdminContactPageContent,
  updateAdminContactPageContent
} from '@/services/contactPageContentService'
import './AdminContactPageContentPage.scss'

const { Title, Text } = Typography
const { TextArea } = Input

const METHOD_TYPE_OPTIONS = ['zalo', 'facebook', 'email', 'phone', 'link']

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const asArray = value => (Array.isArray(value) ? value : [])
const clone = value => JSON.parse(JSON.stringify(value || {}))

function alignPrimitiveList(baseList, translationList) {
  const translations = asArray(translationList)
  return asArray(baseList).map((_item, index) => translations[index] || '')
}

function alignObjectList(baseList, translationList, emptyValue = {}) {
  const translations = asArray(translationList)
  return asArray(baseList).map((_item, index) => (isObject(translations[index]) ? translations[index] : clone(emptyValue)))
}

function alignContactPageTranslations(content = {}, translation = {}) {
  const next = clone(translation)
  next.hero = next.hero || {}
  next.hero.topics = alignPrimitiveList(content.hero?.topics, next.hero.topics)

  next.highlightsSection = next.highlightsSection || {}
  next.highlightsSection.items = alignObjectList(content.highlightsSection?.items, next.highlightsSection.items)

  next.contactMethodsSection = next.contactMethodsSection || {}
  next.contactMethodsSection.sellers = asArray(content.contactMethodsSection?.sellers).map((seller, sellerIndex) => {
    const translatedSeller = isObject(next.contactMethodsSection?.sellers?.[sellerIndex])
      ? next.contactMethodsSection.sellers[sellerIndex]
      : {}

    return {
      ...translatedSeller,
      methods: alignObjectList(seller.methods, translatedSeller.methods)
    }
  })

  next.workingHoursCard = next.workingHoursCard || {}
  next.workingHoursCard.items = alignObjectList(content.workingHoursCard?.items, next.workingHoursCard.items)

  next.faqSection = next.faqSection || {}
  next.faqSection.items = alignObjectList(content.faqSection?.items, next.faqSection.items)

  return next
}

function AdminContactPageContentPage() {
  const { t } = useTranslation('adminContactPage')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const requiredRule = [{ required: true, message: t('validation.required') }]
  const fieldName = (root, ...path) => [...root, ...path]

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getAdminContactPageContent()
      const data = response?.data || {}

      form.setFieldsValue({
        content: data.content || {},
        translations: {
          en: data.translations?.en || {}
        }
      })
    } catch {
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
    const englishTranslation = alignContactPageTranslations(content, values.translations?.en || {})

    setSaving(true)

    try {
      const response = await updateAdminContactPageContent({
        content,
        translations: {
          en: englishTranslation
        }
      })

      const data = response?.data || {}
      form.setFieldsValue({
        content: data.content || content,
        translations: {
          en: data.translations?.en || englishTranslation
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
      {rows > 0 ? (
        <TextArea rows={rows} placeholder={placeholder || label} />
      ) : (
        <Input placeholder={placeholder || label} />
      )}
    </Form.Item>
  )

  const Section = ({ title, description, children }) => (
    <section className="admin-contact-content-section">
      <div className="admin-contact-content-section__header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd }) => (
    <div className="admin-contact-content-list">
      <div className="admin-contact-content-list__header">
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

  const renderTopicList = root => (
    <Form.List name={fieldName(root, 'hero', 'topics')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.heroTopics')} addText={t('actions.addTopic')} onAdd={() => add('')}>
          {fields.map(field => (
            <div className="admin-contact-content-list-item" key={field.key}>
              <Form.Item {...field} label={t('fields.topic')} name={field.name}>
                <Input placeholder={t('fields.topic')} />
              </Form.Item>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderHighlightList = (root, translationOnly = false) => (
    <Form.List name={fieldName(root, 'highlightsSection', 'items')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.highlightsItems')}
          addText={t('actions.addHighlight')}
          onAdd={() => add(translationOnly ? { label: '' } : { value: '', label: '' })}
        >
          {fields.map(field => (
            <div className="admin-contact-content-list-item" key={field.key}>
              <Row gutter={16}>
                {!translationOnly && (
                  <Col xs={24} md={8}>
                    <Form.Item label={t('fields.value')} name={[field.name, 'value']}>
                      <Input placeholder={t('fields.value')} />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} md={translationOnly ? 24 : 16}>
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

  const renderSellerMethods = (sellerField, translationOnly = false) => (
    <Form.List name={[sellerField.name, 'methods']}>
      {(methodFields, { add, remove }) => (
        <div className="admin-contact-content-nested-list">
          <div className="admin-contact-content-nested-list__header">
            <h5>{t('sections.sellerMethods')}</h5>
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() =>
                add(
                  translationOnly
                    ? { title: '', actionLabel: '' }
                    : { type: 'link', title: '', value: '', actionLabel: '', link: '' }
                )
              }
            >
              {t('actions.addMethod')}
            </Button>
          </div>

          {methodFields.map(methodField => (
            <div className="admin-contact-content-method" key={methodField.key}>
              <Row gutter={16}>
                {!translationOnly && (
                  <Col xs={24} md={6}>
                    <Form.Item label={t('fields.methodType')} name={[methodField.name, 'type']}>
                      <Select
                        options={METHOD_TYPE_OPTIONS.map(type => ({
                          value: type,
                          label: t(`methodTypes.${type}`)
                        }))}
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} md={translationOnly ? 12 : 6}>
                  <Form.Item label={t('fields.methodTitle')} name={[methodField.name, 'title']}>
                    <Input placeholder={t('fields.methodTitle')} />
                  </Form.Item>
                </Col>
                {!translationOnly && (
                  <Col xs={24} md={6}>
                    <Form.Item label={t('fields.methodValue')} name={[methodField.name, 'value']}>
                      <Input placeholder={t('fields.methodValue')} />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} md={translationOnly ? 12 : 6}>
                  <Form.Item label={t('fields.actionLabel')} name={[methodField.name, 'actionLabel']}>
                    <Input placeholder={t('fields.actionLabel')} />
                  </Form.Item>
                </Col>
                {!translationOnly && (
                  <Col xs={24}>
                    <Form.Item label={t('fields.link')} name={[methodField.name, 'link']}>
                      <Input placeholder="https://..." />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <RemoveButton onClick={() => remove(methodField.name)} />
            </div>
          ))}
        </div>
      )}
    </Form.List>
  )

  const renderSellerList = (root, translationOnly = false) => (
    <Form.List name={fieldName(root, 'contactMethodsSection', 'sellers')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.sellers')}
          addText={t('actions.addSeller')}
          onAdd={() =>
            add(
              translationOnly
                ? { name: '', role: '', methods: [] }
                : { name: '', role: '', avatar: '', methods: [] }
            )
          }
        >
          {fields.map(field => (
            <div className="admin-contact-content-list-item" key={field.key}>
              <Row gutter={16}>
                <Col xs={24} md={translationOnly ? 12 : 8}>
                  <Form.Item label={t('fields.sellerName')} name={[field.name, 'name']}>
                    <Input placeholder={t('fields.sellerName')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={translationOnly ? 12 : 8}>
                  <Form.Item label={t('fields.sellerRole')} name={[field.name, 'role']}>
                    <Input placeholder={t('fields.sellerRole')} />
                  </Form.Item>
                </Col>
                {!translationOnly && (
                  <Col xs={24} md={8}>
                    <Form.Item label={t('fields.avatar')} name={[field.name, 'avatar']}>
                      <Input placeholder="/images/avt.jpg" />
                    </Form.Item>
                  </Col>
                )}
              </Row>

              {renderSellerMethods(field, translationOnly)}
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderWorkingHourList = (root, translationOnly = false) => (
    <Form.List name={fieldName(root, 'workingHoursCard', 'items')}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.workingHoursItems')}
          addText={t('actions.addWorkingHour')}
          onAdd={() => add(translationOnly ? { day: '' } : { type: '', day: '', time: '' })}
        >
          {fields.map(field => (
            <div className="admin-contact-content-list-item" key={field.key}>
              <Row gutter={16}>
                {!translationOnly && (
                  <Col xs={24} md={6}>
                    <Form.Item label={t('fields.type')} name={[field.name, 'type']}>
                      <Input placeholder="weekday" />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} md={translationOnly ? 24 : 9}>
                  <Form.Item label={t('fields.day')} name={[field.name, 'day']}>
                    <Input placeholder={t('fields.day')} />
                  </Form.Item>
                </Col>
                {!translationOnly && (
                  <Col xs={24} md={9}>
                    <Form.Item label={t('fields.time')} name={[field.name, 'time']}>
                      <Input placeholder="8:00 - 21:00" />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderFaqList = root => (
    <Form.List name={fieldName(root, 'faqSection', 'items')}>
      {(fields, { add, remove }) => (
        <ListShell title={t('sections.faqItems')} addText={t('actions.addFaq')} onAdd={() => add({ question: '', answer: '' })}>
          {fields.map(field => (
            <div className="admin-contact-content-list-item" key={field.key}>
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

  const renderBaseFields = () => {
    const root = ['content']

    return (
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

        <Section title={t('sections.links')} description={t('sections.linksDescription')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['links', 'zaloUrl']} label={t('fields.zaloUrl')} required />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['links', 'emailUrl']} label={t('fields.emailUrl')} required />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['links', 'productsUrl']} label={t('fields.productsUrl')} required />
            </Col>
          </Row>
        </Section>

        <Section title={t('sections.hero')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'titleLine1']} label={t('fields.titleLine1')} required />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'titleLine2']} label={t('fields.titleLine2')} required />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['hero', 'description']} label={t('fields.description')} rows={3} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'zaloButton']} label={t('fields.zaloButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'emailButton']} label={t('fields.emailButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'imageUrl']} label={t('fields.imageUrl')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['hero', 'imageAlt']} label={t('fields.imageAlt')} />
            </Col>
          </Row>
          {renderTopicList(root)}
          <Divider />
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'visual', 'badge']} label={t('fields.visualBadge')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'visual', 'eyebrow']} label={t('fields.visualEyebrow')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'visual', 'button']} label={t('fields.visualButton')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['hero', 'visual', 'description']} label={t('fields.visualDescription')} rows={2} />
            </Col>
          </Row>
        </Section>

        <Section title={t('sections.highlights')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['highlightsSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['highlightsSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['highlightsSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
          </Row>
          {renderHighlightList(root)}
        </Section>

        <Section title={t('sections.contactMethods')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['contactMethodsSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['contactMethodsSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['contactMethodsSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['contactMethodsSection', 'note']} label={t('fields.note')} rows={2} />
            </Col>
          </Row>
          {renderSellerList(root)}
        </Section>

        <Section title={t('sections.schedule')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['formScheduleSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['formScheduleSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['formScheduleSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'title']} label={t('fields.workingTitle')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'description']} label={t('fields.workingDescription')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'noteTitle']} label={t('fields.noteTitle')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'noteDescription']} label={t('fields.noteDescription')} rows={2} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'zaloButton']} label={t('fields.zaloButton')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'emailButton']} label={t('fields.emailButton')} />
            </Col>
          </Row>
          {renderWorkingHourList(root)}
        </Section>

        <Section title={t('sections.faq')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['faqSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['faqSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
          </Row>
          {renderFaqList(root)}
          <Divider />
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'eyebrow']} label={t('fields.helpEyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['faqHelpCard', 'title']} label={t('fields.helpTitle')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['faqHelpCard', 'description']} label={t('fields.helpDescription')} rows={2} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'zaloButton']} label={t('fields.zaloButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'emailButton']} label={t('fields.emailButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'tip']} label={t('fields.tip')} />
            </Col>
          </Row>
        </Section>

        <Section title={t('sections.cta')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['ctaSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['ctaSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['ctaSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['ctaSection', 'chatButton']} label={t('fields.chatButton')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['ctaSection', 'productsButton']} label={t('fields.productsButton')} />
            </Col>
          </Row>
        </Section>
      </>
    )
  }

  const renderTranslationFields = () => {
    const root = ['translations', 'en']

    return (
      <>
        <Section title={t('sections.translationIntro')} description={t('sections.translationDescription')}>
          <Row gutter={16}>
            <Col xs={24} md={10}>
              <TextField root={root} path={['seo', 'title']} label={t('fields.seoTitle')} />
            </Col>
            <Col xs={24} md={14}>
              <TextField root={root} path={['seo', 'description']} label={t('fields.seoDescription')} rows={2} />
            </Col>
          </Row>
        </Section>

        <Section title={t('sections.hero')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'titleLine1']} label={t('fields.titleLine1')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'titleLine2']} label={t('fields.titleLine2')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['hero', 'description']} label={t('fields.description')} rows={3} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'zaloButton']} label={t('fields.zaloButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'emailButton']} label={t('fields.emailButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'imageAlt']} label={t('fields.imageAlt')} />
            </Col>
          </Row>
          {renderTopicList(root)}
          <Divider />
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'visual', 'badge']} label={t('fields.visualBadge')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'visual', 'eyebrow']} label={t('fields.visualEyebrow')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['hero', 'visual', 'button']} label={t('fields.visualButton')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['hero', 'visual', 'description']} label={t('fields.visualDescription')} rows={2} />
            </Col>
          </Row>
        </Section>

        <Section title={t('sections.highlights')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['highlightsSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['highlightsSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['highlightsSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
          </Row>
          {renderHighlightList(root, true)}
        </Section>

        <Section title={t('sections.contactMethods')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['contactMethodsSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['contactMethodsSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['contactMethodsSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['contactMethodsSection', 'note']} label={t('fields.note')} rows={2} />
            </Col>
          </Row>
          {renderSellerList(root, true)}
        </Section>

        <Section title={t('sections.schedule')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['formScheduleSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['formScheduleSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['formScheduleSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'title']} label={t('fields.workingTitle')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'description']} label={t('fields.workingDescription')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'noteTitle']} label={t('fields.noteTitle')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'noteDescription']} label={t('fields.noteDescription')} rows={2} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'zaloButton']} label={t('fields.zaloButton')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['workingHoursCard', 'emailButton']} label={t('fields.emailButton')} />
            </Col>
          </Row>
          {renderWorkingHourList(root, true)}
        </Section>

        <Section title={t('sections.faq')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['faqSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['faqSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
          </Row>
          {renderFaqList(root)}
          <Divider />
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'eyebrow']} label={t('fields.helpEyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['faqHelpCard', 'title']} label={t('fields.helpTitle')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['faqHelpCard', 'description']} label={t('fields.helpDescription')} rows={2} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'zaloButton']} label={t('fields.zaloButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'emailButton']} label={t('fields.emailButton')} />
            </Col>
            <Col xs={24} md={8}>
              <TextField root={root} path={['faqHelpCard', 'tip']} label={t('fields.tip')} />
            </Col>
          </Row>
        </Section>

        <Section title={t('sections.cta')}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <TextField root={root} path={['ctaSection', 'eyebrow']} label={t('fields.eyebrow')} />
            </Col>
            <Col xs={24} md={16}>
              <TextField root={root} path={['ctaSection', 'title']} label={t('fields.title')} />
            </Col>
            <Col xs={24}>
              <TextField root={root} path={['ctaSection', 'description']} label={t('fields.description')} rows={2} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['ctaSection', 'chatButton']} label={t('fields.chatButton')} />
            </Col>
            <Col xs={24} md={12}>
              <TextField root={root} path={['ctaSection', 'productsButton']} label={t('fields.productsButton')} />
            </Col>
          </Row>
        </Section>
      </>
    )
  }

  return (
    <div className="admin-contact-content-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-contact-content-card">
        <div className="admin-contact-content-header">
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
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-contact-content-form">
            <Tabs
              destroyInactiveTabPane={false}
              items={[
                {
                  key: 'vi',
                  label: t('tabs.vi'),
                  children: renderBaseFields()
                },
                {
                  key: 'en',
                  label: t('tabs.en'),
                  children: renderTranslationFields()
                }
              ]}
            />
          </Form>
        </Spin>
      </div>
    </div>
  )
}

export default AdminContactPageContentPage
