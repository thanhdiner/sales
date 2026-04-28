import { Button, Empty, Input, Modal, Spin, Tag } from 'antd'
import { ArrowRight, CalendarDays, Search, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getBlogPosts } from '@/services/blogService'
import './Blog.scss'

const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'

const hasText = value => typeof value === 'string' && value.trim().length > 0

function formatDate(value, language) {
  if (!value) return ''

  try {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(new Date(value))
  } catch {
    return ''
  }
}

function postMatchesKeyword(post, keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return true

  return [
    post.title,
    post.excerpt,
    post.content,
    post.category,
    ...(Array.isArray(post.tags) ? post.tags : [])
  ].some(value => String(value || '').toLowerCase().includes(normalizedKeyword))
}

export default function Blog() {
  const { t } = useTranslation('clientBlog')
  const language = useCurrentLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    let mounted = true

    const fetchPosts = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getBlogPosts({ limit: 60 })
        if (!mounted) return
        setPosts(Array.isArray(response?.data) ? response.data : [])
      } catch {
        if (mounted) setError(t('messages.fetchError'))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPosts()

    return () => {
      mounted = false
    }
  }, [language, t])

  const categories = useMemo(() => {
    const postCategories = posts.map(post => post.category).filter(hasText)
    return ['all', ...Array.from(new Set(postCategories))]
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory
      return matchesCategory && postMatchesKeyword(post, keyword)
    })
  }, [activeCategory, keyword, posts])

  const featuredPost = filteredPosts.find(post => post.isFeatured) || filteredPosts[0] || null
  const gridPosts = featuredPost ? filteredPosts.filter(post => post._id !== featuredPost._id) : filteredPosts

  return (
    <main className="blog-page min-h-screen bg-slate-50 text-slate-950 dark:bg-gray-900 dark:text-white">
      <SEO title={t('seo.title')} description={t('seo.description')} url="https://smartmall.site/blog" />

      <section className="blog-hero">
        <div className="blog-hero__media">
          <img src={featuredPost?.thumbnail || FALLBACK_IMAGE} alt={featuredPost?.title || t('page.title')} />
        </div>
        <div className="blog-hero__content">
          <p className="blog-eyebrow">{t('page.eyebrow')}</p>
          <h1>{t('page.title')}</h1>
          <p>{t('page.description')}</p>
        </div>
      </section>

      <section className="blog-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="blog-toolbar">
          <Input
            allowClear
            prefix={<Search className="blog-toolbar__icon" />}
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder={t('filters.keyword')}
            size="large"
          />

          <div className="blog-categories" aria-label={t('filters.category')}>
            {categories.map(category => (
              <Button
                key={category}
                type={activeCategory === category ? 'primary' : 'default'}
                onClick={() => setActiveCategory(category)}
                className="blog-category-btn"
              >
                {category === 'all' ? t('filters.all') : category}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="blog-state">
            <Spin />
            <span>{t('messages.loading')}</span>
          </div>
        ) : error ? (
          <div className="blog-state blog-state--error">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="blog-empty">
            <Empty description={t('messages.empty')} />
          </div>
        ) : (
          <div className="blog-layout">
            {featuredPost ? (
              <article className="blog-featured">
                <div className="blog-featured__image">
                  <img src={featuredPost.thumbnail || FALLBACK_IMAGE} alt={featuredPost.title} />
                </div>
                <div className="blog-featured__body">
                  <div className="blog-meta-row">
                    {featuredPost.isFeatured ? (
                      <Tag color="gold" icon={<Star className="blog-tag-icon" />}>{t('labels.featured')}</Tag>
                    ) : null}
                    {featuredPost.category ? <Tag>{featuredPost.category}</Tag> : null}
                    {featuredPost.publishedAt ? (
                      <span className="blog-date">
                        <CalendarDays className="blog-date__icon" />
                        {formatDate(featuredPost.publishedAt, language)}
                      </span>
                    ) : null}
                  </div>

                  <h2>{featuredPost.title}</h2>
                  {featuredPost.excerpt ? <p>{featuredPost.excerpt}</p> : null}

                  <Button type="primary" icon={<ArrowRight className="blog-button-icon" />} onClick={() => setSelectedPost(featuredPost)}>
                    {t('actions.read')}
                  </Button>
                </div>
              </article>
            ) : null}

            <div className="blog-grid">
              {gridPosts.map(post => (
                <article className="blog-card" key={post._id}>
                  <button type="button" className="blog-card__image" onClick={() => setSelectedPost(post)}>
                    <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
                  </button>
                  <div className="blog-card__body">
                    <div className="blog-meta-row">
                      {post.category ? <Tag>{post.category}</Tag> : null}
                      {post.publishedAt ? <span className="blog-date">{formatDate(post.publishedAt, language)}</span> : null}
                    </div>
                    <h3>{post.title}</h3>
                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                    <Button type="link" onClick={() => setSelectedPost(post)} className="blog-card__link">
                      {t('actions.read')}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <Modal
        open={Boolean(selectedPost)}
        onCancel={() => setSelectedPost(null)}
        footer={null}
        width={860}
        className="blog-detail-modal"
        rootClassName="blog-detail-modal"
        destroyOnClose
      >
        {selectedPost ? (
          <article className="blog-detail">
            <img src={selectedPost.thumbnail || FALLBACK_IMAGE} alt={selectedPost.title} className="blog-detail__image" />
            <div className="blog-meta-row">
              {selectedPost.category ? <Tag>{selectedPost.category}</Tag> : null}
              {selectedPost.publishedAt ? <span className="blog-date">{formatDate(selectedPost.publishedAt, language)}</span> : null}
            </div>
            <h2>{selectedPost.title}</h2>
            {selectedPost.excerpt ? <p className="blog-detail__excerpt">{selectedPost.excerpt}</p> : null}
            <div className="blog-detail__content">{selectedPost.content || selectedPost.excerpt}</div>
            {Array.isArray(selectedPost.tags) && selectedPost.tags.length > 0 ? (
              <div className="blog-detail__tags">
                {selectedPost.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            ) : null}
          </article>
        ) : null}
      </Modal>
    </main>
  )
}
