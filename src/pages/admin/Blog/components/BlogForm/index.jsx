import { Button, Card, DatePicker, Form, Input, Select, Switch, Tabs, Upload } from 'antd'
import { ArrowLeft, Eye, Save, UploadCloud } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import TiptapEditor from '@/components/shared/TiptapEditor'
import {
  BLOG_FIELD_LIMITS,
  defaultFormValues,
  getBlogPopupContainer,
  getCharacterLimitHint,
  getHtmlTextLength
} from '../../blogFormUtils'

const { TextArea } = Input

export default function BlogForm({
  form,
  mode,
  saving,
  loading = false,
  fileList,
  onSubmit,
  onCancel,
  onUploadMedia,
  beforeUploadThumbnail,
  onThumbnailChange,
  onThumbnailRemove
}) {
  const { t } = useTranslation('adminBlog')

  const tabItems = [
    {
      key: 'vi',
      label: t('form.tabs.vi'),
      forceRender: true,
      children: (
        <div className="admin-blog-form-grid">
          <Form.Item label={t('form.title')} name="title" rules={[{ required: true, message: t('form.titleRequired') }]} extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.title)}>
            <Input size="large" placeholder={t('form.titlePlaceholder')} maxLength={BLOG_FIELD_LIMITS.title} showCount />
          </Form.Item>
          <Form.Item label={t('form.excerpt')} name="excerpt" extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.excerpt)}>
            <TextArea rows={3} placeholder={t('form.excerptPlaceholder')} maxLength={BLOG_FIELD_LIMITS.excerpt} showCount />
          </Form.Item>
          <Form.Item
            label={t('form.content')}
            name="content"
            extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.content)}
            rules={[{
              validator: (_, value) => getHtmlTextLength(value) <= BLOG_FIELD_LIMITS.content
                ? Promise.resolve()
                : Promise.reject(new Error(t('form.characterLimitExceeded', { max: BLOG_FIELD_LIMITS.content })))
            }]}
          >
            <TiptapEditor placeholder={t('form.contentPlaceholder')} maxLength={BLOG_FIELD_LIMITS.content} onUploadMedia={onUploadMedia} />
          </Form.Item>
        </div>
      )
    },
    {
      key: 'en',
      label: t('form.tabs.en'),
      forceRender: true,
      children: (
        <div className="admin-blog-form-grid">
          <Form.Item label={t('form.translations.title')} name={['translations', 'en', 'title']} extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.title)}>
            <Input size="large" placeholder={t('form.translations.titlePlaceholder')} maxLength={BLOG_FIELD_LIMITS.title} showCount />
          </Form.Item>
          <Form.Item label={t('form.translations.excerpt')} name={['translations', 'en', 'excerpt']} extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.excerpt)}>
            <TextArea rows={3} placeholder={t('form.translations.excerptPlaceholder')} maxLength={BLOG_FIELD_LIMITS.excerpt} showCount />
          </Form.Item>
          <Form.Item
            label={t('form.translations.content')}
            name={['translations', 'en', 'content']}
            extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.content)}
            rules={[{
              validator: (_, value) => getHtmlTextLength(value) <= BLOG_FIELD_LIMITS.content
                ? Promise.resolve()
                : Promise.reject(new Error(t('form.characterLimitExceeded', { max: BLOG_FIELD_LIMITS.content })))
            }]}
          >
            <TiptapEditor placeholder={t('form.translations.contentPlaceholder')} maxLength={BLOG_FIELD_LIMITS.content} onUploadMedia={onUploadMedia} />
          </Form.Item>
        </div>
      )
    }
  ]

  return (
    <div className="admin-blog-edit-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="admin-blog-edit-header">
          <div className="admin-blog-edit-header__title">
            <Button type="text" icon={<ArrowLeft className="admin-blog-button-icon" />} onClick={onCancel} className="admin-blog-edit-header__back">
              Blog / News / {mode === 'edit' ? t('form.editTitle') : t('form.createTitle')}
            </Button>
          </div>
          <div className="admin-blog-edit-header__actions">
            <Button icon={<Eye className="admin-blog-button-icon" />} onClick={() => window.open('/blog', '_blank', 'noopener,noreferrer')}>
              {t('page.previewButton')}
            </Button>
            <Button type="primary" icon={<Save className="admin-blog-button-icon" />} loading={saving || loading} onClick={() => form.submit()}>
              {mode === 'edit' ? t('form.saveSubmit') : t('form.createSubmit')}
            </Button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={defaultFormValues}
          onFinish={onSubmit}
          className="admin-blog-form admin-blog-form--page"
        >
          <div className="admin-blog-form-layout">
            <main className="admin-blog-form-main">
              <article className="admin-blog-document-canvas">
                <Tabs items={tabItems} />
              </article>
            </main>

            <aside className="admin-blog-panel admin-blog-form-sidebar">
              <div className="admin-blog-form-sidebar__title">Settings</div>
              <div className="admin-blog-form-section">
                <div className="admin-blog-form-grid">
                  <Form.Item label={t('form.status')} name="status" rules={[{ required: true }]}>
                  <Select
                    size="large"
                    getPopupContainer={getBlogPopupContainer}
                    options={[
                      { value: 'draft', label: t('status.draft') },
                      { value: 'queued', label: t('status.queued') },
                      { value: 'published', label: t('status.published') },
                      { value: 'archived', label: t('status.archived') }
                    ]}
                  />
                </Form.Item>

                <Form.Item label={t('form.publishedAt')} name="publishedAt">
                  <DatePicker showTime size="large" className="admin-blog-date-picker" getPopupContainer={getBlogPopupContainer} />
                </Form.Item>

                  <Form.Item label={t('form.featured')} name="isFeatured" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </div>

                <Form.Item label={t('form.slug')} name="slug" extra={t('form.slugHint')}>
                  <Input placeholder={t('form.slugPlaceholder')} maxLength={BLOG_FIELD_LIMITS.slug} />
                </Form.Item>

                <Form.Item label={t('form.category')} name="category" extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.category)}>
                  <Input placeholder={t('form.categoryPlaceholder')} maxLength={BLOG_FIELD_LIMITS.category} showCount />
                </Form.Item>

                <Form.Item label={t('form.tags')} name="tags">
                  <Select mode="tags" tokenSeparators={[',']} placeholder={t('form.tagsPlaceholder')} getPopupContainer={getBlogPopupContainer} />
                </Form.Item>

                <Form.Item label={t('form.translations.category')} name={['translations', 'en', 'category']} extra={getCharacterLimitHint(BLOG_FIELD_LIMITS.category)}>
                  <Input placeholder={t('form.translations.categoryPlaceholder')} maxLength={BLOG_FIELD_LIMITS.category} showCount />
                </Form.Item>

                <Form.Item label={t('form.translations.tags')} name={['translations', 'en', 'tags']}>
                  <Select mode="tags" tokenSeparators={[',']} placeholder={t('form.translations.tagsPlaceholder')} getPopupContainer={getBlogPopupContainer} />
                </Form.Item>

                <Form.Item
                label={t('form.thumbnail')}
                name="thumbnail"
                valuePropName="fileList"
                getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={beforeUploadThumbnail}
                  onChange={onThumbnailChange}
                  onRemove={onThumbnailRemove}
                  fileList={fileList}
                >
                  {fileList.length < 1 && (
                    <div className="admin-blog-upload-trigger">
                      <UploadCloud className="admin-blog-upload-trigger__icon" />
                      <span>{t('form.uploadThumbnail')}</span>
                    </div>
                  )}
                </Upload>
                </Form.Item>
              </div>
            </aside>
          </div>
        </Form>
      </div>
    </div>
  )
}
