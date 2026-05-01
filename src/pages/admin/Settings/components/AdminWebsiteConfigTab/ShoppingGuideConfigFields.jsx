import { Button, Checkbox, Form, Input } from 'antd'
import { BookOpen, CreditCard, HelpCircle, Languages, LifeBuoy, ListChecks, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input

const inputClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const dangerButtonClass =
  'rounded-lg !border-red-200 !bg-red-50 !text-red-600 hover:!border-red-300 hover:!bg-red-100 dark:!border-red-900/50 dark:!bg-red-950/30 dark:!text-red-300'

const guidePath = path => ['shoppingGuide', ...path]
const guideEnPath = path => ['shoppingGuide', 'translations', 'en', ...path]
const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')
const cloneValue = value => JSON.parse(JSON.stringify(value))

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

function LinesTextArea({ value, onChange, ...props }) {
  const textValue = Array.isArray(value) ? value.join('\n') : value || ''

  return <TextArea {...props} value={textValue} onChange={event => onChange?.(event.target.value.split('\n'))} />
}

function FieldSingle({ path, label, multiline = false, rows = 3, placeholder }) {
  const Control = multiline ? TextArea : Input

  return (
    <Form.Item label={label} name={guidePath(path)}>
      <Control className={inputClass} placeholder={placeholder} rows={rows} size={multiline ? undefined : 'large'} />
    </Form.Item>
  )
}

function FieldPair({ path, label, multiline = false, rows = 3, placeholderVi, placeholderEn }) {
  const Control = multiline ? TextArea : Input

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Form.Item label={`${label} (VI)`} name={guidePath(path)}>
        <Control className={inputClass} placeholder={placeholderVi} rows={rows} size={multiline ? undefined : 'large'} />
      </Form.Item>

      <Form.Item label={`${label} (EN)`} name={guideEnPath(path)}>
        <Control className={inputClass} placeholder={placeholderEn} rows={rows} size={multiline ? undefined : 'large'} />
      </Form.Item>
    </div>
  )
}

function LinesPair({ path, label, rows = 4, hint }) {
  return (
    <div>
      {hint && <p className="mb-2 text-xs leading-5 text-[var(--admin-text-subtle)]">{hint}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        <Form.Item label={`${label} (VI)`} name={guidePath(path)}>
          <LinesTextArea className={inputClass} rows={rows} />
        </Form.Item>

        <Form.Item label={`${label} (EN)`} name={guideEnPath(path)}>
          <LinesTextArea className={inputClass} rows={rows} />
        </Form.Item>
      </div>
    </div>
  )
}

function GuideList({ path, addLabel, emptyItem, emptyTranslation, children, text }) {
  const form = Form.useFormInstance()
  const listPath = guidePath(path)
  const enPath = guideEnPath(path)

  const removePairedItem = (index, remove) => {
    remove(index)

    const enItems = form.getFieldValue(enPath)
    if (Array.isArray(enItems)) {
      form.setFieldValue(
        enPath,
        enItems.filter((_, itemIndex) => itemIndex !== index)
      )
    }
  }

  const addPairedItem = add => {
    add(cloneValue(emptyItem))

    const enItems = form.getFieldValue(enPath)
    form.setFieldValue(enPath, [...(Array.isArray(enItems) ? enItems : []), cloneValue(emptyTranslation)])
  }

  return (
    <Form.List name={listPath}>
      {(fields, { add, remove }) => (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.key} className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--admin-text)]">
                  {text('Mục', 'Item')} {index + 1}
                </p>
                <Button
                  htmlType="button"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => removePairedItem(index, remove)}
                  className={dangerButtonClass}
                >
                  {text('Xóa', 'Delete')}
                </Button>
              </div>

              {children({ field, index, path, enPath })}
            </div>
          ))}

          <Button
            htmlType="button"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => addPairedItem(add)}
            className={secondaryButtonClass}
          >
            {addLabel}
          </Button>
        </div>
      )}
    </Form.List>
  )
}

function GuideListFieldPair({ basePath, enBasePath, name, label, multiline = false, rows = 3 }) {
  const Control = multiline ? TextArea : Input

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Form.Item label={`${label} (VI)`} name={[name]}>
        <Control className={inputClass} rows={rows} size={multiline ? undefined : 'large'} />
      </Form.Item>

      <Form.Item label={`${label} (EN)`} name={[...enBasePath, name]}>
        <Control className={inputClass} rows={rows} size={multiline ? undefined : 'large'} />
      </Form.Item>
    </div>
  )
}

function GuideListLinesPair({ enBasePath, name, label, rows = 4, hint }) {
  return (
    <div>
      {hint && <p className="mb-2 text-xs leading-5 text-[var(--admin-text-subtle)]">{hint}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        <Form.Item label={`${label} (VI)`} name={[name]}>
          <LinesTextArea className={inputClass} rows={rows} />
        </Form.Item>

        <Form.Item label={`${label} (EN)`} name={[...enBasePath, name]}>
          <LinesTextArea className={inputClass} rows={rows} />
        </Form.Item>
      </div>
    </div>
  )
}

function GuideListFieldSingle({ name, label, multiline = false, rows = 3 }) {
  const Control = multiline ? TextArea : Input

  return (
    <Form.Item label={label} name={[name]}>
      <Control className={inputClass} rows={rows} size={multiline ? undefined : 'large'} />
    </Form.Item>
  )
}

function GuideListCheckbox({ name, label }) {
  return (
    <Form.Item name={[name]} valuePropName="checked" className="mb-0">
      <Checkbox className="text-[var(--admin-text-muted)]">{label}</Checkbox>
    </Form.Item>
  )
}

export default function ShoppingGuideConfigFields() {
  const { i18n } = useTranslation('adminSettings')
  const text = (vi, en) => (isEnglishLanguage(i18n.resolvedLanguage || i18n.language) ? en : vi)

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 text-sm leading-6 text-[var(--admin-text-muted)] shadow-[var(--admin-shadow)]">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
            <Languages className="h-4 w-4" />
          </div>
          <p className="mb-0">
            {text(
              'Nội dung bên trái là tiếng Việt gốc. Cột EN là bản dịch tiếng Anh sẽ được hiển thị khi người dùng đổi ngôn ngữ.',
              'The left side stores the Vietnamese base content. The EN column is shown when customers switch to English.'
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsPanel
          title={text('SEO & hero', 'SEO & hero')}
          description={text('Tiêu đề trình duyệt và phần mở đầu của trang hướng dẫn.', 'Browser metadata and the opening section.')}
          Icon={BookOpen}
        >
          <FieldPair path={['seo', 'title']} label={text('SEO title', 'SEO title')} />
          <FieldPair path={['seo', 'description']} label={text('SEO description', 'SEO description')} multiline rows={3} />
          <FieldPair path={['hero', 'eyebrow']} label={text('Nhãn nhỏ hero', 'Hero eyebrow')} />
          <FieldPair path={['hero', 'title']} label={text('Tiêu đề hero', 'Hero title')} />
          <FieldPair path={['hero', 'description']} label={text('Mô tả hero', 'Hero description')} multiline rows={3} />
          <FieldPair path={['hero', 'registerButton']} label={text('Nút đăng ký', 'Register button')} />
          <FieldPair path={['hero', 'guideButton']} label={text('Nút xem hướng dẫn', 'Guide button')} />
          <FieldPair path={['hero', 'imageAlt']} label={text('Alt ảnh hero', 'Hero image alt')} />
          <FieldSingle path={['hero', 'image']} label={text('URL ảnh hero', 'Hero image URL')} />
        </SettingsPanel>

        <SettingsPanel
          title={text('Mẹo & hỗ trợ', 'Tips & support')}
          description={text('Nội dung cuối trang và khối hỗ trợ khách hàng.', 'Final page content and customer support block.')}
          Icon={LifeBuoy}
        >
          <FieldPair path={['tipsSection', 'eyebrow']} label={text('Nhãn nhỏ mẹo', 'Tips eyebrow')} />
          <FieldPair path={['tipsSection', 'title']} label={text('Tiêu đề mẹo', 'Tips title')} />
          <FieldPair path={['tipsSection', 'description']} label={text('Mô tả mẹo', 'Tips description')} multiline rows={3} />
          <LinesPair
            path={['smartTips']}
            label={text('Danh sách mẹo', 'Tip list')}
            hint={text('Mỗi dòng là một mẹo.', 'Each line is one tip.')}
          />
          <FieldPair path={['tipsSection', 'imageAlt']} label={text('Alt ảnh mẹo', 'Tips image alt')} />
          <FieldSingle path={['tipsSection', 'image']} label={text('URL ảnh mẹo', 'Tips image URL')} />
          <FieldPair path={['supportSection', 'eyebrow']} label={text('Nhãn nhỏ hỗ trợ', 'Support eyebrow')} />
          <FieldPair path={['supportSection', 'title']} label={text('Tiêu đề hỗ trợ', 'Support title')} />
          <FieldPair path={['supportSection', 'phoneLabel']} label={text('Nhãn điện thoại', 'Phone label')} />
          <FieldPair path={['supportSection', 'emailLabel']} label={text('Nhãn email', 'Email label')} />
          <FieldPair path={['supportSection', 'timeLabel']} label={text('Nhãn thời gian', 'Hours label')} />
          <FieldPair path={['supportSection', 'workingTime']} label={text('Thời gian làm việc', 'Working hours')} />
          <FieldPair path={['supportSection', 'description']} label={text('Mô tả hỗ trợ', 'Support description')} multiline rows={3} />
          <FieldPair path={['supportSection', 'browseProducts']} label={text('Nút mua sắm', 'Shopping button')} />
          <FieldPair path={['supportSection', 'viewCoupons']} label={text('Nút khuyến mãi', 'Promotions button')} />
        </SettingsPanel>
      </div>

      <SettingsPanel
        title={text('Quy trình mua hàng', 'Shopping process')}
        description={text('Tiêu đề section và các bước thao tác chính.', 'Section heading and the main action steps.')}
        Icon={ListChecks}
      >
        <FieldPair path={['processSection', 'eyebrow']} label={text('Nhãn nhỏ', 'Eyebrow')} />
        <FieldPair path={['processSection', 'title']} label={text('Tiêu đề', 'Title')} />
        <div className="grid gap-3 md:grid-cols-3">
          <FieldPair path={['processSection', 'previous']} label={text('Nút quay lại', 'Previous button')} />
          <FieldPair path={['processSection', 'next']} label={text('Nút tiếp theo', 'Next button')} />
          <FieldPair path={['processSection', 'stepAria']} label={text('Aria bước', 'Step aria')} />
        </div>

        <GuideList
          path={['steps']}
          addLabel={text('Thêm bước', 'Add step')}
          emptyItem={{ title: '', content: '' }}
          emptyTranslation={{ title: '', content: '' }}
          text={text}
        >
          {({ enPath }) => (
            <>
              <GuideListFieldPair enBasePath={enPath} name="title" label={text('Tiêu đề bước', 'Step title')} />
              <GuideListFieldPair enBasePath={enPath} name="content" label={text('Mô tả bước', 'Step content')} multiline rows={3} />
            </>
          )}
        </GuideList>
      </SettingsPanel>

      <SettingsPanel
        title={text('Chi tiết từng bước', 'Detailed steps')}
        description={text('Các khối hướng dẫn lớn kèm ảnh minh họa.', 'Large guide blocks with illustration images.')}
        Icon={Sparkles}
      >
        <FieldPair path={['detailedStepsSection', 'eyebrow']} label={text('Nhãn nhỏ', 'Eyebrow')} />
        <FieldPair path={['detailedStepsSection', 'title']} label={text('Tiêu đề', 'Title')} />

        <GuideList
          path={['detailedSteps']}
          addLabel={text('Thêm bước chi tiết', 'Add detailed step')}
          emptyItem={{ id: '', title: '', description: '', chips: [], checks: [], note: '', image: '', reverse: false }}
          emptyTranslation={{ id: '', title: '', description: '', chips: [], checks: [], note: '' }}
          text={text}
        >
          {({ enPath }) => (
            <>
              <GuideListFieldPair enBasePath={enPath} name="id" label={text('Mã bước', 'Step label')} />
              <GuideListFieldPair enBasePath={enPath} name="title" label={text('Tiêu đề', 'Title')} />
              <GuideListFieldPair enBasePath={enPath} name="description" label={text('Mô tả', 'Description')} multiline rows={3} />
              <GuideListLinesPair
                enBasePath={enPath}
                name="chips"
                label={text('Nhãn chip', 'Chips')}
                rows={3}
                hint={text('Mỗi dòng là một chip.', 'Each line is one chip.')}
              />
              <GuideListLinesPair
                enBasePath={enPath}
                name="checks"
                label={text('Checklist', 'Checklist')}
                rows={3}
                hint={text('Mỗi dòng là một mục checklist.', 'Each line is one checklist item.')}
              />
              <GuideListFieldPair enBasePath={enPath} name="note" label={text('Ghi chú', 'Note')} multiline rows={3} />
              <GuideListFieldSingle name="image" label={text('URL ảnh', 'Image URL')} />
              <GuideListCheckbox name="reverse" label={text('Đảo vị trí ảnh/chữ trên desktop', 'Reverse image/text on desktop')} />
            </>
          )}
        </GuideList>
      </SettingsPanel>

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsPanel
          title={text('Thanh toán', 'Payment')}
          description={text('Section phương thức thanh toán và các thẻ phương thức.', 'Payment method section and method cards.')}
          Icon={CreditCard}
        >
          <FieldPair path={['paymentSection', 'eyebrow']} label={text('Nhãn nhỏ', 'Eyebrow')} />
          <FieldPair path={['paymentSection', 'title']} label={text('Tiêu đề', 'Title')} />
          <FieldPair path={['paymentSection', 'description']} label={text('Mô tả', 'Description')} multiline rows={3} />
          <FieldPair path={['paymentSection', 'popular']} label={text('Nhãn phổ biến', 'Popular label')} />
          <FieldPair path={['paymentSection', 'securityNote']} label={text('Ghi chú bảo mật', 'Security note')} multiline rows={3} />

          <GuideList
            path={['paymentMethods']}
            addLabel={text('Thêm phương thức', 'Add method')}
            emptyItem={{ name: '', desc: '', popular: false, badges: [] }}
            emptyTranslation={{ name: '', desc: '', badges: [] }}
            text={text}
          >
            {({ enPath }) => (
              <>
                <GuideListFieldPair enBasePath={enPath} name="name" label={text('Tên phương thức', 'Method name')} />
                <GuideListFieldPair enBasePath={enPath} name="desc" label={text('Mô tả', 'Description')} multiline rows={3} />
                <GuideListLinesPair
                  enBasePath={enPath}
                  name="badges"
                  label={text('Badge', 'Badges')}
                  rows={3}
                  hint={text('Mỗi dòng là một badge.', 'Each line is one badge.')}
                />
                <GuideListCheckbox name="popular" label={text('Đánh dấu phổ biến', 'Mark as popular')} />
              </>
            )}
          </GuideList>
        </SettingsPanel>

        <SettingsPanel
          title={text('FAQ', 'FAQ')}
          description={text('Danh sách câu hỏi thường gặp trên trang hướng dẫn.', 'Frequently asked questions on the guide page.')}
          Icon={HelpCircle}
        >
          <FieldPair path={['faqSection', 'eyebrow']} label={text('Nhãn nhỏ', 'Eyebrow')} />
          <FieldPair path={['faqSection', 'title']} label={text('Tiêu đề', 'Title')} />
          <FieldPair path={['faqSection', 'toggle']} label={text('Aria mở/đóng', 'Toggle aria')} />

          <GuideList
            path={['faq']}
            addLabel={text('Thêm câu hỏi', 'Add question')}
            emptyItem={{ question: '', answer: '' }}
            emptyTranslation={{ question: '', answer: '' }}
            text={text}
          >
            {({ enPath }) => (
              <>
                <GuideListFieldPair enBasePath={enPath} name="question" label={text('Câu hỏi', 'Question')} />
                <GuideListFieldPair enBasePath={enPath} name="answer" label={text('Câu trả lời', 'Answer')} multiline rows={5} />
              </>
            )}
          </GuideList>
        </SettingsPanel>
      </div>
    </div>
  )
}