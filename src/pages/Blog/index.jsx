import { Button, Empty, Input, Spin, Tag } from 'antd'
import { ArrowRight, CalendarDays, Clock3, Search, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getBlogPosts } from '@/services/blogService'
import './Blog.scss'

const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'
const INITIAL_VISIBLE_POSTS = 6

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

function estimateReadTime(content) {
  const words = String(content || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
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
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS)

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

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_POSTS)
  }, [activeCategory, keyword])

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
  const secondaryFeaturedPost = filteredPosts.find(post => post._id !== featuredPost?._id) || null
  const listPosts = featuredPost ? filteredPosts.filter(post => post._id !== featuredPost._id && post._id !== secondaryFeaturedPost?._id) : filteredPosts
  const visiblePosts = listPosts.slice(0, visibleCount)
  const latestPosts = posts.slice(0, 4)
  const popularPosts = posts.filter(post => post.isFeatured).slice(0, 3)
  const tags = Array.from(new Set(posts.flatMap(post => (Array.isArray(post.tags) ? post.tags : [])).filter(hasText))).slice(0, 12)

  return (
    <main className="blog-page min-h-screen text-slate-950 dark:text-white">
      <SEO title={t('seo.title')} description={t('seo.description')} url="https://smartmall.site/blog" />

      <section className="blog-hero">
        <div className="blog-hero__inner">
          <p className="blog-eyebrow">{t('page.eyebrow')}</p>
          <h1>{t('page.title')}</h1>
          <p>{t('page.description')}</p>
          <Input
            allowClear
            prefix={<Search className="blog-search__icon" />}
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder={t('filters.keyword')}
            size="large"
            className="blog-hero__search"
          />
        </div>
      </section>

      <section className="blog-section blog-featured-section">
        <div className="blog-section__heading">
          <span>{t('sections.featured')}</span>
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
          <div className="blog-featured-grid">
            {featuredPost ? <FeaturedArticle post={featuredPost} language={language} t={t} large /> : null}
            {secondaryFeaturedPost ? <FeaturedArticle post={secondaryFeaturedPost} language={language} t={t} /> : null}
          </div>
        )}
      </section>

      {!loading && !error && filteredPosts.length > 0 ? (
        <section className="blog-section blog-main-section">
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

          <div className="blog-main-grid">
            <div className="blog-list">
              {visiblePosts.map(post => <BlogCard key={post._id} post={post} language={language} t={t} />)}
              {visiblePosts.length === 0 ? (
                <div className="blog-empty">
                  <Empty description={t('messages.empty')} />
                </div>
              ) : null}
              {visibleCount < listPosts.length ? (
                <Button className="blog-load-more" onClick={() => setVisibleCount(count => count + INITIAL_VISIBLE_POSTS)}>
                  {t('actions.loadMore')}
                </Button>
              ) : null}
            </div>

            <aside className="blog-sidebar">
              <SidebarList title={t('sections.latest')} posts={latestPosts} language={language} />
              <SidebarList title={t('sections.popular')} posts={popularPosts.length ? popularPosts : latestPosts.slice(0, 3)} language={language} />
              <div className="blog-sidebar-card">
                <h3>{t('sections.tags')}</h3>
                <div className="blog-sidebar-tags">
                  {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </div>
              </div>
            </aside>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function FeaturedArticle({ post, language, t, large = false }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`blog-featured-card${large ? ' blog-featured-card--large' : ''}`}>
      <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
      <div className="blog-featured-card__body">
        <div className="blog-meta-row">
          {post.isFeatured ? <Tag color="gold" icon={<Star className="blog-tag-icon" />}>{t('labels.featured')}</Tag> : null}
          {post.category ? <Tag>{post.category}</Tag> : null}
          {post.publishedAt ? <span><CalendarDays className="blog-date__icon" />{formatDate(post.publishedAt, language)}</span> : null}
        </div>
        <h2>{post.title}</h2>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
      </div>
    </Link>
  )
}

function BlogCard({ post, language, t }) {
  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-card__image">
        <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
      </Link>
      <div className="blog-card__body">
        <div className="blog-meta-row">
          {post.category ? <span>{post.category}</span> : null}
          <span><Clock3 className="blog-date__icon" />{t('labels.readTime', { count: estimateReadTime(post.content || post.excerpt) })}</span>
          {post.publishedAt ? <span>{formatDate(post.publishedAt, language)}</span> : null}
        </div>
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        <Link to={`/blog/${post.slug}`} className="blog-card__link">
          {t('actions.read')} <ArrowRight className="blog-button-icon" />
        </Link>
      </div>
    </article>
  )
}

function SidebarList({ title, posts, language }) {
  return (
    <div className="blog-sidebar-card">
      <h3>{title}</h3>
      <div className="blog-sidebar-posts">
        {posts.map(post => (
          <Link to={`/blog/${post.slug}`} key={post._id} className="blog-sidebar-post">
            <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
            <span>{post.title}</span>
            {post.publishedAt ? <small>{formatDate(post.publishedAt, language)}</small> : null}
          </Link>
        ))}
      </div>
    </div>
  )
}
