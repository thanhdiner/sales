import { Button, Form, Input, Spin, Upload, message } from 'antd'
import {
  BarChart3,
  Eye,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
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
import { useSearchParams } from 'react-router-dom'

import { editAdminWebsiteConfig } from '@/services/adminWebsiteConfigService'
import { fetchWebsiteConfig } from '@/stores/websiteConfigSlice'

const { TextArea } = Input
const WEBSITE_CONFIG_TAB_KEYS = ['basic', 'contact', 'seo']
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
    logo: urlToFileList(data.logoUrl, 'logo.png'),
    favicon: urlToFileList(data.faviconUrl, 'favicon.png')
  }
}

function getFileListFromEvent(e) {
  return Array.isArray(e) ? e : e?.fileList
}

function beforeImageUpload(file) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) message.error('Chỉ hỗ trợ file hình ảnh')
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

function UploadField({ name, label, requiredMessage }) {
  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={getFileListFromEvent}
      rules={[{ required: true, message: requiredMessage }]}
    >
      <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeImageUpload}>
        <div className="flex flex-col items-center gap-2 text-[var(--admin-text-muted)]">
          <UploadCloud className="h-5 w-5" />
          <span className="text-xs">Tải lên</span>
        </div>
      </Upload>
    </Form.Item>
  )
}

export default function WebsiteConfigTab() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const dispatch = useDispatch()
  const activeTab = WEBSITE_CONFIG_TAB_KEYS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'basic'

  const configTabs = useMemo(() => ([
    {
      key: 'basic',
      label: 'Thông tin',
      description: 'Tên, mô tả, nhận diện',
      Icon: Store
    },
    {
      key: 'contact',
      label: 'Liên hệ',
      description: 'Kênh hỗ trợ và mạng xã hội',
      Icon: Phone
    },
    {
      key: 'seo',
      label: 'SEO',
      description: 'Meta và analytics',
      Icon: Search
    }
  ]), [])

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

      await editAdminWebsiteConfig(formData)
      message.success('Cấu hình đã được lưu thành công')
      dispatch(fetchWebsiteConfig())
    } catch (e) {
      message.error('Lưu cấu hình thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => message.info('Tính năng xem trước sẽ được bổ sung')

  const handleReset = () => {
    form.setFieldsValue(getInitial(websiteConfig))
    message.info('Đã hoàn tác các thay đổi')
  }

  if (!websiteConfig) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] shadow-[var(--admin-shadow)]">
        <div className="text-center">
          <Spin />
          <p className="mt-3 text-sm">Đang tải cấu hình...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-1.5 shadow-[var(--admin-shadow)] md:grid-cols-3">
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
              title="Thông tin website"
              description="Các nội dung xuất hiện ở tiêu đề, footer và metadata cơ bản."
              Icon={Globe2}
            >
              <Form.Item name="siteName" label="Tên website" rules={[{ required: true, message: 'Vui lòng nhập tên website' }]}>
                <Input className={inputClass} placeholder="Nhập tên website" size="large" />
              </Form.Item>

              <Form.Item label="Slogan / Tagline" name="tagline">
                <Input className={inputClass} placeholder="Nhập slogan của website" size="large" />
              </Form.Item>

              <Form.Item label="Mô tả website" name="description">
                <TextArea className={inputClass} rows={5} placeholder="Nhập mô tả ngắn về website" />
              </Form.Item>
            </SettingsPanel>

            <SettingsPanel title="Logo & favicon" description="Tải lên file hình ảnh dùng cho nhận diện website." Icon={ImagePlus}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <UploadField name="logo" label="Logo website" requiredMessage="Vui lòng upload logo" />
                <UploadField name="favicon" label="Favicon" requiredMessage="Vui lòng upload favicon" />
              </div>
              <p className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 text-xs leading-5 text-[var(--admin-text-muted)]">
                Khuyến nghị dùng ảnh nền trong suốt cho logo và favicon vuông để hiển thị tốt trên tab trình duyệt.
              </p>
            </SettingsPanel>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <SettingsPanel title="Thông tin liên hệ" description="Thông tin khách hàng nhìn thấy khi cần hỗ trợ." Icon={Phone}>
              <Form.Item label="Số điện thoại" name={['contactInfo', 'phone']}>
                <Input
                  className={inputClass}
                  prefix={<Phone className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
                  placeholder="Nhập số điện thoại"
                  size="large"
                />
              </Form.Item>

              <Form.Item label="Email" name={['contactInfo', 'email']} rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                <Input
                  className={inputClass}
                  prefix={<Mail className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
                  placeholder="support@example.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item label="Địa chỉ" name={['contactInfo', 'address']}>
                <TextArea className={inputClass} rows={4} placeholder="Nhập địa chỉ công ty / tổ chức" />
              </Form.Item>

              <Form.Item label="Website" name={['contactInfo', 'website']}>
                <Input
                  className={inputClass}
                  prefix={<MapPin className="mr-1 h-4 w-4 text-[var(--admin-text-subtle)]" />}
                  placeholder="https://example.com"
                  size="large"
                />
              </Form.Item>
            </SettingsPanel>

            <SettingsPanel title="Mạng xã hội" description="Liên kết tới các kênh truyền thông chính thức." Icon={Share2}>
              <Form.Item label="Facebook" name={['contactInfo', 'socialMedia', 'facebook']}>
                <Input className={inputClass} placeholder="https://facebook.com/yourpage" size="large" />
              </Form.Item>

              <Form.Item label="Twitter / X" name={['contactInfo', 'socialMedia', 'twitter']}>
                <Input className={inputClass} placeholder="https://x.com/youraccount" size="large" />
              </Form.Item>

              <Form.Item label="Instagram" name={['contactInfo', 'socialMedia', 'instagram']}>
                <Input className={inputClass} placeholder="https://instagram.com/youraccount" size="large" />
              </Form.Item>

              <Form.Item label="LinkedIn" name={['contactInfo', 'socialMedia', 'linkedin']}>
                <Input className={inputClass} placeholder="https://linkedin.com/company/yourcompany" size="large" />
              </Form.Item>
            </SettingsPanel>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <SettingsPanel title="Cài đặt SEO" description="Tối ưu nội dung hiển thị trên công cụ tìm kiếm." Icon={Search}>
              <Form.Item label="Meta title" name={['seoSettings', 'metaTitle']}>
                <Input className={inputClass} placeholder="Tiêu đề hiển thị trên Google" size="large" showCount maxLength={60} />
              </Form.Item>

              <Form.Item label="Meta description" name={['seoSettings', 'metaDescription']}>
                <TextArea className={inputClass} rows={4} placeholder="Mô tả hiển thị trên kết quả tìm kiếm" showCount maxLength={160} />
              </Form.Item>

              <Form.Item label="Keywords" name={['seoSettings', 'keywords']}>
                <Input className={inputClass} placeholder="từ khóa 1, từ khóa 2, từ khóa 3" size="large" />
              </Form.Item>
            </SettingsPanel>

            <SettingsPanel title="Analytics & tracking" description="Thông tin dùng cho theo dõi hiệu quả website." Icon={BarChart3}>
              <Form.Item label="Google Analytics ID" name={['seoSettings', 'googleAnalytics']}>
                <Input className={inputClass} placeholder="G-XXXXXXXXXX" size="large" />
              </Form.Item>
            </SettingsPanel>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:flex-row sm:items-center sm:justify-between">
          <Button
            icon={<Eye className="h-4 w-4" />}
            size="large"
            onClick={handlePreview}
            disabled={loading}
            className={secondaryButtonClass}
          >
            Xem trước
          </Button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              icon={<RefreshCw className="h-4 w-4" />}
              size="large"
              disabled={loading}
              onClick={handleReset}
              className={secondaryButtonClass}
            >
              Hoàn tác
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<Save className="h-4 w-4" />}
              size="large"
              loading={loading}
              className={primaryButtonClass}
            >
              Lưu cấu hình
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
