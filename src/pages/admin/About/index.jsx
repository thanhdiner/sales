import { Button, Form, Input, Spin, Tabs, message } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, FileText, Image, Layers, ListChecks, RefreshCw, Save, Sparkles, Store, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/shared/SEO'
import { getAdminAboutContent, updateAdminAboutContent } from '@/services/admin/content/about'
import clientAboutEn from '@/i18n/locales/en/client/about.json'
import clientAboutVi from '@/i18n/locales/vi/client/about.json'
import './index.scss'

const { TextArea } = Input

const DEFAULT_MEDIA = {
  heroImageUrl: '/images/herosection-aboutpage.jpg',
  ownerImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
  primaryButtonLink: '/products',
  secondaryButtonLink: '/contact',
  ctaButtonLink: '/products'
}

const inputClass =
  'admin-about-input rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass =
  'rounded-lg !border-none !bg-[var(--admin-accent)] font-semibold !text-white hover:!opacity-90'

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}))
}

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

function withDefaultAboutLinks(content) {
  const nextContent = clone(content)

  nextContent.heroSection = {
    ...(nextContent.heroSection || {}),
    imageUrl: nextContent.heroSection?.imageUrl || DEFAULT_MEDIA.heroImageUrl,
    primaryButtonLink: nextContent.heroSection?.primaryButtonLink || DEFAULT_MEDIA.primaryButtonLink,
    secondaryButtonLink: nextContent.heroSection?.secondaryButtonLink || DEFAULT_MEDIA.secondaryButtonLink
  }

  nextContent.featuresSection = {
    ...(nextContent.featuresSection || {}),
    buttonLink: nextContent.featuresSection?.buttonLink || DEFAULT_MEDIA.primaryButtonLink
  }

  nextContent.ownerSection = {
    ...(nextContent.ownerSection || {}),
    imageUrl: nextContent.ownerSection?.imageUrl || DEFAULT_MEDIA.ownerImageUrl
  }

  nextContent.ctaSection = {
    ...(nextContent.ctaSection || {}),
    buttonLink: nextContent.ctaSection?.buttonLink || DEFAULT_MEDIA.ctaButtonLink
  }

  return nextContent
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
  const defaultVi = withDefaultAboutLinks(clientAboutVi)
  const defaultEn = withDefaultAboutLinks(clientAboutEn)

  return {
    vi: mergeDefaults(defaultVi, getEditableBaseContent(data)),
    en: mergeDefaults(defaultEn, data?.translations?.en || {})
  }
}

function SectionPanel({ title, description, Icon, children }) {
  return (
    <section className="admin-about-panel rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[var(--admin-text)]">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-5 text-[var(--admin-text-muted)]">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  )
}

function TextField({ name, label, placeholder, rows = 1, required = false }) {
  const rules = required ? [{ required: true, message: `${label} is required` }] : undefined

  return (
    <Form.Item name={name} label={label} rules={rules}>
      {rows > 1 ? (
        <TextArea className={inputClass} placeholder={placeholder} rows={rows} />
      ) : (
        <Input className={inputClass} placeholder={placeholder} size="large" />
      )}
    </Form.Item>
  )
}

function StringListField({ name, label, addLabel, removeLabel, placeholder }) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <div className="admin-about-list">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[var(--admin-text-muted)]">{label}</span>
            <Button htmlType="button" size="small" onClick={() => add('')} className={secondaryButtonClass}>
              {addLabel}
            </Button>
          </div>

          <div className="space-y-2">
            {fields.map(field => (
              <div key={field.key} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Form.Item {...field} className="!mb-0">
                  <Input className={inputClass} placeholder={placeholder} size="large" />
                </Form.Item>
                <Button danger htmlType="button" onClick={() => remove(field.name)} className="rounded-lg">
                  {removeLabel}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Form.List>
  )
}

function TextItemListField({ name, label, addLabel, removeLabel, titlePlaceholder, descriptionPlaceholder }) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <div className="admin-about-list">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[var(--admin-text-muted)]">{label}</span>
            <Button htmlType="button" size="small" onClick={() => add({ title: '', description: '' })} className={secondaryButtonClass}>
              {addLabel}
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map(field => (
              <div key={field.key} className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Form.Item name={[field.name, 'title']} className="!mb-0">
                      <Input className={inputClass} placeholder={titlePlaceholder} size="large" />
                    </Form.Item>
                    <Form.Item name={[field.name, 'description']} className="!mb-0">
                      <TextArea className={inputClass} placeholder={descriptionPlaceholder} rows={2} />
                    </Form.Item>
                  </div>
                  <Button danger htmlType="button" onClick={() => remove(field.name)} className="rounded-lg">
                    {removeLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Form.List>
  )
}

function LanguageFields({ langKey, t }) {
  const field = (...path) => [langKey, ...path]

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <SectionPanel title={t('sections.seo.title')} description={t('sections.seo.description')} Icon={FileText}>
          <TextField name={field('seo', 'title')} label={t('fields.seoTitle')} placeholder={t('placeholders.seoTitle')} required />
          <TextField name={field('seo', 'description')} label={t('fields.seoDescription')} placeholder={t('placeholders.seoDescription')} rows={3} />
        </SectionPanel>

        <SectionPanel title={t('sections.media.title')} description={t('sections.media.description')} Icon={Image}>
          <TextField name={field('heroSection', 'imageUrl')} label={t('fields.heroImageUrl')} placeholder={DEFAULT_MEDIA.heroImageUrl} />
          <TextField name={field('ownerSection', 'imageUrl')} label={t('fields.ownerImageUrl')} placeholder={DEFAULT_MEDIA.ownerImageUrl} />
        </SectionPanel>
      </div>

      <SectionPanel title={t('sections.hero.title')} description={t('sections.hero.description')} Icon={Sparkles}>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField name={field('heroSection', 'eyebrow')} label={t('fields.eyebrow')} placeholder={t('placeholders.eyebrow')} />
          <TextField name={field('heroSection', 'reviews')} label={t('fields.reviews')} placeholder={t('placeholders.reviews')} />
        </div>
        <StringListField name={field('heroSection', 'titleLines')} label={t('fields.titleLines')} addLabel={t('actions.addLine')} removeLabel={t('actions.remove')} placeholder={t('placeholders.titleLine')} />
        <TextField name={field('heroSection', 'description')} label={t('fields.description')} placeholder={t('placeholders.description')} rows={4} />
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField name={field('heroSection', 'primaryButton')} label={t('fields.primaryButton')} placeholder={t('placeholders.primaryButton')} />
          <TextField name={field('heroSection', 'primaryButtonLink')} label={t('fields.primaryButtonLink')} placeholder="/products" />
          <TextField name={field('heroSection', 'secondaryButton')} label={t('fields.secondaryButton')} placeholder={t('placeholders.secondaryButton')} />
          <TextField name={field('heroSection', 'secondaryButtonLink')} label={t('fields.secondaryButtonLink')} placeholder="/contact" />
          <TextField name={field('heroSection', 'imageAlt')} label={t('fields.imageAlt')} placeholder={t('placeholders.imageAlt')} />
        </div>
      </SectionPanel>

      <SectionPanel title={t('sections.benefits.title')} description={t('sections.benefits.description')} Icon={ListChecks}>
        <TextField name={field('benefitsSection', 'title')} label={t('fields.sectionTitle')} placeholder={t('placeholders.sectionTitle')} />
        <TextItemListField
          name={field('benefitsSection', 'items')}
          label={t('fields.benefits')}
          addLabel={t('actions.addBenefit')}
          removeLabel={t('actions.remove')}
          titlePlaceholder={t('placeholders.itemTitle')}
          descriptionPlaceholder={t('placeholders.itemDescription')}
        />
      </SectionPanel>

      <SectionPanel title={t('sections.features.title')} description={t('sections.features.description')} Icon={Layers}>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField name={field('featuresSection', 'eyebrow')} label={t('fields.eyebrow')} placeholder={t('placeholders.eyebrow')} />
          <TextField name={field('featuresSection', 'button')} label={t('fields.button')} placeholder={t('placeholders.button')} />
          <TextField name={field('featuresSection', 'buttonLink')} label={t('fields.buttonLink')} placeholder="/products" />
        </div>
        <StringListField name={field('featuresSection', 'titleLines')} label={t('fields.titleLines')} addLabel={t('actions.addLine')} removeLabel={t('actions.remove')} placeholder={t('placeholders.titleLine')} />
        <TextField name={field('featuresSection', 'description')} label={t('fields.description')} placeholder={t('placeholders.description')} rows={4} />
        <TextItemListField
          name={field('featuresSection', 'steps')}
          label={t('fields.steps')}
          addLabel={t('actions.addStep')}
          removeLabel={t('actions.remove')}
          titlePlaceholder={t('placeholders.itemTitle')}
          descriptionPlaceholder={t('placeholders.itemDescription')}
        />
      </SectionPanel>

      <SectionPanel title={t('sections.owner.title')} description={t('sections.owner.description')} Icon={UserRound}>
        <TextField name={field('ownerSection', 'title')} label={t('fields.ownerTitle')} placeholder={t('placeholders.ownerTitle')} />
        <StringListField name={field('ownerSection', 'paragraphs')} label={t('fields.paragraphs')} addLabel={t('actions.addParagraph')} removeLabel={t('actions.remove')} placeholder={t('placeholders.paragraph')} />
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField name={field('ownerSection', 'stats', 'goodPrice')} label={t('fields.goodPrice')} placeholder={t('placeholders.stat')} />
          <TextField name={field('ownerSection', 'stats', 'support')} label={t('fields.support')} placeholder={t('placeholders.stat')} />
          <TextField name={field('ownerSection', 'stats', 'easyBuy')} label={t('fields.easyBuy')} placeholder={t('placeholders.stat')} />
          <TextField name={field('ownerSection', 'stats', 'consulting')} label={t('fields.consulting')} placeholder={t('placeholders.stat')} />
          <TextField name={field('ownerSection', 'imageAlt')} label={t('fields.imageAlt')} placeholder={t('placeholders.imageAlt')} />
          <TextField name={field('ownerSection', 'ribbon', 'brand')} label={t('fields.ribbonBrand')} placeholder={t('placeholders.ribbonBrand')} />
          <TextField name={field('ownerSection', 'ribbon', 'text')} label={t('fields.ribbonText')} placeholder={t('placeholders.ribbonText')} />
        </div>
      </SectionPanel>

      <SectionPanel title={t('sections.timeline.title')} description={t('sections.timeline.description')} Icon={Store}>
        <TextItemListField
          name={field('timelineSection', 'items')}
          label={t('fields.timeline')}
          addLabel={t('actions.addTimeline')}
          removeLabel={t('actions.remove')}
          titlePlaceholder={t('placeholders.itemTitle')}
          descriptionPlaceholder={t('placeholders.itemDescription')}
        />
      </SectionPanel>

      <SectionPanel title={t('sections.cta.title')} description={t('sections.cta.description')} Icon={Sparkles}>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField name={field('ctaSection', 'title')} label={t('fields.ctaTitle')} placeholder={t('placeholders.ctaTitle')} />
          <TextField name={field('ctaSection', 'button')} label={t('fields.button')} placeholder={t('placeholders.button')} />
          <TextField name={field('ctaSection', 'buttonLink')} label={t('fields.buttonLink')} placeholder="/products" />
        </div>
        <TextField name={field('ctaSection', 'description')} label={t('fields.description')} placeholder={t('placeholders.description')} rows={3} />
      </SectionPanel>
    </div>
  )
}

export default function AdminAbout() {
  const { t } = useTranslation('adminAbout')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aboutContent, setAboutContent] = useState(null)
  const queryClient = useQueryClient()

  const tabs = useMemo(() => ([
    {
      key: 'vi',
      label: t('languages.vi'),
      forceRender: true,
      children: <LanguageFields langKey="vi" t={t} />
    },
    {
      key: 'en',
      label: t('languages.en'),
      forceRender: true,
      children: <LanguageFields langKey="en" t={t} />
    }
  ]), [t])

  useEffect(() => {
    let mounted = true

    const loadContent = async () => {
      try {
        setLoading(true)
        const response = await getAdminAboutContent()
        if (!mounted) return

        setAboutContent(response?.data || null)
        form.setFieldsValue(getInitialValues(response?.data))
      } catch {
        if (mounted) {
          message.error(t('messages.fetchError'))
          form.setFieldsValue(getInitialValues(null))
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadContent()

    return () => {
      mounted = false
    }
  }, [form, t])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      const payload = {
        ...(values.vi || {}),
        translations: {
          en: values.en || {}
        }
      }

      const response = await updateAdminAboutContent(payload)
      setAboutContent(response?.data || null)
      form.setFieldsValue(getInitialValues(response?.data))
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] })
      message.success(t('messages.saveSuccess'))
    } catch (error) {
      if (error?.errorFields) return
      message.error(t('messages.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue(getInitialValues(aboutContent))
    message.info(t('messages.resetDone'))
  }

  const handlePreview = () => {
    window.open('/about', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="admin-about-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-4 sm:p-5 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 border-b border-[var(--admin-border)] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-accent)]">
              {t('page.eyebrow')}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
              {t('page.title')}
            </h1>
            <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
              {t('page.description')}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button icon={<Eye className="h-4 w-4" />} size="large" onClick={handlePreview} className={secondaryButtonClass}>
              {t('actions.preview')}
            </Button>
            <Button icon={<RefreshCw className="h-4 w-4" />} size="large" onClick={handleReset} disabled={loading || saving} className={secondaryButtonClass}>
              {t('actions.reset')}
            </Button>
            <Button type="primary" icon={<Save className="h-4 w-4" />} size="large" loading={saving} onClick={handleSave} className={primaryButtonClass}>
              {t('actions.save')}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] shadow-[var(--admin-shadow)]">
            <div className="text-center">
              <Spin />
              <p className="mt-3 text-sm">{t('messages.loading')}</p>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            className="admin-about-form [&_.ant-form-item-label>label]:text-sm [&_.ant-form-item-label>label]:font-medium [&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
          >
            <Tabs className="admin-about-tabs" items={tabs} />
          </Form>
        )}
      </div>
    </div>
  )
}
