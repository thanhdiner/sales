import { Button, Empty, Input, Spin, Tag } from 'antd'
import { ArrowRight, CalendarDays, Clock3, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getBlogCategories, getBlogPosts } from '@/services/client/content/blog'
import { getCmsPage } from '@/services/client/content/cmsPage'
import './index.scss'

const INITIAL_VISIBLE_POSTS = 9
const BLOG_LIST_LIMIT = 60
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
    getCategoryLabel(post.category),
    ...(Array.isArray(post.tags) ? post.tags.map(getTagLabel) : [])
  ].some(value => String(value || '').toLowerCase().includes(normalizedKeyword))
}

function getCategoryLabel(category) {
  if (typeof category === 'string') return hasText(category) ? category.trim() : ''
  if (category && typeof category === 'object') return category.name || category.title || category.slug || ''
  return ''
}

function getCategoryKey(category) {
  if (typeof category === 'string') return hasText(category) ? category.trim() : 'uncategorized'
  if (category && typeof category === 'object') return category.slug || category.name || category.title || 'uncategorized'
  return 'uncategorized'
}

function normalizeCategoryOption(category) {
  if (category === 'all') return { key: 'all', label: 'all' }
  if (typeof category === 'string') {
    const label = getCategoryLabel(category)
    return label ? { key: label, label } : null
  }
  if (category && typeof category === 'object') {
    const label = getCategoryLabel(category)
    const key = category.slug || category.name || label
    return key && label ? { key, label } : null
  }
  return null
}

function getTagLabel(tag) {
  if (typeof tag === 'string') return tag
  if (tag && typeof tag === 'object') return tag.name || tag.slug || ''
  return ''
}

export default function Blog() {
  const { t } = useTranslation('clientBlog')
  const language = useCurrentLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [categories, setCategories] = useState([{ key: 'all', label: 'all' }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState(() => searchParams.get('q') || searchParams.get('keyword') || '')
  const [debouncedKeyword, setDebouncedKeyword] = useState(() => (searchParams.get('q') || searchParams.get('keyword') || '').trim())
  const [cmsPage, setCmsPage] = useState(null)
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') || 'all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS)

  useEffect(() => {
    const urlKeyword = searchParams.get('q') || searchParams.get('keyword') || ''
    const urlCategory = searchParams.get('category') || 'all'
    setKeyword(urlKeyword)
    setDebouncedKeyword(urlKeyword.trim())
    setActiveCategory(urlCategory)
  }, [searchParams])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedKeyword(keyword.trim())
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [keyword])

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams)
    if (debouncedKeyword) nextParams.set('q', debouncedKeyword)
    else nextParams.delete('q')
    nextParams.delete('keyword')

    if (activeCategory && activeCategory !== 'all') nextParams.set('category', activeCategory)
    else nextParams.delete('category')

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true })
    }
  }, [activeCategory, debouncedKeyword, searchParams, setSearchParams])

  useEffect(() => {
    let ignore = false

    const fetchPosts = async () => {
      setLoading(true)
      setError('')

      try {
        const [postsResponse, pageResponse, categoriesResponse] = await Promise.allSettled([
          getBlogPosts({
            limit: BLOG_LIST_LIMIT,
            keyword: debouncedKeyword,
            category: activeCategory !== 'all' ? activeCategory : undefined
          }),
          getCmsPage('blog'),
          getBlogCategories()
        ])
        if (ignore) return

        if (postsResponse.status === 'rejected') {
          setError(t('messages.fetchError'))
          return
        }

        const nextPosts = Array.isArray(postsResponse.value?.data) ? postsResponse.value.data : []
        const categoryOptions = categoriesResponse.status === 'fulfilled' && Array.isArray(categoriesResponse.value?.data)
          ? categoriesResponse.value.data.map(normalizeCategoryOption).filter(Boolean)
          : nextPosts.map(post => normalizeCategoryOption(post.category)).filter(Boolean)
        const uniqueCategories = new Map([['all', { key: 'all', label: 'all' }]])
        categoryOptions.forEach(category => uniqueCategories.set(category.key, category))

        setPosts(nextPosts)
        setTotalPosts(Number(postsResponse.value?.total) || nextPosts.length)
        setCategories(Array.from(uniqueCategories.values()))
        setCmsPage(pageResponse.status === 'fulfilled' ? pageResponse.value?.data : null)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchPosts()

    return () => {
      ignore = true
    }
  }, [activeCategory, debouncedKeyword, language, t])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === 'all' || getCategoryKey(post.category) === activeCategory
      return matchesCategory && postMatchesKeyword(post, debouncedKeyword)
    })
  }, [activeCategory, debouncedKeyword, posts])

  const sections = useMemo(() => {
    const cmsSections = Array.isArray(cmsPage?.sections) ? cmsPage.sections.filter(section => section?.enabled !== false) : []
    return cmsSections.length ? cmsSections : DEFAULT_SECTIONS
  }, [cmsPage])
  const featuredLimit = getSectionLimit(sections, 'featured_posts', 3)
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
  const tags = Array.from(new Set(posts.flatMap(post => (Array.isArray(post.tags) ? post.tags : []).map(getTagLabel)).filter(hasText))).slice(0, tagLimit)
  const hasActiveFilters = Boolean(debouncedKeyword) || activeCategory !== 'all'
  const totalArticles = totalPosts || posts.length

  return (
    <main className="blog-page min-h-screen text-slate-950 dark:text-white">
      <SEO title={cmsPage?.seo?.title || t('seo.title')} description={cmsPage?.seo?.description || t('seo.description')} url="https://smartmall.site/blog" />

      {error ? (
        <section className="blog-container blog-section"><State error text={error} /></section>
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
              totalArticles={totalArticles}
              hasActiveFilters={hasActiveFilters}
              loading={loading}
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

function BlogSection({ section, posts, categories, activeCategory, setActiveCategory, keyword, setKeyword, featuredPosts, latestPosts, visiblePosts, visibleCount, setVisibleCount, popularPosts, tags, totalArticles, hasActiveFilters, loading, language, t }) {
  const settings = section.settings || {}

  if (section.type === 'hero') {
    return <BlogHero settings={settings} posts={posts} categories={categories} keyword={keyword} setKeyword={setKeyword} totalArticles={totalArticles} t={t} />
  }

  if (section.type === 'featured_posts') {
    return (
      <section className="blog-container blog-section blog-featured-section">
        <SectionTitle label={settings.title || t('sections.featured')} doodle />
        <FeaturedGrid posts={featuredPosts} language={language} t={t} />
      </section>
    )
  }

  if (section.type === 'latest_articles') {
    return (
      <section className="blog-container blog-section blog-main-section">
        <div className="blog-section-header blog-section-header--latest">
          <SectionTitle label={settings.title || t('sections.latest')} compact />
          <span>{settings.hint || t('sections.latestHint')}</span>
        </div>
        <div className="blog-latest-grid">
          {visiblePosts.map(post => <FeaturedArticle key={post._id} post={post} language={language} t={t} />)}
        </div>
        {loading && visiblePosts.length === 0 ? <State loading text={t('messages.loading')} /> : null}
        {!loading && visiblePosts.length === 0 ? <Empty className="blog-empty" description={hasActiveFilters ? t('messages.empty') : t('messages.emptyAll')} /> : null}
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

function BlogHero({ settings, posts, categories, keyword, setKeyword, totalArticles, t }) {
  return (
    <section className="blog-hero">
      <div className="blog-container blog-hero__inner">
        <div className="blog-hero__content">
          <p className="blog-eyebrow"><Sparkles className="blog-inline-icon" />{settings.eyebrow || t('page.eyebrow')}</p>
          <h1>{settings.title || t('page.title')}</h1>
          <span className="blog-hero__title-underline" aria-hidden="true" />
          <p className="blog-hero__description">{settings.description || t('page.description')}</p>
        </div>
        {settings.showSearch === false && settings.showStats === false ? null : (
          <div className="blog-hero__search-panel">
            <span className="blog-hero__panel-spark blog-hero__panel-spark--arc" aria-hidden="true" />
            <Sparkles className="blog-hero__panel-spark blog-hero__panel-spark--star" aria-hidden="true" />
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
                <span><strong>{totalArticles}</strong>{t('stats.articles')}</span>
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

function SectionTitle({ label, compact = false, doodle = false }) {
  if (doodle) {
    return (
      <div className="blog-section-title-wrap">
        <h2 className="blog-section-title blog-section-title--doodle"><Sparkles className="blog-inline-icon" />{label}</h2>
        <span className="blog-section-title-underline" aria-hidden="true" />
      </div>
    )
  }

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
  return (
    <div className="blog-featured-grid">
      {posts.slice(0, 3).map(post => <FeaturedArticle key={post._id} post={post} language={language} t={t} />)}
    </div>
  )
}

function FeaturedArticle({ post, language, t }) {
  const hasThumbnail = hasText(post.thumbnail)
  const categoryLabel = getCategoryLabel(post.category)

  return (
    <Link to={`/blog/${post.slug}`} className="blog-featured-card">
      <span className="blog-featured-card__spark blog-featured-card__spark--one" aria-hidden="true" />
      <span className="blog-featured-card__spark blog-featured-card__spark--two" aria-hidden="true" />
      <span className={`blog-featured-card__image${hasThumbnail ? ' blog-featured-card__image--real' : ''}`}>
        {hasThumbnail ? <img src={post.thumbnail} alt={post.title} /> : null}
      </span>
      <div className="blog-featured-card__body">
        <div className="blog-featured-card__meta-top">
          {categoryLabel ? <Tag>{categoryLabel}</Tag> : null}
          {post.publishedAt ? <span>{formatDate(post.publishedAt, language)}</span> : null}
        </div>
        <span className="blog-featured-card__read-time"><Clock3 className="blog-date__icon" />{t('labels.readTime', { count: estimateReadTime(post.content || post.excerpt) })}</span>
        <h3>{post.title}</h3>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        <span className="blog-featured-card__link">
          {t('actions.read')} <ArrowRight className="blog-button-icon" />
        </span>
      </div>
    </Link>
  )
}

function CategoryTabs({ categories, activeCategory, onChange, t }) {
  return (
    <div className="blog-categories" aria-label={t('filters.category')}>
      {categories.map(category => (
        <Button key={category.key} type={activeCategory === category.key ? 'primary' : 'default'} onClick={() => onChange(category.key)} className="blog-category-btn">
          {category.key === 'all' ? t('filters.all') : category.label}
        </Button>
      ))}
    </div>
  )
}

function PopularStrip({ posts, language, t, settings = {} }) {
  if (!posts.length) return null

  return (
    <section className="blog-container blog-section blog-popular-section">
      <div className="blog-section-header blog-section-header--popular">
        <SectionTitle label={settings.title || t('sections.popular')} compact />
        <span><Sparkles className="blog-inline-icon" />{settings.hint || t('sections.popularHint')}</span>
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
