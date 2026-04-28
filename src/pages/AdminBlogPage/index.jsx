import { Button, Card, Image, Input, Modal, Select, Space, Table, Tag, Tooltip, message } from 'antd'
import { CalendarDays, Eye, Pencil, Plus, RefreshCw, Search, Star, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { deleteAdminBlogPost, getAdminBlogPosts } from '@/services/adminBlogService'
import { FALLBACK_IMAGE, formatDate, getLocalizedPost, hasText, PAGE_SIZE_OPTIONS, statusColor } from './blogFormUtils'
import './AdminBlogPage.scss'

export default function AdminBlogPage() {
  const { t } = useTranslation('adminBlog')
  const language = useCurrentLanguage()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ keyword: '', status: '', category: '' })
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

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
            <Button icon={<Pencil className="admin-blog-button-icon" />} onClick={() => navigate(`/admin/blog/edit/${post._id}`)} className="admin-blog-table-btn" />
          </Tooltip>
          <Tooltip title={t('table.actions.delete')}>
            <Button danger icon={<Trash2 className="admin-blog-button-icon" />} onClick={() => handleDelete(post)} className="admin-blog-table-btn" />
          </Tooltip>
        </Space>
      )
    }
  ], [language, navigate, t])

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
            <Button type="primary" icon={<Plus className="admin-blog-button-icon" />} onClick={() => navigate('/admin/blog/create')}>
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
    </div>
  )
}
