import { Button, Form, Input, Spin, Upload, message } from 'antd'
import {
  BarChart3,
  BookOpen,
  Eye,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Save,
  Search,
  Share2,
  Store,
  UploadCloud
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { editAdminWebsiteConfig } from '@/services/adminWebsiteConfigService'
import { fetchWebsiteConfig } from '@/stores/websiteConfigSlice'
import ShoppingGuideConfigFields from './ShoppingGuideConfigFields'
import { getShoppingGuideInitialValues } from './shoppingGuideConfig'
import SpecialPackageConfigFields from './SpecialPackageConfigFields'
import { getSpecialPackageInitialValues } from './specialPackageConfig'

const { TextArea } = Input
const WEBSITE_CONFIG_TAB_KEYS = ['basic', 'contact', 'seo', 'shopping-guide', 'special-package']
const inputClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass =
  'rounded-lg !border-none !bg-[var(--admin-accent)] font-semibold !text-white hover:!opacity-90'

function urlToFileList(url, name = 'image.jpg') {
  if (!url) return []
  return [
    {
      uid: '-1',
      name,
      status: 'done',
      url
    }
  ]
}

function getInitial(data) {
  if (!data) return {}
  return {
    ...data,
    shoppingGuide: getShoppingGuideInitialValues(data.shoppingGuide),
    specialPackage: getSpecialPackageInitialValues(data.specialPackage),
    logo: urlToFileList(data.logoUrl, 'logo.png'),
    favicon: urlToFileList(data.faviconUrl, 'favicon.png')
  }
}

function getFileListFromEvent(e) {
  return Array.isArray(e) ? e : e?.fileList
}

function beforeImageUpload(file, t) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) message.error(t('website.messages.imageOnly'))
  return isImage ? false : Upload.LIST_IGNORE
}

function SettingsPanel({ title, description, Icon, children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[var(--admin-text)]">{title}</h2>
          {description && <p className="mt-1 text-sm leading-5 text-[var(--admin-text-muted)]">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function UploadField({ name, label, requiredMessage, t }) {
  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={getFileListFromEvent}
      rules={[{ required: true, message: requiredMessage }]}
    >
      <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={file => beforeImageUpload(file, t)}>
        <div className="flex flex-col items-center gap-2 text-[var(--admin-text-muted)]">
          <UploadCloud className="h-5 w-5" />
          <span className="text-xs">{t('website.upload.label')}</span>
        </div>
      </Upload>
    </Form.Item>
  )
}

export default function WebsiteConfigTab() {
  const { t, i18n } = useTranslation('adminSettings')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const dispatch = useDispatch()
  const activeTab = WEBSITE_CONFIG_TAB_KEYS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'basic'
  const isEnglish = String(i18n.resolvedLanguage || i18n.language || '').toLowerCase().startsWith('en')
  const defaultText = (vi, en) => (isEnglish ? en : vi)

  const configTabs = useMemo(() => ([
    {
      key: 'basic',
      label: t('website.tabs.basic.label'),
      description: t('website.tabs.basic.description'),
      Icon: Store
    },
    {
      key: 'contact',
      label: t('website.tabs.contact.label'),
      description: t('website.tabs.contact.description'),
      Icon: Phone
    },
    {
      key: 'seo',
      label: t('website.tabs.seo.label'),
      description: t('website.tabs.seo.description'),
      Icon: Search
    },
    {
      key: 'shopping-guide',
      label: t('website.tabs.shoppingGuide.label', { defaultValue: defaultText('Hướng dẫn mua hàng', 'Shopping guide') }),
      description: t('website.tabs.shoppingGuide.description', { defaultValue: defaultText('Nội dung trang /shopping-guide', '/shopping-guide content') }),
      Icon: BookOpen
    },
    {
      key: 'special-package',
      label: t('website.tabs.specialPackage.label', { defaultValue: defaultText('Gói đặc biệt', 'Special package') }),
      description: t('website.tabs.specialPackage.description', { defaultValue: defaultText('Nội dung trang /special-package', '/special-package content') }),
      Icon: Package
    }
  ]), [defaultText, t])

  const handleTabChange = key => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('tab', key)
    setSearchParams(nextParams, { replace: true })
  }

  useEffect(() => {
    if (!websiteConfig) dispatch(fetchWebsiteConfig())
  }, [dispatch, websiteConfig])

  useEffect(() => {
    if (websiteConfig) form.setFieldsValue(getInitial(websiteConfig))
  }, [form, websiteConfig])

  const handleSave = async values => {
    try {
      setLoading(true)
      const formData = new FormData()

      const oldImages = []
      const deleteImages = []

      if (websiteConfig?.logoUrl) {
        oldImages.push(websiteConfig.logoUrl)
        deleteImages.push(!!(values.logo && values.logo[0]?.originFileObj))
      }
      if (websiteConfig?.faviconUrl) {
        oldImages.push(websiteConfig.faviconUrl)
        deleteImages.push(!!(values.favicon && values.favicon[0]?.originFileObj))
      }

      formData.append('oldImages', JSON.stringify(oldImages))
      formData.append('deleteImages', JSON.stringify(deleteImages))
      if (values.logo && values.logo[0]?.originFileObj) {
        formData.append('logo', values.logo[0].originFileObj)
      }
      if (values.favicon && values.favicon[0]?.originFileObj) {
        formData.append('favicon', values.favicon[0].originFileObj)
      }
      formData.append('siteName', values.siteName)
      formData.append('tagline', values.tagline)
      formData.append('description', values.description)
      formData.append('contactInfo', JSON.stringify(values.contactInfo || {}))
      formData.append('seoSettings', JSON.stringify(values.seoSettings || {}))
      formData.append('shoppingGuide', JSON.stringify(values.shoppingGuide || getShoppingGuideInitialValues()))
      formData.append('specialPackage', JSON.stringify(values.specialPackage || getSpecialPackageInitialValues()))

      await editAdminWebsiteConfig(formData)
      message.success(t('website.messages.saveSuccess'))
      dispatch(fetchWebsiteConfig())
    } catch (e) {
      message.error(t('website.messages.saveError'))
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => message.info(t('website.messages.previewComing'))

  const handleReset = () => {
    form.setFieldsValue(getInitial(websiteConfig))
    message.info(t('website.messages.resetDone'))
  }

  if (!websiteConfig) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] shadow-[var(--admin-shadow)]">
        <div className="text-center">
          <Spin />
          <p className="mt-3 text-sm">{t('website.messages.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-1.5 shadow-[var(--admin-shadow)] md:grid-cols-5">
        {configTabs.map(({ key, label, description, Icon }) => {
          const active = activeTab === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabChange(key)}
              className={`flex min-h-[62px] items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                active
                  ? 'bg-[var(--admin-accent)] text-white'
                  : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'bg-[var(--admin-surface-2)] text-[var(--admin-text-subtle)]'
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{label}</span>
                <span className={`mt-0.5 block text-xs ${active ? 'text-blue-100' : 'text-[var(--admin-text-subtle)]'}`}>
                  {description}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={getInitial(websiteConfig)}
        className="w-full [&_.ant-form-item-label>label]:text-sm [&_.ant-form-item-label>label]:font-medium [&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
      >
        {activeTab === 'basic' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <SettingsPanel
              title={t('website.panels.websiteInfo.title')}
              description={t('website.panels.websiteInfo.description')}
              Icon={Globe2}
            >
              <Form.Item name="siteName" label={t('website.fields.siteName.label')} rules={[{ required: true, message: t('website.fields.siteName.required') }]}>
                <Input className={inputClass} placeholder={t('website.fields.siteName.placeholder')} size="large" />
              </Form.Item>

              <Form.Item label={t('website.fields.tagline.label')} name="tagline">
                <Input className={inputClass} placeholder={t('website.fields.tagline.placeholder')} size="large" />
              </Form.Item>

              <Form.Item label={t('website.fields.description.label')} name="description">
                <TextArea className={inputClass} rows={5} placeholder={t('website.fields.description.placeholder')} />
              </Form.Item>
            </SettingsPanel>

            <SettingsPanel title={t('website.panels.branding.title')} description={t('website.panels.branding.description')} Icon={ImagePlus}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <UploadField name="logo" label={t('website.fields.logo.label')} requiredMessage={t('website.fields.logo.required')} t={t} />
                <UploadField name="favicon" label={t('website.fields.favicon.label')} requiredMessage={t('website.fields.favicon.required')} t={t} />
              </div>
              <p className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 text-xs leading-5 text-[var(--admin-text-muted)]">
                {t('website.panels.branding.hint')}
              </p>
            </SettingsPanel>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <SettingsPanel title={t('website.panels.contact.title')} description={t('website.panels.contact.description')} Icon={Phone}>
              <Form.Item label={t('website.fields.phone.label')} name={['contactInfo', 'phone']}>
                <Input
                  className={inputClass}
                  prefix={<Phone className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
                  placeholder={t('website.fields.phone.placeholder')}
                  size="large"
                />
              </Form.Item>

              <Form.Item label={t('website.fields.email.label')} name={['contactInfo', 'email']} rules={[{ type: 'email', message: t('website.fields.email.invalid') }]}>
                <Input
                  className={inputClass}
                  prefix={<Mail className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
                  placeholder={t('website.fields.email.placeholder')}
                  size="large"
                />
              </Form.Item>

              <Form.Item label={t('website.fields.address.label')} name={['contactInfo', 'address']}>
                <TextArea className={inputClass} rows={4} placeholder={t('website.fields.address.placeholder')} />
              </Form.Item>

              <Form.Item label={t('website.fields.website.label')} name={['contactInfo', 'website']}>
                <Input
                  className={inputClass}
                  prefix={<MapPin className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
                  placeholder={t('website.fields.website.placeholder')}
                  size="large"
                />
              </Form.Item>
            </SettingsPanel>

            <SettingsPanel title={t('website.panels.social.title')} description={t('website.panels.social.description')} Icon={Share2}>
              <Form.Item label={t('website.fields.facebook.label')} name={['contactInfo', 'socialMedia', 'facebook']}>
                <Input className={inputClass} placeholder={t('website.fields.facebook.placeholder')} size="large" />
              </Form.Item>

              <Form.Item label={t('website.fields.twitter.label')} name={['contactInfo', 'socialMedia', 'twitter']}>
                <Input className={inputClass} placeholder={t('website.fields.twitter.placeholder')} size="large" />
              </Form.Item>

              <Form.Item label={t('website.fields.instagram.label')} name={['contactInfo', 'socialMedia', 'instagram']}>
                <Input className={inputClass} placeholder={t('website.fields.instagram.placeholder')} size="large" />
              </Form.Item>

              <Form.Item label={t('website.fields.linkedin.label')} name={['contactInfo', 'socialMedia', 'linkedin']}>
                <Input className={inputClass} placeholder={t('website.fields.linkedin.placeholder')} size="large" />
              </Form.Item>
            </SettingsPanel>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <SettingsPanel title={t('website.panels.seo.title')} description={t('website.panels.seo.description')} Icon={Search}>
              <Form.Item label={t('website.fields.metaTitle.label')} name={['seoSettings', 'metaTitle']}>
                <Input className={inputClass} placeholder={t('website.fields.metaTitle.placeholder')} size="large" showCount maxLength={60} />
              </Form.Item>

              <Form.Item label={t('website.fields.metaDescription.label')} name={['seoSettings', 'metaDescription']}>
                <TextArea className={inputClass} rows={4} placeholder={t('website.fields.metaDescription.placeholder')} showCount maxLength={160} />
              </Form.Item>

              <Form.Item label={t('website.fields.keywords.label')} name={['seoSettings', 'keywords']}>
                <Input className={inputClass} placeholder={t('website.fields.keywords.placeholder')} size="large" />
              </Form.Item>
            </SettingsPanel>

            <SettingsPanel title={t('website.panels.analytics.title')} description={t('website.panels.analytics.description')} Icon={BarChart3}>
              <Form.Item label={t('website.fields.googleAnalytics.label')} name={['seoSettings', 'googleAnalytics']}>
                <Input className={inputClass} placeholder={t('website.fields.googleAnalytics.placeholder')} size="large" />
              </Form.Item>
            </SettingsPanel>
          </div>
        )}

        {activeTab === 'shopping-guide' && <ShoppingGuideConfigFields />}

        {activeTab === 'special-package' && <SpecialPackageConfigFields />}

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:flex-row sm:items-center sm:justify-between">
          <Button
            icon={<Eye className="h-4 w-4" />}
            size="large"
            onClick={handlePreview}
            disabled={loading}
            className={secondaryButtonClass}
          >
            {t('website.actions.preview')}
          </Button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              icon={<RefreshCw className="h-4 w-4" />}
              size="large"
              disabled={loading}
              onClick={handleReset}
              className={secondaryButtonClass}
            >
              {t('website.actions.reset')}
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<Save className="h-4 w-4" />}
              size="large"
              loading={loading}
              className={primaryButtonClass}
            >
              {t('website.actions.save')}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
