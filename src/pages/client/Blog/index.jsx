import { Button, Empty, Input, Spin, Tag } from 'antd'
import { ArrowRight, CalendarDays, Clock3, Search, Sparkles, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getBlogPosts } from '@/services/client/content/blog'
import { getCmsPage } from '@/services/client/content/cmsPage'
import './index.scss'

const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'
const INITIAL_VISIBLE_POSTS = 9
const DEFAULT_SECTIONS = [
  { id: 'hero_default', type: 'hero', enabled: true, settings: {} },
  { id: 'featured_default', type: 'featured_posts', enabled: true, settings: {} },
  { id: 'category_tabs_default', type: 'category_tabs', enabled: true, settings: {} },
  { id: 'latest_default', type: 'latest_articles', enabled: true, settings: {} },
  { id: 'popular_default', type: 'popular_posts', enabled: true, settings: {} },
  { id: 'tag_default', type: 'tag_cloud', enabled: true, settings: {} },
  { id: 'cta_default', type: 'cta', enabled: true, settings: {} }
]

const hasText = value => typeof value === 'string' && value.trim().length > 0

function formatDate(value, language) {
  if (!value) return ''

  try {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(new Date(value))
  } catch {
    return ''
  }
}

function estimateReadTime(content) {
  const words = String(content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
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

function getCategoryKey(category) {
  return hasText(category) ? category : 'uncategorized'
}

export default function Blog() {
  const { t } = useTranslation('clientBlog')
  const language = useCurrentLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [cmsPage, setCmsPage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS)

  useEffect(() => {
    let mounted = true

    const fetchPosts = async () => {
      setLoading(true)
      setError('')

      try {
        const [postsResponse, pageResponse] = await Promise.allSettled([
          getBlogPosts({ limit: 60 }),
          getCmsPage('blog')
        ])
        if (!mounted) return

        if (postsResponse.status === 'rejected') {
          setError(t('messages.fetchError'))
          return
        }

        setPosts(Array.isArray(postsResponse.value?.data) ? postsResponse.value.data : [])
        setCmsPage(pageResponse.status === 'fulfilled' ? pageResponse.value?.data : null)
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
    const postCategories = posts.map(post => getCategoryKey(post.category)).filter(hasText)
    return ['all', ...Array.from(new Set(postCategories))]
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === 'all' || getCategoryKey(post.category) === activeCategory
      return matchesCategory && postMatchesKeyword(post, keyword)
    })
  }, [activeCategory, keyword, posts])

  const sections = useMemo(() => {
    const cmsSections = Array.isArray(cmsPage?.sections) ? cmsPage.sections.filter(section => section?.enabled !== false) : []
    return cmsSections.length ? cmsSections : DEFAULT_SECTIONS
  }, [cmsPage])
  const featuredLimit = getSectionLimit(sections, 'featured_posts', 4)
  const latestLimit = getSectionLimit(sections, 'latest_articles', INITIAL_VISIBLE_POSTS)
  const popularLimit = getSectionLimit(sections, 'popular_posts', 4)
  const tagLimit = getSectionLimit(sections, 'tag_cloud', 10)

  useEffect(() => {
    setVisibleCount(latestLimit)
  }, [activeCategory, keyword, latestLimit])

  const featuredPosts = filteredPosts.filter(post => post.isFeatured).concat(filteredPosts).filter((post, index, list) => (
    list.findIndex(item => item._id === post._id) === index
  )).slice(0, featuredLimit)
  const featuredIds = new Set(featuredPosts.map(post => post._id))
  const latestPosts = filteredPosts.filter(post => !featuredIds.has(post._id))
  const visiblePosts = latestPosts.slice(0, visibleCount)
  const popularPosts = [...posts].sort((a, b) => Number(b.viewsCount || 0) - Number(a.viewsCount || 0)).slice(0, popularLimit)
  const tags = Array.from(new Set(posts.flatMap(post => (Array.isArray(post.tags) ? post.tags : [])).filter(hasText))).slice(0, tagLimit)

  return (
    <main className="blog-page min-h-screen text-slate-950 dark:text-white">
      <SEO title={cmsPage?.seo?.title || t('seo.title')} description={cmsPage?.seo?.description || t('seo.description')} url="https://smartmall.site/blog" />

      {loading ? (
        <section className="blog-container blog-section"><State loading text={t('messages.loading')} /></section>
      ) : error ? (
        <section className="blog-container blog-section"><State error text={error} /></section>
      ) : filteredPosts.length === 0 ? (
        <section className="blog-container blog-section"><Empty className="blog-empty" description={t('messages.empty')} /></section>
      ) : (
        <>
          {sections.map(section => (
            <BlogSection
              key={section.id}
              section={section}
              posts={posts}
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              keyword={keyword}
              setKeyword={setKeyword}
              featuredPosts={featuredPosts}
              latestPosts={latestPosts}
              visiblePosts={visiblePosts}
              visibleCount={visibleCount}
              setVisibleCount={setVisibleCount}
              popularPosts={popularPosts.length ? popularPosts : featuredPosts}
              tags={tags}
              language={language}
              t={t}
            />
          ))}
        </>
      )}
    </main>
  )
}

function getSectionLimit(sections, type, fallback) {
  const section = sections.find(item => item.type === type)
  const limit = Number(section?.settings?.limit)
  return Number.isFinite(limit) && limit > 0 ? limit : fallback
}

function BlogSection({ section, posts, categories, activeCategory, setActiveCategory, keyword, setKeyword, featuredPosts, latestPosts, visiblePosts, visibleCount, setVisibleCount, popularPosts, tags, language, t }) {
  const settings = section.settings || {}

  if (section.type === 'hero') {
    return <BlogHero settings={settings} posts={posts} categories={categories} keyword={keyword} setKeyword={setKeyword} t={t} />
  }

  if (section.type === 'featured_posts') {
    return (
      <section className="blog-container blog-section blog-featured-section">
        <SectionTitle label={settings.title || t('sections.featured')} />
        <FeaturedGrid posts={featuredPosts} language={language} t={t} />
      </section>
    )
  }

  if (section.type === 'latest_articles') {
    return (
      <section className="blog-container blog-section blog-main-section">
        <div className="blog-section-header">
          <SectionTitle label={settings.title || t('sections.latest')} compact />
          <span>{settings.hint || t('sections.latestHint')}</span>
        </div>
        <div className="blog-latest-grid">
          {visiblePosts.map(post => <ArticleCard key={post._id} post={post} language={language} t={t} />)}
        </div>
        {visiblePosts.length === 0 ? <Empty className="blog-empty" description={t('messages.empty')} /> : null}
        {settings.showLoadMore !== false && visibleCount < latestPosts.length ? (
          <Button className="blog-load-more" onClick={() => setVisibleCount(count => count + getSectionLimit([section], 'latest_articles', INITIAL_VISIBLE_POSTS))}>
            {t('actions.loadMore')}
          </Button>
        ) : null}
      </section>
    )
  }

  if (section.type === 'category_tabs') {
    return <section className="blog-container blog-section"><CategoryTabs categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} t={t} /></section>
  }

  if (section.type === 'popular_posts') {
    return <PopularStrip posts={popularPosts} language={language} t={t} settings={settings} />
  }

  if (section.type === 'tag_cloud') {
    return tags.length ? <TagCloud tags={tags} t={t} settings={settings} /> : null
  }

  if (section.type === 'cta') {
    return <BlogCta t={t} settings={settings} />
  }

  return null
}

function BlogHero({ settings, posts, categories, keyword, setKeyword, t }) {
  return (
    <section className="blog-hero">
      <div className="blog-container blog-hero__inner">
        <div className="blog-hero__content">
          <p className="blog-eyebrow"><Sparkles className="blog-inline-icon" />{settings.eyebrow || t('page.eyebrow')}</p>
          <h1>{settings.title || t('page.title')}</h1>
          <p>{settings.description || t('page.description')}</p>
        </div>
        {settings.showSearch === false && settings.showStats === false ? null : (
          <div className="blog-hero__search-panel">
            {settings.showSearch === false ? null : (
              <Input
                allowClear
                prefix={<Search className="blog-search__icon" />}
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder={t('filters.keyword')}
                size="large"
                className="blog-hero__search"
              />
            )}
            {settings.showStats === false ? null : (
              <div className="blog-hero__stats">
                <span><strong>{posts.length}</strong>{t('stats.articles')}</span>
                <span><strong>{Math.max(categories.length - 1, 0)}</strong>{t('stats.categories')}</span>
                <span><strong>{posts.filter(post => post.isFeatured).length}</strong>{t('stats.featured')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function SectionTitle({ label, compact = false }) {
  return <h2 className={`blog-section-title${compact ? ' blog-section-title--compact' : ''}`}>{label}</h2>
}

function State({ loading, error, text }) {
  return (
    <div className={`blog-state${error ? ' blog-state--error' : ''}`}>
      {loading ? <Spin /> : null}
      <span>{text}</span>
    </div>
  )
}

function FeaturedGrid({ posts, language, t }) {
  const [mainPost, ...sidePosts] = posts

  return (
    <div className="blog-featured-grid">
      {mainPost ? <FeaturedArticle post={mainPost} language={language} t={t} large /> : null}
      <div className="blog-featured-side">
        {sidePosts.slice(0, 3).map(post => <FeaturedArticle key={post._id} post={post} language={language} t={t} />)}
      </div>
    </div>
  )
}

function FeaturedArticle({ post, language, t, large = false }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`blog-featured-card${large ? ' blog-featured-card--large' : ''}`}>
      <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
      <div className="blog-featured-card__body">
        <div className="blog-meta-row">
          {post.category ? <Tag>{post.category}</Tag> : null}
          {post.publishedAt ? <span><CalendarDays className="blog-date__icon" />{formatDate(post.publishedAt, language)}</span> : null}
          <span><Clock3 className="blog-date__icon" />{t('labels.readTime', { count: estimateReadTime(post.content || post.excerpt) })}</span>
        </div>
        <h3>{post.title}</h3>
        {large && post.excerpt ? <p>{post.excerpt}</p> : null}
      </div>
    </Link>
  )
}

function CategoryTabs({ categories, activeCategory, onChange, t }) {
  return (
    <div className="blog-categories" aria-label={t('filters.category')}>
      {categories.map(category => (
        <Button key={category} type={activeCategory === category ? 'primary' : 'default'} onClick={() => onChange(category)} className="blog-category-btn">
          {category === 'all' ? t('filters.all') : category}
        </Button>
      ))}
    </div>
  )
}

function ArticleCard({ post, language, t }) {
  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-card__image">
        <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
      </Link>
      <div className="blog-card__body">
        <div className="blog-meta-row">
          {post.category ? <span>{post.category}</span> : null}
          <span><Clock3 className="blog-date__icon" />{t('labels.readTime', { count: estimateReadTime(post.content || post.excerpt) })}</span>
        </div>
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        <div className="blog-card__footer">
          {post.publishedAt ? <span>{formatDate(post.publishedAt, language)}</span> : null}
          <Link to={`/blog/${post.slug}`} className="blog-card__link">
            {t('actions.read')} <ArrowRight className="blog-button-icon" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function PopularStrip({ posts, language, t, settings = {} }) {
  if (!posts.length) return null

  return (
    <section className="blog-container blog-section blog-popular-section">
      <div className="blog-section-header">
        <SectionTitle label={settings.title || t('sections.popular')} compact />
        <span><TrendingUp className="blog-inline-icon" />{settings.hint || t('sections.popularHint')}</span>
      </div>
      <div className="blog-popular-grid">
        {posts.slice(0, 4).map((post, index) => (
          <Link to={`/blog/${post.slug}`} className="blog-popular-card" key={post._id}>
            <span className="blog-popular-card__rank">0{index + 1}</span>
            <div>
              <strong>{post.title}</strong>
              <small>{post.publishedAt ? formatDate(post.publishedAt, language) : t('labels.featured')}</small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function TagCloud({ tags, t, settings = {} }) {
  return (
    <section className="blog-container blog-tags-section">
      <span>{settings.title || t('sections.tags')}</span>
      <div>{tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div>
    </section>
  )
}

function BlogCta({ t, settings = {} }) {
  return (
    <section className="blog-container blog-cta">
      <div>
        <span>{settings.eyebrow || t('cta.eyebrow')}</span>
        <h2>{settings.title || t('cta.title')}</h2>
        <p>{settings.description || t('cta.description')}</p>
      </div>
      <div className="blog-cta__actions">
        <Button type="primary" href={settings.primaryUrl || '/products'}>{settings.primaryText || t('cta.products')}</Button>
        <Button href={settings.secondaryUrl || '/flash-sale'}>{settings.secondaryText || t('cta.flashSale')}</Button>
      </div>
    </section>
  )
}
