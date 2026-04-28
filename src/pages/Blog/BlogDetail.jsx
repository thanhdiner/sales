import { Button, Empty, Spin, Tag } from 'antd'
import { ArrowRight, CalendarDays, Clock3, Home } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getBlogPostBySlug, getBlogPosts } from '@/services/blogService'
import './BlogDetail.scss'

const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'

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

  return template.innerHTML
}

function extractHeadings(content) {
  const value = String(content || '')

  if (typeof window === 'undefined') {
    return value
      .split('\n')
      .map(line => line.trim())
      .filter(line => /^(#{2,3}\s+|<h[23][^>]*>)/i.test(line))
      .map((line, index) => ({
        id: `section-${index + 1}`,
        title: line.replace(/^#{2,3}\s+/, '').replace(/<[^>]+>/g, '').trim()
      }))
      .filter(item => item.title)
      .slice(0, 8)
  }

  const template = document.createElement('template')
  template.innerHTML = sanitizeRichHtml(value)

  return Array.from(template.content.querySelectorAll('h2, h3'))
    .map((heading, index) => ({
      id: `section-${index + 1}`,
      title: heading.textContent.trim()
    }))
    .filter(item => item.title)
    .slice(0, 8)
}

function renderContent(content) {
  return <div className="blog-detail-rich-content" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(content) }} />
}

export default function BlogDetail() {
  const { slug } = useParams()
  const { t } = useTranslation('clientBlog')
  const language = useCurrentLanguage()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const fetchPost = async () => {
      setLoading(true)
      setError('')

      try {
        const [postResponse, postsResponse] = await Promise.all([
          getBlogPostBySlug(slug),
          getBlogPosts({ limit: 12 })
        ])

        if (!mounted) return
        const currentPost = postResponse?.data || null
        setPost(currentPost)
        setRelatedPosts((Array.isArray(postsResponse?.data) ? postsResponse.data : []).filter(item => item.slug !== slug).slice(0, 3))
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

  const headings = useMemo(() => extractHeadings(post?.content), [post?.content])
  const readTime = estimateReadTime(post?.content || post?.excerpt)

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

      <article className="blog-detail-hero">
        {post.category ? <Tag>{post.category}</Tag> : null}
        <h1>{post.title}</h1>
        <div className="blog-detail-meta">
          <span>{t('labels.author')}</span>
          {post.publishedAt ? <span><CalendarDays className="blog-detail-icon" />{formatDate(post.publishedAt, language)}</span> : null}
          <span><Clock3 className="blog-detail-icon" />{t('labels.readTime', { count: readTime })}</span>
        </div>
        <img src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />
      </article>

      <section className="blog-detail-layout">
        <div className="blog-detail-content">
          {post.excerpt ? <p className="blog-detail-lead">{post.excerpt}</p> : null}
          {renderContent(post.content || post.excerpt)}
          <div className="blog-detail-cta">
            <strong>{t('detail.ctaTitle')}</strong>
            <span>{t('detail.ctaDescription')}</span>
            <Button type="primary" href="/products">{t('detail.ctaAction')}</Button>
          </div>
        </div>

        <aside className="blog-detail-toc">
          <h2>{t('sections.toc')}</h2>
          {headings.length ? (
            headings.map(item => <a href={`#${item.id}`} key={item.id}>{item.title}</a>)
          ) : (
            <span>{t('messages.noToc')}</span>
          )}
        </aside>
      </section>

      <section className="blog-detail-related">
        <h2>{t('sections.relatedProducts')}</h2>
        <div className="blog-product-row">
          {[1, 2, 3].map(item => (
            <Link to="/products" className="blog-product-card" key={item}>
              <span>{t('detail.productPlaceholder')}</span>
              <ArrowRight className="blog-detail-icon" />
            </Link>
          ))}
        </div>
      </section>

      <section className="blog-detail-related">
        <h2>{t('sections.relatedPosts')}</h2>
        <div className="blog-related-posts">
          {relatedPosts.map(item => (
            <Link to={`/blog/${item.slug}`} className="blog-related-card" key={item._id}>
              <img src={item.thumbnail || FALLBACK_IMAGE} alt={item.title} />
              <span>{item.category}</span>
              <strong>{item.title}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
