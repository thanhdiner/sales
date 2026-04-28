import { Button, Card, DatePicker, Form, Image, Input, Modal, Select, Space, Switch, Table, Tabs, Tag, Tooltip, Upload, message } from 'antd'
import dayjs from 'dayjs'
import { CalendarDays, Eye, Pencil, Plus, RefreshCw, Save, Search, Star, Trash2, UploadCloud } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  getAdminBlogPosts,
  updateAdminBlogPost
} from '@/services/adminBlogService'
import './AdminBlogPage.scss'

const { TextArea } = Input

const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'
const PAGE_SIZE_OPTIONS = [10, 20, 50]
const MAX_IMAGE_SIZE_MB = 5

const defaultFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  tags: [],
  status: 'draft',
  isFeatured: false,
  publishedAt: null,
  thumbnail: [],
  translations: {
    en: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: []
    }
  }
}

const statusColor = {
  published: 'green',
  queued: 'blue',
  archived: 'volcano',
  draft: 'default'
}

const hasText = value => typeof value === 'string' && value.trim().length > 0

function getLocalizedPost(post, language) {
  if (language !== 'en') return post

  const translation = post?.translations?.en || {}

  return {
    ...post,
    title: hasText(translation.title) ? translation.title : post.title,
    excerpt: hasText(translation.excerpt) ? translation.excerpt : post.excerpt,
    content: hasText(translation.content) ? translation.content : post.content,
    category: hasText(translation.category) ? translation.category : post.category,
    tags: Array.isArray(translation.tags) && translation.tags.length > 0 ? translation.tags : post.tags
  }
}

function formatDate(value, language) {
  if (!value) return ''

  try {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value))
  } catch {
    return ''
  }
}

function getUploadFileList(post) {
  if (!post?.thumbnail) return []

  return [
    {
      uid: post._id || 'thumbnail',
      name: 'thumbnail',
      status: 'done',
      url: post.thumbnail
    }
  ]
}

function appendFormData(formData, key, value) {
  if (value === undefined || value === null) {
    formData.append(key, '')
    return
  }

  formData.append(key, value)
}

export default function AdminBlogPage() {
  const { t } = useTranslation('adminBlog')
  const language = useCurrentLanguage()
  const [form] = Form.useForm()
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({ keyword: '', status: '', category: '' })
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [fileList, setFileList] = useState([])
  const [oldThumbnail, setOldThumbnail] = useState('')
  const [thumbnailToDelete, setThumbnailToDelete] = useState('')

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getAdminBlogPosts({
        ...filters,
        page: pagination.current,
        limit: pagination.pageSize
      })

      setPosts(Array.isArray(response?.data) ? response.data : [])
      setTotal(Number(response?.total || 0))
    } catch {
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.current, pagination.pageSize, t])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const categoryOptions = useMemo(() => {
    const categories = posts
      .map(post => getLocalizedPost(post, language).category)
      .filter(hasText)

    return Array.from(new Set(categories)).map(category => ({
      value: category,
      label: category
    }))
  }, [language, posts])

  const stats = useMemo(() => ({
    total,
    published: posts.filter(post => post.status === 'published').length,
    draft: posts.filter(post => post.status !== 'published').length,
    featured: posts.filter(post => post.isFeatured).length
  }), [posts, total])

  const openModal = post => {
    const uploadFileList = getUploadFileList(post)

    setEditingPost(post || null)
    setFileList(uploadFileList)
    setOldThumbnail(post?.thumbnail || '')
    setThumbnailToDelete('')
    form.resetFields()

    if (post) {
      form.setFieldsValue({
        ...defaultFormValues,
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
        thumbnail: uploadFileList,
        publishedAt: post.publishedAt ? dayjs(post.publishedAt) : null,
        translations: {
          en: {
            title: post.translations?.en?.title || '',
            excerpt: post.translations?.en?.excerpt || '',
            content: post.translations?.en?.content || '',
            category: post.translations?.en?.category || '',
            tags: Array.isArray(post.translations?.en?.tags) ? post.translations.en.tags : []
          }
        }
      })
    } else {
      form.setFieldsValue(defaultFormValues)
    }

    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPost(null)
    setFileList([])
    setOldThumbnail('')
    setThumbnailToDelete('')
    form.resetFields()
  }

  const handleFilterChange = changedValues => {
    setFilters(current => ({
      ...current,
      ...changedValues
    }))
    setPagination(current => ({ ...current, current: 1 }))
  }

  const handleResetFilters = () => {
    setFilters({ keyword: '', status: '', category: '' })
    setPagination(current => ({ ...current, current: 1 }))
  }

  const handleBeforeUpload = file => {
    const isImage = file.type?.startsWith('image/')
    const isSmallEnough = file.size / 1024 / 1024 < MAX_IMAGE_SIZE_MB

    if (!isImage) {
      message.error(t('messages.imageOnly'))
      return Upload.LIST_IGNORE
    }

    if (!isSmallEnough) {
      message.error(t('messages.imageTooLarge', { size: MAX_IMAGE_SIZE_MB }))
      return Upload.LIST_IGNORE
    }

    setThumbnailToDelete('')
    return false
  }

  const handleUploadChange = ({ fileList: nextFileList }) => {
    setFileList(nextFileList.slice(-1))
  }

  const handleUploadRemove = file => {
    if (file.url && oldThumbnail) {
      setThumbnailToDelete(oldThumbnail)
    }

    setFileList([])
    return true
  }

  const handleSubmit = async values => {
    setSaving(true)

    try {
      const formValues = {
        ...values,
        ...form.getFieldsValue(true)
      }
      const formData = new FormData()
      const publishedAt = formValues.publishedAt?.toISOString?.() || ''
      const thumbnailFile = fileList[0]?.originFileObj

      appendFormData(formData, 'title', formValues.title)
      appendFormData(formData, 'slug', formValues.slug)
      appendFormData(formData, 'excerpt', formValues.excerpt)
      appendFormData(formData, 'content', formValues.content)
      appendFormData(formData, 'category', formValues.category)
      appendFormData(formData, 'tags', JSON.stringify(formValues.tags || []))
      appendFormData(formData, 'status', formValues.status)
      appendFormData(formData, 'isFeatured', formValues.isFeatured ? 'true' : 'false')
      appendFormData(formData, 'publishedAt', publishedAt)
      appendFormData(formData, 'translations', JSON.stringify(formValues.translations || defaultFormValues.translations))

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile)
        if (oldThumbnail) formData.append('oldImage', oldThumbnail)
      } else if (thumbnailToDelete) {
        formData.append('oldImage', thumbnailToDelete)
        formData.append('deleteImage', 'true')
        formData.append('thumbnail', '')
      }

      if (editingPost) {
        await updateAdminBlogPost(editingPost._id, formData)
        message.success(t('messages.updateSuccess'))
      } else {
        await createAdminBlogPost(formData)
        message.success(t('messages.createSuccess'))
      }

      await fetchPosts()
      closeModal()
    } catch (error) {
      if (error?.errorFields) return
      message.error(error?.response?.details?.suggestedSlug
        ? t('messages.slugExists', { slug: error.response.details.suggestedSlug })
        : t('messages.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = post => {
    Modal.confirm({
      className: 'admin-blog-confirm-modal',
      wrapClassName: 'admin-blog-confirm-modal',
      title: t('confirm.deleteTitle'),
      content: t('confirm.deleteContent', { title: post.title }),
      okText: t('confirm.deleteOk'),
      cancelText: t('confirm.cancel'),
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteAdminBlogPost(post._id)
          message.success(t('messages.deleteSuccess'))
          await fetchPosts()
        } catch {
          message.error(t('messages.deleteError'))
        }
      }
    })
  }

  const columns = useMemo(() => [
    {
      title: t('table.columns.post'),
      key: 'post',
      width: 360,
      render: (_, post) => {
        const localizedPost = getLocalizedPost(post, language)

        return (
          <div className="admin-blog-post-cell">
            <Image
              src={post.thumbnail || FALLBACK_IMAGE}
              width={72}
              height={54}
              preview={false}
              className="admin-blog-post-cell__image"
            />
            <div className="admin-blog-post-cell__body">
              <div className="admin-blog-post-cell__title">{localizedPost.title}</div>
              <div className="admin-blog-post-cell__slug">/{post.slug}</div>
            </div>
          </div>
        )
      }
    },
    {
      title: t('table.columns.category'),
      key: 'category',
      width: 180,
      render: (_, post) => {
        const localizedPost = getLocalizedPost(post, language)
        return localizedPost.category ? <span>{localizedPost.category}</span> : <span className="admin-blog-muted">{t('table.emptyValue')}</span>
      }
    },
    {
      title: t('table.columns.status'),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: status => (
        <Tag color={statusColor[status] || 'default'} className="admin-blog-status-tag">
          {t(`status.${status || 'draft'}`)}
        </Tag>
      )
    },
    {
      title: t('table.columns.featured'),
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      width: 130,
      render: value => value ? (
        <Tag color="gold" icon={<Star className="admin-blog-tag-icon" />}>{t('table.featured')}</Tag>
      ) : (
        <span className="admin-blog-muted">{t('table.normal')}</span>
      )
    },
    {
      title: t('table.columns.publishedAt'),
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 190,
      render: value => value ? (
        <span className="admin-blog-date">
          <CalendarDays className="admin-blog-date__icon" />
          {formatDate(value, language)}
        </span>
      ) : (
        <span className="admin-blog-muted">{t('table.notPublished')}</span>
      )
    },
    {
      title: t('table.columns.actions'),
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, post) => (
        <Space size="small">
          <Tooltip title={t('table.actions.edit')}>
            <Button icon={<Pencil className="admin-blog-button-icon" />} onClick={() => openModal(post)} className="admin-blog-table-btn" />
          </Tooltip>
          <Tooltip title={t('table.actions.delete')}>
            <Button danger icon={<Trash2 className="admin-blog-button-icon" />} onClick={() => handleDelete(post)} className="admin-blog-table-btn" />
          </Tooltip>
        </Space>
      )
    }
  ], [language, t])

  const tabItems = [
    {
      key: 'vi',
      label: t('form.tabs.vi'),
      forceRender: true,
      children: (
        <div className="admin-blog-form-grid">
          <Form.Item label={t('form.title')} name="title" rules={[{ required: true, message: t('form.titleRequired') }]}>
            <Input size="large" placeholder={t('form.titlePlaceholder')} />
          </Form.Item>
          <Form.Item label={t('form.slug')} name="slug" extra={t('form.slugHint')}>
            <Input size="large" placeholder={t('form.slugPlaceholder')} />
          </Form.Item>
          <Form.Item label={t('form.excerpt')} name="excerpt">
            <TextArea rows={3} placeholder={t('form.excerptPlaceholder')} />
          </Form.Item>
          <Form.Item label={t('form.content')} name="content">
            <TextArea rows={8} placeholder={t('form.contentPlaceholder')} />
          </Form.Item>
          <div className="admin-blog-form-grid admin-blog-form-grid--two">
            <Form.Item label={t('form.category')} name="category">
              <Input size="large" placeholder={t('form.categoryPlaceholder')} />
            </Form.Item>
            <Form.Item label={t('form.tags')} name="tags">
              <Select mode="tags" size="large" tokenSeparators={[',']} placeholder={t('form.tagsPlaceholder')} />
            </Form.Item>
          </div>
        </div>
      )
    },
    {
      key: 'en',
      label: t('form.tabs.en'),
      forceRender: true,
      children: (
        <div className="admin-blog-form-grid">
          <Form.Item label={t('form.translations.title')} name={['translations', 'en', 'title']}>
            <Input size="large" placeholder={t('form.translations.titlePlaceholder')} />
          </Form.Item>
          <Form.Item label={t('form.translations.excerpt')} name={['translations', 'en', 'excerpt']}>
            <TextArea rows={3} placeholder={t('form.translations.excerptPlaceholder')} />
          </Form.Item>
          <Form.Item label={t('form.translations.content')} name={['translations', 'en', 'content']}>
            <TextArea rows={8} placeholder={t('form.translations.contentPlaceholder')} />
          </Form.Item>
          <div className="admin-blog-form-grid admin-blog-form-grid--two">
            <Form.Item label={t('form.translations.category')} name={['translations', 'en', 'category']}>
              <Input size="large" placeholder={t('form.translations.categoryPlaceholder')} />
            </Form.Item>
            <Form.Item label={t('form.translations.tags')} name={['translations', 'en', 'tags']}>
              <Select mode="tags" size="large" tokenSeparators={[',']} placeholder={t('form.translations.tagsPlaceholder')} />
            </Form.Item>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="admin-blog-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-4 sm:p-5 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl space-y-5">
        <div className="admin-blog-header">
          <div>
            <p className="admin-blog-eyebrow">{t('page.eyebrow')}</p>
            <h1 className="admin-blog-title">{t('page.title')}</h1>
            <p className="admin-blog-description">{t('page.description')}</p>
          </div>

          <div className="admin-blog-header__actions">
            <Button icon={<Eye className="admin-blog-button-icon" />} onClick={() => window.open('/blog', '_blank', 'noopener,noreferrer')}>
              {t('page.previewButton')}
            </Button>
            <Button type="primary" icon={<Plus className="admin-blog-button-icon" />} onClick={() => openModal()}>
              {t('page.createButton')}
            </Button>
          </div>
        </div>

        <div className="admin-blog-stats">
          <Card><span>{t('stats.total')}</span><strong>{stats.total}</strong></Card>
          <Card><span>{t('stats.published')}</span><strong>{stats.published}</strong></Card>
          <Card><span>{t('stats.draft')}</span><strong>{stats.draft}</strong></Card>
          <Card><span>{t('stats.featured')}</span><strong>{stats.featured}</strong></Card>
        </div>

        <Card className="admin-blog-panel">
          <div className="admin-blog-toolbar">
            <Input
              allowClear
              prefix={<Search className="admin-blog-input-icon" />}
              value={filters.keyword}
              onChange={event => handleFilterChange({ keyword: event.target.value })}
              placeholder={t('filters.keyword')}
            />
            <Select
              allowClear
              value={filters.status || undefined}
              onChange={value => handleFilterChange({ status: value || '' })}
              placeholder={t('filters.status')}
              options={[
                { value: 'draft', label: t('status.draft') },
                { value: 'queued', label: t('status.queued') },
                { value: 'published', label: t('status.published') },
                { value: 'archived', label: t('status.archived') }
              ]}
            />
            <Select
              allowClear
              showSearch
              value={filters.category || undefined}
              onChange={value => handleFilterChange({ category: value || '' })}
              placeholder={t('filters.category')}
              options={categoryOptions}
            />
            <Button icon={<RefreshCw className="admin-blog-button-icon" />} onClick={handleResetFilters}>
              {t('filters.reset')}
            </Button>
          </div>

          <Table
            rowKey="_id"
            dataSource={posts}
            columns={columns}
            loading={loading}
            scroll={{ x: 1150 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
              showTotal: (currentTotal, range) => t('table.showTotal', {
                rangeStart: range[0] || 0,
                rangeEnd: range[1] || 0,
                total: currentTotal
              })
            }}
            onChange={nextPagination => {
              setPagination({
                current: nextPagination.current || 1,
                pageSize: nextPagination.pageSize || 10
              })
            }}
            className="admin-blog-table"
          />
        </Card>
      </div>

      <Modal
        className="admin-blog-modal"
        rootClassName="admin-blog-modal"
        title={editingPost ? t('form.editTitle') : t('form.createTitle')}
        open={modalOpen}
        width={920}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={editingPost ? t('form.saveSubmit') : t('form.createSubmit')}
        cancelText={t('form.cancel')}
        confirmLoading={saving}
        destroyOnClose
        okButtonProps={{ icon: <Save className="admin-blog-button-icon" /> }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultFormValues}
          onFinish={handleSubmit}
          className="admin-blog-form"
        >
          <Tabs items={tabItems} />

          <div className="admin-blog-form-section">
            <div className="admin-blog-form-grid admin-blog-form-grid--three">
              <Form.Item label={t('form.status')} name="status" rules={[{ required: true }]}>
                <Select
                  size="large"
                  options={[
                    { value: 'draft', label: t('status.draft') },
                    { value: 'queued', label: t('status.queued') },
                    { value: 'published', label: t('status.published') },
                    { value: 'archived', label: t('status.archived') }
                  ]}
                />
              </Form.Item>

              <Form.Item label={t('form.publishedAt')} name="publishedAt">
                <DatePicker showTime size="large" className="admin-blog-date-picker" />
              </Form.Item>

              <Form.Item label={t('form.featured')} name="isFeatured" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>

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
                beforeUpload={handleBeforeUpload}
                onChange={handleUploadChange}
                onRemove={handleUploadRemove}
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
        </Form>
      </Modal>
    </div>
  )
}
