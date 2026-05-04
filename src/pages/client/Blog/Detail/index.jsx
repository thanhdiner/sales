import { Button, Empty, Spin, Tag } from 'antd'
import { ArrowRight, CalendarDays, Clock3, Home, Share2, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getBlogPostBySlug, getBlogPosts } from '@/services/client/content/blog'
import { getCmsPage } from '@/services/client/content/cmsPage'
import './index.scss'

const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'
const DEFAULT_TEMPLATE_SECTIONS = [
  { id: 'post_header_default', type: 'post_header', enabled: true, settings: {} },
  { id: 'post_content_default', type: 'post_content', enabled: true, settings: {} },
  { id: 'table_of_contents_default', type: 'table_of_contents', enabled: true, settings: {} },
  { id: 'related_products_default', type: 'related_products', enabled: true, settings: {} },
  { id: 'tags_default', type: 'tags', enabled: true, settings: {} },
  { id: 'related_posts_default', type: 'related_posts', enabled: true, settings: {} },
  { id: 'cta_default', type: 'cta', enabled: true, settings: {} }
]

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
  const words = String(content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

const ALLOWED_TAGS = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'SPAN', 'A',
  'H1', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR',
  'PRE', 'CODE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'ASIDE', 'FIGURE', 'FIGCAPTION',
  'IMG', 'VIDEO', 'SOURCE', 'IFRAME'
])
const ALLOWED_ATTRS = new Set(['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'controls', 'loading', 'allowfullscreen', 'referrerpolicy', 'allow', 'data-type'])
const URL_ATTRS = new Set(['href', 'src'])

function isSafeUrl(value) {
  if (!value) return false
  if (value.startsWith('/')) return true

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function slugifyHeading(value, index) {
  const slug = String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug || `section-${index + 1}`
}

function sanitizeRichHtml(html) {
  const value = String(html || '')
  if (typeof window === 'undefined' || !value.trim()) return value

  const template = document.createElement('template')
  template.innerHTML = value

  template.content.querySelectorAll('script, style, object, embed').forEach(node => node.remove())
  template.content.querySelectorAll('*').forEach(node => {
    if (!ALLOWED_TAGS.has(node.tagName)) {
      node.replaceWith(...node.childNodes)
      return
    }

    Array.from(node.attributes).forEach(attr => {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on') || !ALLOWED_ATTRS.has(name) || (URL_ATTRS.has(name) && !isSafeUrl(attr.value))) {
        node.removeAttribute(attr.name)
      }
    })

    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }

    if (node.tagName === 'VIDEO') {
      node.setAttribute('controls', 'true')
    }

    if (node.tagName === 'IFRAME') {
      node.setAttribute('loading', 'lazy')
      node.setAttribute('allowfullscreen', 'true')
      node.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
    }
  })

  Array.from(template.content.querySelectorAll('h2, h3')).forEach((heading, index) => {
    heading.id = heading.id || slugifyHeading(heading.textContent, index)
  })

  return template.innerHTML
}

function extractHeadings(content) {
  const value = String(content || '')

  if (typeof window === 'undefined') return []

  const template = document.createElement('template')
  template.innerHTML = sanitizeRichHtml(value)

  return Array.from(template.content.querySelectorAll('h2, h3'))
    .map((heading, index) => ({
      id: heading.id || slugifyHeading(heading.textContent, index),
      title: heading.textContent.trim(),
      level: heading.tagName.toLowerCase()
    }))
    .filter(item => item.title)
    .slice(0, 8)
}

function getProductName(product) {
  if (!product || typeof product !== 'object') return ''
  return product.productName || product.name || product.title || product.slug || product._id || ''
}

function getProductUrl(product) {
  if (!product || typeof product !== 'object') return '/products'
  return product.slug ? `/products/${product.slug}` : '/products'
}

function BlogDetailSection({ section, post, sanitizedContent, headings, readTime, relatedProducts, relatedPosts, language, t }) {
  const settings = section.settings || {}

  if (section.type === 'post_header') {
    return (
      <article className="blog-detail-hero">
        <div className="blog-detail-hero__copy">
          {post.category ? <Tag>{post.category}</Tag> : null}
          <h1>{post.title}</h1>
          {post.excerpt ? <p>{post.excerpt}</p> : null}
          <div className="blog-detail-meta">
            <span>{t('labels.author')}</span>
            {post.publishedAt ? <span><CalendarDays className="blog-detail-icon" />{formatDate(post.publishedAt, language)}</span> : null}
            <span><Clock3 className="blog-detail-icon" />{t('labels.readTime', { count: readTime })}</span>
            {settings.showShare === false ? null : <Button icon={<Share2 className="blog-detail-icon" />} onClick={() => navigator.clipboard?.writeText(window.location.href)}>{t('detail.share')}</Button>}
          </div>
        </div>
        <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
      </article>
    )
  }

  if (section.type === 'post_content') {
    return <section className="blog-detail-layout"><article className="blog-detail-content"><div className="blog-detail-rich-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} /></article></section>
  }

  if (section.type === 'table_of_contents') {
    return <section className="blog-detail-sidebar-card blog-detail-toc blog-container"><h2>{settings.title || t('sections.toc')}</h2>{headings.length ? headings.map(item => <a className={item.level === 'h3' ? 'blog-detail-toc__sub' : ''} href={`#${item.id}`} key={item.id}>{item.title}</a>) : <span>{t('messages.noToc')}</span>}</section>
  }

  if (section.type === 'related_products') {
    const items = relatedProducts.slice(0, Number(settings.limit) || 3)
    return <section className="blog-detail-sidebar-card blog-container"><h2>{settings.title || t('sections.relatedProducts')}</h2><div className="blog-product-stack">{items.length ? items.map(product => <Link to={getProductUrl(product)} className="blog-product-card" key={product._id || getProductName(product)}><ShoppingBag className="blog-detail-icon" /><span>{getProductName(product)}</span><ArrowRight className="blog-detail-icon" /></Link>) : [1, 2, 3].map(item => <Link to="/products" className="blog-product-card" key={item}><ShoppingBag className="blog-detail-icon" /><span>{t('detail.productPlaceholder')}</span><ArrowRight className="blog-detail-icon" /></Link>)}</div></section>
  }

  if (section.type === 'tags') {
    return Array.isArray(post.tags) && post.tags.length ? <section className="blog-detail-tags"><span>{settings.title || t('sections.tags')}</span><div>{post.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div></section> : null
  }

  if (section.type === 'related_posts') {
    return <section className="blog-detail-related"><h2>{settings.title || t('sections.relatedPosts')}</h2><div className="blog-related-posts">{relatedPosts.slice(0, Number(settings.limit) || 3).map(item => <Link to={`/blog/${item.slug}`} className="blog-related-card" key={item._id}><img src={item.thumbnail || FALLBACK_IMAGE} alt={item.title} />{item.category ? <span>{item.category}</span> : null}<strong>{item.title}</strong></Link>)}</div></section>
  }

  if (section.type === 'cta') {
    return <section className="blog-detail-cta blog-container"><strong>{settings.title || t('detail.ctaTitle')}</strong><span>{settings.description || t('detail.ctaDescription')}</span><Button type="primary" href={settings.primaryUrl || '/products'}>{settings.primaryText || t('detail.ctaAction')}</Button></section>
  }

  if (section.type === 'author_box') return <section className="blog-detail-sidebar-card blog-container"><h2>{settings.title || 'Author'}</h2><span>{t('labels.author')}</span></section>
  if (section.type === 'comments') return <section className="blog-detail-sidebar-card blog-container"><h2>{settings.title || 'Comments'}</h2><Empty /></section>
  return null
}

export default function BlogDetail() {
  const { slug } = useParams()
  const { t } = useTranslation('clientBlog')
  const language = useCurrentLanguage()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [templatePage, setTemplatePage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const fetchPost = async () => {
      setLoading(true)
      setError('')

      try {
        const [postResponse, postsResponse, templateResponse] = await Promise.allSettled([
          getBlogPostBySlug(slug),
          getBlogPosts({ limit: 12 }),
          getCmsPage('blog-detail-template')
        ])

        if (!mounted) return
        if (postResponse.status === 'rejected') throw postResponse.reason
        const currentPost = postResponse.value?.data || null
        setPost(currentPost)
        setRelatedPosts((postsResponse.status === 'fulfilled' && Array.isArray(postsResponse.value?.data) ? postsResponse.value.data : []).filter(item => item.slug !== slug).slice(0, 6))
        setTemplatePage(templateResponse.status === 'fulfilled' ? templateResponse.value?.data : null)
      } catch {
        if (mounted) setError(t('messages.detailFetchError'))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPost()

    return () => {
      mounted = false
    }
  }, [slug, t])

  const sanitizedContent = useMemo(() => sanitizeRichHtml(post?.content || post?.excerpt), [post?.content, post?.excerpt])
  const headings = useMemo(() => extractHeadings(post?.content), [post?.content])
  const readTime = estimateReadTime(post?.content || post?.excerpt)
  const templateSections = useMemo(() => {
    const sections = Array.isArray(templatePage?.sections) ? templatePage.sections.filter(section => section?.enabled !== false) : []
    return sections.length ? sections : DEFAULT_TEMPLATE_SECTIONS
  }, [templatePage])
  const relatedProducts = Array.isArray(post?.relatedProducts) ? post.relatedProducts.filter(product => typeof product === 'object').slice(0, 6) : []

  if (loading) {
    return (
      <main className="blog-detail-page">
        <div className="blog-detail-state"><Spin /><span>{t('messages.loading')}</span></div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="blog-detail-page">
        <div className="blog-detail-state blog-detail-state--error">
          <Empty description={error || t('messages.notFound')} />
          <Link to="/blog">{t('actions.backToBlog')}</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="blog-detail-page">
      <SEO title={post.seo?.title || post.title} description={post.seo?.description || post.excerpt} url={`https://smartmall.site/blog/${post.slug}`} />

      <section className="blog-detail-breadcrumb">
        <Link to="/"><Home className="blog-detail-icon" />{t('breadcrumb.home')}</Link>
        <span>/</span>
        <Link to="/blog">{t('breadcrumb.blog')}</Link>
        <span>/</span>
        <span>{post.title}</span>
      </section>

      {templateSections.map(section => (
        <BlogDetailSection
          key={section.id}
          section={section}
          post={post}
          sanitizedContent={sanitizedContent}
          headings={headings}
          readTime={readTime}
          relatedProducts={relatedProducts}
          relatedPosts={relatedPosts}
          language={language}
          t={t}
        />
      ))}
    </main>
  )
}
