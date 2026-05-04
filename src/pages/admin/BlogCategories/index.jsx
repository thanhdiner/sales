import { Button, Drawer, Form, Image, Input, InputNumber, Modal, Space, Switch, Table, Tag, Upload, message } from 'antd'
import { UploadCloud } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { uploadBlogMedia } from '@/services/admin/content/blog'
import { createBlogCategory, deleteBlogCategory, getBlogCategories, updateBlogCategory } from '@/services/admin/content/blogCategory'
import { translateContentToEnglish } from '@/services/admin/content/contentTranslation'
import '../Blog/index.scss'

const CATEGORY_TEXT = {
  vi: {
    title: 'Danh mục blog',
    description: 'Quản lý metadata danh mục blog',
    addCategory: 'Thêm danh mục',
    columns: {
      thumbnail: 'Ảnh',
      name: 'Tên',
      slug: 'Slug',
      sort: 'Sắp xếp',
      status: 'Trạng thái',
      actions: 'Thao tác'
    },
    status: { active: 'Hoạt động', disabled: 'Đã tắt' },
    actions: { edit: 'Sửa', disable: 'Tắt' },
    drawer: { add: 'Thêm danh mục', edit: 'Sửa danh mục' },
    fields: {
      name: 'Tên',
      slug: 'Slug',
      description: 'Mô tả',
      nameEn: 'Tên EN',
      descriptionEn: 'Mô tả EN',
      thumbnail: 'Ảnh',
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      sortOrder: 'Thứ tự',
      active: 'Hoạt động'
    },
    buttons: {
      translate: 'Tự động dịch',
      changeThumbnail: 'Đổi ảnh',
      uploadThumbnail: 'Tải ảnh',
      removeThumbnail: 'Xóa ảnh',
      save: 'Lưu'
    },
    confirm: { disableTitle: 'Tắt danh mục?' },
    messages: {
      loadFailed: 'Không tải được danh mục',
      imageOnly: 'Chỉ được tải lên file ảnh',
      thumbnailUploaded: 'Đã tải ảnh',
      uploadFailed: 'Tải ảnh thất bại',
      translated: 'Đã dịch',
      translateFailed: 'Dịch thất bại',
      saved: 'Đã lưu',
      saveFailed: 'Lưu thất bại',
      disabled: 'Đã tắt'
    }
  },
  en: {
    title: 'Blog Categories',
    description: 'Manage blog category metadata',
    addCategory: 'Add category',
    columns: {
      thumbnail: 'Thumbnail',
      name: 'Name',
      slug: 'Slug',
      sort: 'Sort',
      status: 'Status',
      actions: 'Actions'
    },
    status: { active: 'Active', disabled: 'Disabled' },
    actions: { edit: 'Edit', disable: 'Disable' },
    drawer: { add: 'Add category', edit: 'Edit category' },
    fields: {
      name: 'Name',
      slug: 'Slug',
      description: 'Description',
      nameEn: 'Name EN',
      descriptionEn: 'Description EN',
      thumbnail: 'Thumbnail',
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      sortOrder: 'Sort order',
      active: 'Active'
    },
    buttons: {
      translate: 'Auto translate',
      changeThumbnail: 'Change thumbnail',
      uploadThumbnail: 'Upload thumbnail',
      removeThumbnail: 'Remove thumbnail',
      save: 'Save'
    },
    confirm: { disableTitle: 'Disable category?' },
    messages: {
      loadFailed: 'Failed to load categories',
      imageOnly: 'Only image files are allowed',
      thumbnailUploaded: 'Thumbnail uploaded',
      uploadFailed: 'Upload failed',
      translated: 'Translated',
      translateFailed: 'Translate failed',
      saved: 'Saved',
      saveFailed: 'Save failed',
      disabled: 'Disabled'
    }
  }
}

const hasText = value => typeof value === 'string' && value.trim().length > 0

const getLocalizedCategoryName = (category, language) => {
  const translatedName = language === 'en' ? category?.translations?.en?.name : ''
  if (hasText(translatedName)) return translatedName
  return category?.name || '-'
}

export default function BlogCategories() {
  const [form] = Form.useForm()
  const language = useCurrentLanguage()
  const text = CATEGORY_TEXT[language]
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const savingRef = useRef(false)
  const actionRef = useRef(false)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await getBlogCategories()
      setItems(Array.isArray(response?.data) ? response.data : [])
    } catch {
      message.error(text.messages.loadFailed)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const openForm = item => {
    if (savingRef.current || actionRef.current) return
    setEditing(item || null)
    form.resetFields()
    form.setFieldsValue(item || { isActive: true, sortOrder: null, thumbnail: '', seo: {}, translations: { en: { name: '', description: '' } } })
    setOpen(true)
  }

  const handleThumbnailUpload = async file => {
    if (!file.type?.startsWith('image/')) {
      message.error(text.messages.imageOnly)
      return Upload.LIST_IGNORE
    }

    setUploadingThumbnail(true)
    try {
      const response = await uploadBlogMedia(file)
      const url = response?.url || response?.data?.url || response?.asset?.url || ''
      if (!url) throw new Error('Missing upload URL')
      form.setFieldValue('thumbnail', url)
      form.setFieldValue(['seo', 'thumbnail'], url)
      message.success(text.messages.thumbnailUploaded)
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || text.messages.uploadFailed)
    } finally {
      setUploadingThumbnail(false)
    }

    return Upload.LIST_IGNORE
  }

  const handleAutoTranslate = async () => {
    setTranslating(true)
    try {
      const values = form.getFieldsValue(true)
      const response = await translateContentToEnglish({
        target: 'blog_category',
        payload: {
          name: values.name,
          description: values.description
        }
      })
      form.setFieldsValue({
        translations: {
          ...values.translations,
          en: {
            ...(values.translations?.en || {}),
            name: response?.data?.name || '',
            description: response?.data?.description || ''
          }
        }
      })
      message.success(text.messages.translated)
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || text.messages.translateFailed)
    } finally {
      setTranslating(false)
    }
  }

  const handleSubmit = async values => {
    if (savingRef.current) return
    savingRef.current = true
    setSaving(true)
    try {
      const payload = { ...values }
      if (!editing?._id && (payload.sortOrder === undefined || payload.sortOrder === null || payload.sortOrder === '')) delete payload.sortOrder
      if (editing?._id) await updateBlogCategory(editing._id, payload)
      else await createBlogCategory(payload)
      message.success({ content: text.messages.saved, key: 'blog-category-save' })
      closeForm()
      fetchItems()
    } catch (error) {
      message.error({ content: error?.response?.message || error?.response?.error || text.messages.saveFailed, key: 'blog-category-save' })
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const handleDelete = item => {
    if (actionRef.current) return
    Modal.confirm({
      title: text.confirm.disableTitle,
      onOk: async () => {
        if (actionRef.current) return
        actionRef.current = true
        setActionLoading(true)
        try {
          await deleteBlogCategory(item._id)
          message.success(text.messages.disabled)
          fetchItems()
        } finally {
          actionRef.current = false
          setActionLoading(false)
        }
      }
    })
  }

  const closeForm = () => {
    if (saving) return
    document.querySelector('.blog-category-drawer .ant-drawer-body')?.scrollTo({ top: 0 })
    setOpen(false)
  }

  return (
    <div className="p-6">
      <SEO title={text.title} noIndex />
      <div className="mb-4 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[var(--admin-text)]">{text.title}</h1><p className="text-[var(--admin-text-muted)]">{text.description}</p></div>
        <Button type="primary" disabled={saving || actionLoading} onClick={() => openForm(null)}>{text.addCategory}</Button>
      </div>
      <Table className="admin-blog-table" rowKey="_id" loading={loading} dataSource={items} rowClassName="[&>td]:!align-middle" columns={[
        { title: text.columns.thumbnail, dataIndex: 'thumbnail', width: 120, align: 'center', render: value => value ? <Image src={value} width={72} height={48} className="rounded object-cover" /> : '-' },
        { title: text.columns.name, dataIndex: 'name', align: 'center', render: (_, item) => getLocalizedCategoryName(item, language) },
        { title: text.columns.slug, dataIndex: 'slug', align: 'center' },
        { title: text.columns.sort, dataIndex: 'sortOrder', width: 90, align: 'center' },
        { title: text.columns.status, dataIndex: 'isActive', align: 'center', render: value => <Tag className="admin-blog-status-tag" color={value ? 'green' : 'default'}>{value ? text.status.active : text.status.disabled}</Tag> },
        { title: text.columns.actions, width: 180, align: 'center', render: (_, item) => <Space><Button className="admin-blog-table-btn" disabled={saving || actionLoading} onClick={() => openForm(item)}>{text.actions.edit}</Button><Button className="admin-blog-table-btn" danger loading={actionLoading} disabled={saving || actionLoading} onClick={() => handleDelete(item)}>{text.actions.disable}</Button></Space> }
      ]} />
      <Drawer title={editing ? text.drawer.edit : text.drawer.add} open={open} onClose={closeForm} rootClassName="blog-category-drawer" width={460}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} onFinishFailed={() => { savingRef.current = false; setSaving(false) }}>
          <Form.Item name="name" label={text.fields.name} rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label={text.fields.slug}><Input /></Form.Item>
          <Form.Item name="description" label={text.fields.description}><Input.TextArea rows={3} /></Form.Item>
          <Button className="mb-4" loading={translating} disabled={translating || saving} onClick={handleAutoTranslate}>{text.buttons.translate}</Button>
          <Form.Item name={['translations', 'en', 'name']} label={text.fields.nameEn}><Input /></Form.Item>
          <Form.Item name={['translations', 'en', 'description']} label={text.fields.descriptionEn}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item shouldUpdate={(previous, current) => previous.thumbnail !== current.thumbnail}>
            {() => {
              const thumbnail = form.getFieldValue('thumbnail')
              return (
                <div className="space-y-2">
                  <Form.Item name="thumbnail" label={text.fields.thumbnail} noStyle><Input type="hidden" /></Form.Item>
                  <div className="flex items-start gap-3">
                    {thumbnail ? <Image src={thumbnail} width={120} height={80} className="rounded object-cover" /> : null}
                    <div className="flex flex-col gap-2">
                      <Upload accept="image/*" showUploadList={false} beforeUpload={handleThumbnailUpload}>
                        <Button icon={<UploadCloud size={16} />} loading={uploadingThumbnail} disabled={saving}>{thumbnail ? text.buttons.changeThumbnail : text.buttons.uploadThumbnail}</Button>
                      </Upload>
                      {thumbnail ? <Button danger disabled={saving || uploadingThumbnail} onClick={() => form.setFieldValue('thumbnail', '')}>{text.buttons.removeThumbnail}</Button> : null}
                    </div>
                  </div>
                </div>
              )
            }}
          </Form.Item>
          <Form.Item name={['seo', 'title']} label={text.fields.seoTitle}><Input /></Form.Item>
          <Form.Item name={['seo', 'description']} label={text.fields.seoDescription}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="sortOrder" label={text.fields.sortOrder}><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="isActive" label={text.fields.active} valuePropName="checked"><Switch /></Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} disabled={saving} block>{text.buttons.save}</Button>
        </Form>
      </Drawer>
    </div>
  )
}
