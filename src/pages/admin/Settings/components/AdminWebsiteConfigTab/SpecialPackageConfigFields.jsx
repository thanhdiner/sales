import { Checkbox, Form, Input } from 'antd'
import { Package, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input

const inputClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'

const specialPackagePath = path => ['specialPackage', ...path]
const specialPackageEnPath = path => ['specialPackage', 'translations', 'en', ...path]
const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

function SettingsPanel({ title, description, Icon, children }) {
  return (
    <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
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

function FieldPair({ path, label, multiline = false, rows = 3 }) {
  const Control = multiline ? TextArea : Input

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Form.Item label={`${label} (VI)`} name={specialPackagePath(path)}>
        <Control className={inputClass} rows={rows} size={multiline ? undefined : 'large'} />
      </Form.Item>

      <Form.Item label={`${label} (EN)`} name={specialPackageEnPath(path)}>
        <Control className={inputClass} rows={rows} size={multiline ? undefined : 'large'} />
      </Form.Item>
    </div>
  )
}

export default function SpecialPackageConfigFields() {
  const { i18n } = useTranslation('adminSettings')
  const text = (vi, en) => (isEnglishLanguage(i18n.resolvedLanguage || i18n.language) ? en : vi)

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <SettingsPanel
        title={text('SEO trang special package', 'Special package SEO')}
        description={text('Nội dung dùng cho metadata của trang /special-package.', 'Metadata content for /special-package.')}
        Icon={Search}
      >
        <FieldPair path={['seo', 'title']} label={text('SEO title', 'SEO title')} />
        <FieldPair path={['seo', 'description']} label={text('SEO description', 'SEO description')} multiline rows={4} />
        <Form.Item name={specialPackagePath(['noIndex'])} valuePropName="checked" className="mb-0">
          <Checkbox className="text-[var(--admin-text-muted)]">
            {text('Không cho công cụ tìm kiếm index trang này', 'Prevent search engines from indexing this page')}
          </Checkbox>
        </Form.Item>
      </SettingsPanel>

      <SettingsPanel
        title={text('Nội dung hiển thị', 'Visible content')}
        description={text('Các dòng nội dung đang hiển thị trong thẻ coming-soon.', 'Content shown in the coming-soon card.')}
        Icon={Package}
      >
        <FieldPair path={['eyebrow']} label={text('Nhãn nhỏ', 'Eyebrow')} />
        <FieldPair path={['title']} label={text('Tiêu đề', 'Title')} />
        <FieldPair path={['description']} label={text('Mô tả', 'Description')} multiline rows={4} />
        <FieldPair path={['note']} label={text('Ghi chú', 'Note')} multiline rows={3} />
      </SettingsPanel>
    </div>
  )
}
