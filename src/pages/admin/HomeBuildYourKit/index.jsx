import { DeleteOutlined, DownOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SaveOutlined, UpOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row, Select, Space, Spin, Switch, Tabs, Typography, message } from 'antd'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/shared/SEO'
import clientHomeEn from '@/i18n/locales/en/client/home.json'
import clientHomeVi from '@/i18n/locales/vi/client/home.json'
import { getProducts } from '@/services/admin/commerce/product'
import {
  getHomeBuildYourKitContent,
  updateHomeBuildYourKitContent
} from '@/services/admin/content/homeBuildYourKit'
import './index.scss'

const { Title, Text } = Typography
const { TextArea } = Input
const POSITION_KEYS = ['sunglasses', 'sunscreen', 'battery', 'camera', 'backpack', 'pillow', 'bottle', 'notebook']

const DEFAULT_CONTENT = clientHomeVi.buildYourKitSection
const DEFAULT_EN_CONTENT = clientHomeEn.buildYourKitSection

const clone = value => JSON.parse(JSON.stringify(value || {}))
const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const isValidLink = value => {
  if (!value) return true
  return (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) || /^https?:\/\//i.test(value)
}
const slugifyKitId = value => String(value || '')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

function mergeDefaults(defaultValue, value) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value) && value.length > 0 ? value.map(item => clone(item)) : clone(defaultValue)
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

function normalizeLegacyProducts(products = []) {
  return (Array.isArray(products) ? products : []).map((product, index) => ({
    productId: product.productId || '',
    productSlug: product.productSlug || '',
    positionKey: product.positionKey || product.className || POSITION_KEYS[index % POSITION_KEYS.length],
    customLabel: product.customLabel || product.label || '',
    customImage: product.customImage || product.image || '',
    categorySlugFallback: product.categorySlugFallback || ''
  }))
}

function createLegacyKit(content = {}) {
  const label = content.activeScenario || content.scenarios?.[0] || 'Kit'

  return {
    id: slugifyKitId(label) || 'default-kit',
    label,
    kicker: content.activeCardKicker || '',
    title: content.activeCardTitle || content.title || label,
    description: content.activeCardDescription || content.description || '',
    primaryCta: content.primaryCta || '',
    primaryCtaLink: content.primaryCtaLink || '',
    categorySlug: content.categorySlug || '',
    highlights: Array.isArray(content.highlights) ? content.highlights : [],
    products: normalizeLegacyProducts(content.products)
  }
}

function normalizeEditableContent(content = {}, fallback = DEFAULT_CONTENT) {
  const merged = mergeDefaults(fallback, content)
  const kits = Array.isArray(content.kits) && content.kits.length
    ? content.kits.map((kit, index) => ({
      id: kit.id || slugifyKitId(kit.label) || `kit-${index + 1}`,
      label: kit.label || `Kit ${index + 1}`,
      kicker: kit.kicker || '',
      title: kit.title || '',
      description: kit.description || '',
      primaryCta: kit.primaryCta || '',
      primaryCtaLink: kit.primaryCtaLink || '',
      categorySlug: kit.categorySlug || '',
      highlights: Array.isArray(kit.highlights) ? kit.highlights : [],
      products: normalizeLegacyProducts(kit.products)
    }))
    : [createLegacyKit(merged)]

  return {
    ...merged,
    defaultKitId: merged.defaultKitId || kits[0]?.id || '',
    primaryCtaFallback: merged.primaryCtaFallback || merged.primaryCta || '',
    secondaryCtaLink: merged.secondaryCtaLink || '/products',
    scenarios: Array.isArray(merged.scenarios) && merged.scenarios.length ? merged.scenarios : kits.map(kit => kit.label),
    highlights: Array.isArray(merged.highlights) ? merged.highlights : kits[0]?.highlights || [],
    products: normalizeLegacyProducts(merged.products?.length ? merged.products : kits[0]?.products || []),
    kits
  }
}

function getEditableBaseContent(data) {
  if (!data) return {}

  const content = { ...data }
  delete content._id
  delete content.__v
  delete content.createdAt
  delete content.updatedAt
  delete content.createdBy
  delete content.updatedBy
  delete content.translations

  return content
}

function getInitialValues(data) {
  return {
    content: normalizeEditableContent(getEditableBaseContent(data), DEFAULT_CONTENT),
    translations: {
      en: normalizeEditableContent(data?.translations?.en || {}, DEFAULT_EN_CONTENT)
    }
  }
}

function compactContent(content = {}) {
  const kits = (content.kits || []).map(kit => ({
    ...kit,
    highlights: (kit.highlights || []).filter(Boolean),
    products: (kit.products || []).filter(product => product.productId || product.productSlug || product.customLabel || product.customImage || product.categorySlugFallback)
  }))

  return {
    ...content,
    defaultKitId: content.defaultKitId || kits[0]?.id || '',
    scenarios: kits.map(kit => kit.label).filter(Boolean),
    activeScenario: kits[0]?.label || content.activeScenario || '',
    activeCardKicker: kits[0]?.kicker || content.activeCardKicker || '',
    activeCardTitle: kits[0]?.title || content.activeCardTitle || '',
    primaryCta: kits[0]?.primaryCta || content.primaryCta || content.primaryCtaFallback || '',
    highlights: kits[0]?.highlights || [],
    products: kits[0]?.products || [],
    kits
  }
}

function mapProductOptions(products = []) {
  return products.map(product => ({
    value: product._id,
    label: product.title || product.productName || product.name || product._id,
    product
  }))
}

function HomeBuildYourKit() {
  const { t } = useTranslation('adminHomeBuildYourKit')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(null)
  const [productOptions, setProductOptions] = useState([])
  const [productLoading, setProductLoading] = useState(false)
  const queryClient = useQueryClient()

  const fieldName = (root, ...path) => [...root, ...path]
  const requiredRule = [{ required: true, message: t('validation.required') }]
  const linkRules = [{ validator: (_, value) => (isValidLink(value) ? Promise.resolve() : Promise.reject(new Error(t('validation.link')))) }]
  const positionOptions = useMemo(
    () => POSITION_KEYS.map((key, index) => ({
      value: key,
      label: t('positionOptions.item', { index: index + 1 })
    })),
    [t]
  )

  const fetchProductOptions = useCallback(async (keyword = '') => {
    setProductLoading(true)
    try {
      const response = await getProducts({ page: 1, limit: 20, productName: keyword, status: 'active' })
      setProductOptions(mapProductOptions(response?.products || response?.data || []))
    } catch {
      setProductOptions([])
    } finally {
      setProductLoading(false)
    }
  }, [])

  const handleSearchProducts = useMemo(() => debounce(fetchProductOptions, 400), [fetchProductOptions])

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getHomeBuildYourKitContent()
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
    const timeoutId = window.setTimeout(() => {
      fetchContent()
      fetchProductOptions()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
      handleSearchProducts.cancel()
    }
  }, [fetchContent, fetchProductOptions, handleSearchProducts])

  const validateUniqueKitIds = values => {
    const allKits = [values.content?.kits || [], values.translations?.en?.kits || []]

    allKits.forEach(kits => {
      const ids = kits.map(kit => kit?.id).filter(Boolean)
      if (new Set(ids).size !== ids.length) throw new Error(t('validation.uniqueId'))
    })
  }

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true)

    try {
      validateUniqueKitIds(values)
    } catch (error) {
      message.error(error.message)
      return
    }

    const payload = compactContent(values.content || {})

    setSaving(true)

    try {
      const response = await updateHomeBuildYourKitContent({
        ...payload,
        translations: {
          en: compactContent(values.translations?.en || {})
        }
      })
      const savedContent = response?.data || null

      setContent(savedContent)
      form.setFieldsValue(getInitialValues(savedContent))
      queryClient.invalidateQueries({ queryKey: ['homeBuildYourKitContent'] })
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

  const handleResetDefaults = () => {
    form.setFieldsValue(getInitialValues(null))
    message.info(t('messages.defaultsDone'))
  }

  const TextField = ({ root, path, label, required = false, rows = 0, placeholder, rules = [] }) => (
    <Form.Item label={label} name={fieldName(root, ...path)} rules={[...(required ? requiredRule : []), ...rules]}>
      {rows > 0 ? <TextArea rows={rows} placeholder={placeholder || label} /> : <Input placeholder={placeholder || label} />}
    </Form.Item>
  )

  const Section = ({ title, description, children }) => (
    <section className="admin-home-byk-section">
      <div className="admin-home-byk-section__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )

  const ListShell = ({ title, addText, children, onAdd, hint }) => (
    <div className="admin-home-byk-list">
      <div className="admin-home-byk-list__header">
        <div>
          <h4>{title}</h4>
          {hint ? <p>{hint}</p> : null}
        </div>
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

  const MoveButtons = ({ index, count, move }) => (
    <Space>
      <Button type="text" icon={<UpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)} />
      <Button type="text" icon={<DownOutlined />} disabled={index === count - 1} onClick={() => move(index, index + 1)} />
    </Space>
  )

  const renderStringList = (name, title, addText, fieldLabel) => (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <ListShell title={title} addText={addText} onAdd={() => add('')}>
          {fields.map((field, index) => (
            <div className="admin-home-byk-list-item admin-home-byk-list-item--inline" key={field.key}>
              <Form.Item {...field} label={fieldLabel(index + 1)} name={field.name} rules={requiredRule}>
                <Input />
              </Form.Item>
              <RemoveButton onClick={() => remove(field.name)} />
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const handleProductSelect = (root, kitIndex, productIndex, productId) => {
    const selected = productOptions.find(option => option.value === productId)?.product
    if (!selected) return

    const kits = [...(form.getFieldValue(fieldName(root, 'kits')) || [])]
    const kit = kits[kitIndex] || {}
    const products = [...(kit.products || [])]
    products[productIndex] = {
      ...products[productIndex],
      productId,
      productSlug: selected.slug || products[productIndex]?.productSlug || '',
      customLabel: products[productIndex]?.customLabel || selected.title || '',
      customImage: products[productIndex]?.customImage || selected.thumbnail || ''
    }
    kits[kitIndex] = { ...kit, products }
    form.setFieldValue(fieldName(root, 'kits'), kits)
  }

  const renderKitProducts = (root, kitField, kitIndex) => (
    <Form.List name={[kitField.name, 'products']}>
      {(fields, { add, remove }) => (
        <ListShell
          title={t('sections.products')}
          addText={t('actions.addProduct')}
          hint={t('sections.productsDescription')}
          onAdd={() => add({ productId: '', productSlug: '', positionKey: POSITION_KEYS[fields.length % POSITION_KEYS.length], customLabel: '', customImage: '', categorySlugFallback: '' })}
        >
          {fields.map((field, index) => (
            <div className="admin-home-byk-list-item" key={field.key}>
              <div className="admin-home-byk-list-item__header">
                <div className="admin-home-byk-list-item__title">{t('fields.product', { index: index + 1 })}</div>
                <RemoveButton onClick={() => remove(field.name)} />
              </div>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label={t('fields.productRef')} name={[field.name, 'productId']}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={false}
                      loading={productLoading}
                      options={productOptions}
                      optionFilterProp="label"
                      onSearch={handleSearchProducts}
                      onChange={value => handleProductSelect(root, kitIndex, index, value)}
                      placeholder={t('placeholders.productSearch')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.productSlug')} name={[field.name, 'productSlug']}>
                    <Input placeholder="product-slug" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.positionKey')} name={[field.name, 'positionKey']} rules={requiredRule}>
                    <Select options={positionOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.customLabel')} name={[field.name, 'customLabel']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item label={t('fields.customImage')} name={[field.name, 'customImage']}>
                    <Input placeholder="/icons/example.webp" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.categorySlugFallback')} name={[field.name, 'categorySlugFallback']}>
                    <Input placeholder="category-slug" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
        </ListShell>
      )}
    </Form.List>
  )

  const renderKits = root => (
    <Form.List name={fieldName(root, 'kits')}>
      {(fields, { add, remove, move }) => (
        <ListShell
          title={t('sections.kits')}
          addText={t('actions.addKit')}
          hint={t('sections.kitsDescription')}
          onAdd={() => add({ id: `kit-${fields.length + 1}`, label: '', kicker: '', title: '', description: '', primaryCta: '', primaryCtaLink: '', categorySlug: '', highlights: [], products: [] })}
        >
          {fields.map((field, index) => (
            <div className="admin-home-byk-kit" key={field.key}>
              <div className="admin-home-byk-kit__header">
                <div>
                  <h4>{t('fields.kit', { index: index + 1 })}</h4>
                  <p>{t('sections.kitDescription')}</p>
                </div>
                <Space>
                  <MoveButtons index={index} count={fields.length} move={move} />
                  <RemoveButton onClick={() => remove(field.name)} />
                </Space>
              </div>

              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.kitId')} name={[field.name, 'id']} rules={requiredRule}>
                    <Input placeholder="travel" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.kitLabel')} name={[field.name, 'label']} rules={requiredRule}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.kicker')} name={[field.name, 'kicker']} rules={requiredRule}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.kitTitle')} name={[field.name, 'title']} rules={requiredRule}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label={t('fields.kitDescription')} name={[field.name, 'description']}>
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={t('fields.primaryCta')} name={[field.name, 'primaryCta']} rules={requiredRule}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item label={t('fields.primaryCtaLink')} name={[field.name, 'primaryCtaLink']} rules={linkRules}>
                    <Input placeholder="/products?q=travel" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label={t('fields.categorySlug')} name={[field.name, 'categorySlug']}>
                    <Input placeholder="travel" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  {renderStringList([field.name, 'highlights'], t('sections.highlights'), t('actions.addHighlight'), highlightIndex => t('fields.highlight', { index: highlightIndex }))}
                </Col>
                <Col xs={24}>
                  {renderKitProducts(root, field, index)}
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
      <Section title={t('sections.status')}>
        <Form.Item label={t('fields.enabled')} name={fieldName(root, 'enabled')} valuePropName="checked">
          <Switch />
        </Form.Item>
      </Section>

      <Section title={t('sections.header')} description={t('sections.headerDescription')}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <TextField root={root} path={['eyebrow']} label={t('fields.eyebrow')} required />
          </Col>
          <Col xs={24} md={16}>
            <TextField root={root} path={['title']} label={t('fields.title')} required />
          </Col>
          <Col xs={24}>
            <TextField root={root} path={['description']} label={t('fields.description')} rows={3} required />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['defaultKitId']} label={t('fields.defaultKitId')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['primaryCtaFallback']} label={t('fields.primaryCtaFallback')} />
          </Col>
          <Col xs={24} md={8}>
            <TextField root={root} path={['secondaryCta']} label={t('fields.secondaryCta')} />
          </Col>
          <Col xs={24} md={12}>
            <TextField root={root} path={['secondaryCtaLink']} label={t('fields.secondaryCtaLink')} rules={linkRules} />
          </Col>
        </Row>
      </Section>

      <Section title={t('sections.kits')} description={t('sections.kitsDescription')}>
        {renderKits(root)}
      </Section>
    </>
  )

  return (
    <div className="admin-home-byk-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-home-byk-card">
        <div className="admin-home-byk-header">
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
            <Button icon={<ReloadOutlined />} onClick={handleResetDefaults} disabled={loading || saving}>
              {t('actions.resetDefaults')}
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
              {t('actions.save')}
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-home-byk-form">
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

export default HomeBuildYourKit
