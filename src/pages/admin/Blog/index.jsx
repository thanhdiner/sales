import { Button, Card, Dropdown, Image, Modal, Select, Table, Tag, message } from 'antd'
import { StatCard, StatGrid } from '@/components/admin/ui'
import { Archive, CalendarDays, Eye, Layers3, MoreHorizontal, Pencil, Plus, RefreshCw, Send, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SearchInput from '@/components/shared/SearchInput'
import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { archiveBlogPost, deleteBlogPost, getBlogPosts, updateBlogPost } from '@/services/admin/content/blog'
import { FALLBACK_IMAGE, formatDate, getLocalizedPost, hasText, PAGE_SIZE_OPTIONS, statusColor } from './blogFormUtils'
import './index.scss'

function getAuthorName(post) {
  const author = post.updatedBy || post.createdBy || post.publishedBy
  if (!author) return ''
  if (typeof author === 'string') return author
  return author.fullName || author.name || author.username || author.email || author._id || ''
}

function formatNumber(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0))
}

export default function Blog() {
  const { t } = useTranslation('adminBlog')
  const language = useCurrentLanguage()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ keyword: '', status: '', category: '', author: '', sort: '' })
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getBlogPosts({
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
    const categories = posts.map(post => getLocalizedPost(post, language).category).filter(hasText)
    return Array.from(new Set(categories)).map(category => ({ value: category, label: category }))
  }, [language, posts])

  const authorOptions = useMemo(() => {
    const authors = posts.map(getAuthorName).filter(hasText)
    return Array.from(new Set(authors)).map(author => ({ value: author, label: author }))
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!filters.author) return posts
    return posts.filter(post => getAuthorName(post) === filters.author)
  }, [filters.author, posts])

  const stats = useMemo(() => ({
    total,
    published: posts.filter(post => post.status === 'published').length,
    draft: posts.filter(post => post.status === 'draft').length,
    queued: posts.filter(post => post.status === 'queued').length
  }), [posts, total])

  const handleFilterChange = changedValues => {
    setFilters(current => ({ ...current, ...changedValues }))
    setPagination(current => ({ ...current, current: 1 }))
  }

  const handleResetFilters = () => {
    setFilters({ keyword: '', status: '', category: '', author: '', sort: '' })
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
          await deleteBlogPost(post._id)
          message.success(t('messages.deleteSuccess'))
          await fetchPosts()
        } catch {
          message.error(t('messages.deleteError'))
        }
      }
    })
  }

  const handlePublish = async post => {
    try {
      await updateBlogPost(post._id, { status: 'published', reviewStatus: 'approved', publishedAt: new Date().toISOString() })
      message.success(t('messages.publishSuccess'))
      await fetchPosts()
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || t('messages.publishError'))
    }
  }

  const handleArchive = async post => {
    try {
      await archiveBlogPost(post._id)
      message.success(t('messages.archiveSuccess'))
      await fetchPosts()
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || t('messages.archiveError'))
    }
  }

  const columns = useMemo(() => [
    {
      title: t('table.columns.post'),
      key: 'post',
      width: 340,
      render: (_, post) => {
        const localizedPost = getLocalizedPost(post, language)
        return (
          <div className="admin-blog-post-cell">
            <Image src={post.thumbnail || FALLBACK_IMAGE} width={72} height={54} preview={false} className="admin-blog-post-cell__image" />
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
      width: 160,
      render: (_, post) => {
        const localizedPost = getLocalizedPost(post, language)
        return localizedPost.category ? <span>{localizedPost.category}</span> : <span className="admin-blog-muted">{t('table.emptyValue')}</span>
      }
    },
    {
      title: t('table.columns.author'),
      key: 'author',
      width: 170,
      render: (_, post) => (
        <span className="admin-blog-author-cell">
          {getAuthorName(post) || <span className="admin-blog-muted">{t('table.emptyValue')}</span>}
        </span>
      )
    },
    {
      title: t('table.columns.status'),
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: status => (
        <Tag color={statusColor[status] || 'default'} className="admin-blog-status-tag">
          {t(`status.${status || 'draft'}`)}
        </Tag>
      )
    },
    {
      title: t('table.columns.views'),
      dataIndex: 'viewsCount',
      key: 'viewsCount',
      width: 100,
      align: 'center',
      render: value => <span className="admin-blog-number-cell">{formatNumber(value)}</span>
    },
    {
      title: t('table.columns.publishedAt'),
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 190,
      render: value => value ? <span className="admin-blog-date"><CalendarDays className="admin-blog-date__icon" />{formatDate(value, language)}</span> : <span className="admin-blog-muted">{t('table.notPublished')}</span>
    },
    {
      title: t('table.columns.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 175,
      render: value => value ? <span className="admin-blog-date"><CalendarDays className="admin-blog-date__icon" />{formatDate(value, language)}</span> : <span className="admin-blog-muted">{t('table.emptyValue')}</span>
    },
    {
      title: t('table.columns.actions'),
      key: 'actions',
      width: 96,
      fixed: 'right',
      align: 'center',
      render: (_, post) => (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { key: 'preview', label: t('table.actions.preview'), icon: <Eye className="admin-blog-menu-icon" /> },
              { key: 'edit', label: t('table.actions.edit'), icon: <Pencil className="admin-blog-menu-icon" /> },
              post.status === 'published'
                ? { key: 'archive', label: t('table.actions.archive'), icon: <Archive className="admin-blog-menu-icon" /> }
                : { key: 'publish', label: t('table.actions.publish'), icon: <Send className="admin-blog-menu-icon" /> },
              { type: 'divider' },
              { key: 'delete', danger: true, label: t('table.actions.delete'), icon: <Trash2 className="admin-blog-menu-icon" /> }
            ],
            onClick: ({ key, domEvent }) => {
              domEvent.stopPropagation()
              if (key === 'preview') window.open(post.status === 'published' ? `/blog/${post.slug}` : `/blog/preview/${post._id}`, '_blank', 'noopener,noreferrer')
              if (key === 'edit') navigate(`/admin/blog/edit/${post._id}`)
              if (key === 'publish') handlePublish(post)
              if (key === 'archive') handleArchive(post)
              if (key === 'delete') handleDelete(post)
            }
          }}
        >
          <Button icon={<MoreHorizontal className="admin-blog-button-icon" />} className="admin-blog-table-btn" />
        </Dropdown>
      )
    }
  ], [fetchPosts, language, navigate, t])

  return (
    <div className="admin-blog-page">
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
            <Button icon={<Layers3 className="admin-blog-button-icon" />} onClick={() => navigate('/admin/blog/page-builder')}>
              Page builder
            </Button>
            <Button icon={<Layers3 className="admin-blog-button-icon" />} onClick={() => navigate('/admin/blog/detail-template')}>
              Detail template
            </Button>
            <Button onClick={() => navigate('/admin/blog-categories')}>Categories</Button>
            <Button onClick={() => navigate('/admin/blog-tags')}>Tags</Button>
            <Button onClick={() => navigate('/admin/media-library')}>Media</Button>
            <Button type="primary" icon={<Plus className="admin-blog-button-icon" />} onClick={() => navigate('/admin/blog/create')}>
              {t('page.createButton')}
            </Button>
          </div>
        </div>

        <StatGrid className="admin-blog-stats" columns={4}>
          <StatCard label={t('stats.total')} value={stats.total} meta={t('stats.totalHint')} />
          <StatCard label={t('stats.published')} value={stats.published} meta={t('stats.publishedHint')} tone="success" />
          <StatCard label={t('stats.draft')} value={stats.draft} meta={t('stats.draftHint')} />
          <StatCard label={t('stats.queued')} value={stats.queued} meta={t('stats.queuedHint')} tone="warning" />
        </StatGrid>

        <Card className="admin-blog-panel">
          <div className="admin-blog-toolbar">
            <SearchInput
              className="admin-blog-search-input"
              value={filters.keyword}
              onChange={event => handleFilterChange({ keyword: event.target.value })}
              onClear={() => handleFilterChange({ keyword: '' })}
              placeholder={t('filters.keyword')}
            />
            <Select allowClear value={filters.status || undefined} onChange={value => handleFilterChange({ status: value || '' })} placeholder={t('filters.status')} options={[
              { value: 'published', label: t('status.published') },
              { value: 'draft', label: t('status.draft') },
              { value: 'queued', label: t('status.queued') },
              { value: 'archived', label: t('status.archived') }
            ]} />
            <Select allowClear showSearch value={filters.category || undefined} onChange={value => handleFilterChange({ category: value || '' })} placeholder={t('filters.category')} options={categoryOptions} />
            <Select allowClear showSearch disabled={authorOptions.length === 0} value={filters.author || undefined} onChange={value => handleFilterChange({ author: value || '' })} placeholder={t('filters.author')} options={authorOptions} />
            <Select value={filters.sort || undefined} onChange={value => handleFilterChange({ sort: value || '' })} placeholder={t('filters.sort')} options={[
              { value: 'newest', label: t('sort.newest') },
              { value: 'updated', label: t('sort.updated') },
              { value: 'views', label: t('sort.views') },
              { value: 'published', label: t('sort.published') },
              { value: 'title', label: t('sort.title') }
            ]} />
            <Button icon={<RefreshCw className="admin-blog-button-icon" />} onClick={handleResetFilters}>{t('filters.reset')}</Button>
          </div>

          <Table
            rowKey="_id"
            dataSource={filteredPosts}
            columns={columns}
            loading={loading}
            scroll={{ x: 1330 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
              showTotal: (currentTotal, range) => t('table.showTotal', { rangeStart: range[0] || 0, rangeEnd: range[1] || 0, total: currentTotal })
            }}
            onChange={nextPagination => {
              setPagination({ current: nextPagination.current || 1, pageSize: nextPagination.pageSize || 10 })
            }}
            className="admin-blog-table"
          />
        </Card>
      </div>
    </div>
  )
}
