import { Button, Empty, Input, Modal, Tag, message } from 'antd'
import { ArrowRight, CalendarDays, Clock3, Copy, Home, Mail, MessageCircle, Share2, ShoppingBag, Sparkles, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import { useRegisterPageEntity } from '@/features/chat/pageContext/PageContextProvider'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getBlogPostBySlug, getBlogPosts } from '@/services/client/content/blog'
import { getCmsPage } from '@/services/client/content/cmsPage'
import './index.scss'

const FALLBACK_IMAGE = '/images/herosection-aboutpage.jpg'
const TEMPLATE_SECTION_DEFAULTS = {
  post_header: { showShare: true, showCategory: true, showAuthor: true, showDate: true, showReadingTime: true, showThumbnail: true, layout: 'standard', alignment: 'left' },
  post_content: { typography: 'comfortable', showDropCap: false, showNewsletter: false },
  table_of_contents: { title: 'Table of contents', sticky: true, collapsible: true },
  author_box: { title: 'Author', showAvatar: true, showBio: true, showSocial: true },
  related_products: { title: 'Related products', limit: 3, layout: 'grid', showPrice: true },
  related_posts: { title: 'Related posts', limit: 3, layout: 'cards', showExcerpt: true },
  tags: { title: 'Tags', style: 'pills' },
  cta: { title: 'Ready to shop smarter?', description: 'Find products, deals and guides in one place.', primaryText: 'Shop now', primaryUrl: '/products', secondaryText: '', secondaryUrl: '' },
  comments: { title: 'Comments', allowComments: true, moderationNotice: true }
}
const DEFAULT_TEMPLATE_SECTIONS = [
  { id: 'post_header_default', type: 'post_header', enabled: true, settings: TEMPLATE_SECTION_DEFAULTS.post_header },
  { id: 'post_content_default', type: 'post_content', enabled: true, settings: TEMPLATE_SECTION_DEFAULTS.post_content },
  { id: 'table_of_contents_default', type: 'table_of_contents', enabled: true, settings: TEMPLATE_SECTION_DEFAULTS.table_of_contents },
  { id: 'related_products_default', type: 'related_products', enabled: true, settings: TEMPLATE_SECTION_DEFAULTS.related_products },
  { id: 'tags_default', type: 'tags', enabled: true, settings: TEMPLATE_SECTION_DEFAULTS.tags },
  { id: 'related_posts_default', type: 'related_posts', enabled: true, settings: TEMPLATE_SECTION_DEFAULTS.related_posts },
  { id: 'cta_default', type: 'cta', enabled: true, settings: TEMPLATE_SECTION_DEFAULTS.cta }
]

function hydrateTemplateSections(sections = []) {
  return sections.map(section => ({
    ...section,
    settings: { ...(TEMPLATE_SECTION_DEFAULTS[section.type] || {}), ...(section.settings || {}) }
  }))
}

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
    .replace(/[\u0300-\u036f]/g, '')
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

function getPlainTextFromHtml(html) {
  const value = String(html || '')
  if (typeof window === 'undefined') return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  const template = document.createElement('template')
  template.innerHTML = value
  return template.content.textContent.replace(/\s+/g, ' ').trim()
}

function buildBlogPageContext(post) {
  const route = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search || ''}` : ''
  const description = getPlainTextFromHtml(post?.excerpt || post?.seo?.description || post?.content).slice(0, 1000)

  return {
    route,
    pageType: 'blog_detail',
    entity: post ? {
      type: 'blog_post',
      id: post._id,
      slug: post.slug,
      title: post.title,
      description,
      category: getDisplayText(post.category)
    } : null
  }
}

function getDisplayText(value) {
  if (!value) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object') return value.name || value.title || value.slug || value._id || ''
  return ''
}

function getStableKey(value, index) {
  if (value && typeof value === 'object') return value._id || value.slug || value.name || `item-${index}`
  return String(value || `item-${index}`)
}
function getProductName(product) {
  if (!product || typeof product !== 'object') return ''
  return product.productName || product.name || product.title || product.slug || product._id || ''
}

function getProductUrl(product) {
  if (!product || typeof product !== 'object') return '/products'
  return product.slug ? `/products/${product.slug}` : '/products'
}

function getProductPrice(product) {
  if (!product || typeof product !== 'object') return null
  if (product.salePrice !== undefined && product.salePrice !== null) return Number(product.salePrice) || 0
  const price = Number(product.price) || 0
  const discount = Number(product.discountPercentage || product.discountPercent) || 0
  return discount > 0 ? Math.round((price * (100 - discount)) / 100) : price
}

function formatProductPrice(product, language) {
  const price = getProductPrice(product)
  if (price === null) return ''
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function getPostAuthor(post) {
  const candidate = post?.author || post?.createdBy || post?.user || post?.updatedBy
  if (!candidate || typeof candidate !== 'object') return { name: getDisplayText(candidate) || 'SmartMall Editorial' }
  return {
    name: candidate.fullName || candidate.name || candidate.username || candidate.email || 'SmartMall Editorial',
    avatar: candidate.avatar || candidate.avatarUrl || candidate.image || '',
    bio: candidate.bio || candidate.description || ''
  }
}

function buildShareUrls({ title, url }) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title || '')

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  }
}

async function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const copied = document.execCommand('copy')
    if (!copied) throw new Error('Copy command failed')
  } finally {
    document.body.removeChild(textarea)
  }
}

function SharePostModal({ open, onClose, post, postUrl }) {
  const [copiedMessage, contextHolder] = message.useMessage()
  const shareUrls = useMemo(() => buildShareUrls({ title: post?.title, url: postUrl }), [post?.title, postUrl])
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=168x168&data=${encodeURIComponent(postUrl)}`

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(postUrl)
      copiedMessage.success('Link copied')
    } catch {
      copiedMessage.error('Could not copy link')
    }
  }

  const shareItems = [
    { key: 'facebook', label: 'Facebook', icon: <FaFacebookF />, className: 'blog-share-action--facebook', href: shareUrls.facebook },
    { key: 'twitter', label: 'Twitter', icon: <FaTwitter />, className: 'blog-share-action--twitter', href: shareUrls.twitter },
    { key: 'linkedin', label: 'LinkedIn', icon: <FaLinkedinIn />, className: 'blog-share-action--linkedin', href: shareUrls.linkedin },
    { key: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp />, className: 'blog-share-action--whatsapp', href: shareUrls.whatsapp },
    { key: 'email', label: 'Email', icon: <Mail />, className: 'blog-share-action--email', href: shareUrls.email }
  ]

  return (
    <Modal
      centered
      className="blog-share-modal"
      footer={null}
      open={open}
      title={null}
      width={560}
      onCancel={onClose}
    >
      {contextHolder}
      <div className="blog-share-modal__header">
        <h2>Share this post</h2>
        <p>Share this article with your friends and followers.</p>
      </div>

      <div className="blog-share-actions" aria-label="Share channels">
        {shareItems.map(item => (
          <a
            className={`blog-share-action ${item.className}`}
            href={item.href}
            key={item.key}
            rel="noopener noreferrer"
            target={item.key === 'email' ? undefined : '_blank'}
          >
            <span className="blog-share-action__icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      <div className="blog-share-copy">
        <label htmlFor="blog-share-link">Copy link</label>
        <div className="blog-share-copy__row">
          <Input id="blog-share-link" readOnly value={postUrl} />
          <Button onClick={handleCopy}>Copy</Button>
        </div>
      </div>

      <div className="blog-share-qr">
        <span>Or scan QR code</span>
        <img src={qrCodeUrl} alt="QR code for this post" />
      </div>
    </Modal>
  )
}

function BlogDetailSection({ section, post, sanitizedContent, headings, readTime, relatedProducts, relatedPosts, language, t, onShareClick }) {
  const settings = { ...(TEMPLATE_SECTION_DEFAULTS[section.type] || {}), ...(section.settings || {}) }

  if (section.type === 'post_header') {
    const categoryName = getDisplayText(post.category)
    const author = getPostAuthor(post)
    const heroClassName = [
      'blog-detail-hero',
      `blog-detail-hero--${settings.layout || 'standard'}`,
      settings.alignment === 'center' ? 'blog-detail-hero--center' : ''
    ].filter(Boolean).join(' ')

    return (
      <article className={heroClassName}>
        <div className="blog-detail-hero__masthead">
          <span>SMARTMALL BLOG</span>
          {settings.showCategory === false ? null : <span>{categoryName || t('breadcrumb.blog')}</span>}
        </div>
        <h1>{post.title}</h1>
        {settings.layout === 'compact' ? null : <div className="blog-detail-hero__ticker"><strong>NEWS TICKER+++</strong><span>{post.excerpt || post.title}</span></div>}
        <div className="blog-detail-hero__copy">
          <div className="blog-detail-hero__lead">
            {settings.showCategory === false ? null : <span>{categoryName || t('breadcrumb.blog')}</span>}
            {post.excerpt ? <p>{post.excerpt}</p> : null}
          </div>
          <div className="blog-detail-meta">
            {settings.showAuthor === false ? null : <span><UserRound className="blog-detail-icon" />{author.name || t('labels.author')}</span>}
            {settings.showDate === false || !post.publishedAt ? null : <span><CalendarDays className="blog-detail-icon" />{formatDate(post.publishedAt, language)}</span>}
            {settings.showReadingTime === false ? null : <span><Clock3 className="blog-detail-icon" />{t('labels.readTime', { count: readTime })}</span>}
            {settings.showCategory === false || !categoryName ? null : <Tag>{categoryName}</Tag>}
            {settings.showShare === false ? null : <Button icon={<Share2 className="blog-detail-icon" />} onClick={onShareClick}>{t('detail.share')}</Button>}
          </div>
        </div>
        {settings.showThumbnail === false ? null : <img className="blog-detail-hero__image" src={post.thumbnail || FALLBACK_IMAGE} alt={post.title} />}
      </article>
    )
  }

  if (section.type === 'post_content') {
    const plainContent = getPlainTextFromHtml(sanitizedContent)

    const handleCopyContent = async () => {
      try {
        if (!navigator.clipboard) throw new Error('Clipboard unavailable')
        await navigator.clipboard.writeText(plainContent)
        message.success(t('detail.copyContentSuccess', { defaultValue: 'Content copied' }))
      } catch {
        message.error(t('detail.copyContentError', { defaultValue: 'Could not copy content' }))
      }
    }

    const handleSummarizeContent = () => {
      window.dispatchEvent(new CustomEvent('smartmall:chat-send', {
        detail: {
          message: 'Tóm tắt trang này',
          currentPage: window.location.pathname,
          pageContext: buildBlogPageContext(post)
        }
      }))
    }

    return (
      <section className={`blog-detail-layout blog-detail-layout--${settings.typography || 'comfortable'}`}>
        <article className="blog-detail-content">
          <div className="blog-detail-content__tools">
            <Button icon={<Sparkles className="blog-detail-icon" />} onClick={handleSummarizeContent}>
              {t('detail.summarizeContent', { defaultValue: 'Tóm tắt' })}
            </Button>
            <Button icon={<Copy className="blog-detail-icon" />} onClick={handleCopyContent}>
              {t('detail.copyContent', { defaultValue: 'Copy content' })}
            </Button>
          </div>
          <div className={`blog-detail-rich-content${settings.showDropCap ? ' blog-detail-rich-content--dropcap' : ''}`} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          {settings.showNewsletter ? (
            <div className="blog-detail-newsletter">
              <strong>{t('detail.newsletterTitle', { defaultValue: 'Get more SmartMall stories' })}</strong>
              <span>{t('detail.newsletterDescription', { defaultValue: 'Follow product guides, deals and shopping insights from the blog.' })}</span>
              <Button href="/blog">{t('actions.backToBlog')}</Button>
            </div>
          ) : null}
        </article>
      </section>
    )
  }

  if (section.type === 'table_of_contents') {
    if (!headings.length) return null
    const content = <div className="blog-detail-toc__links">{headings.map(item => <a className={item.level === 'h3' ? 'blog-detail-toc__sub' : ''} href={`#${item.id}`} key={item.id}>{item.title}</a>)}</div>
    return (
      <section className={`blog-detail-sidebar-card blog-detail-toc${settings.sticky ? ' blog-detail-toc--sticky' : ''}`}>
        {settings.collapsible ? <details open><summary>{settings.title || t('sections.toc')}</summary>{content}</details> : <><h2>{settings.title || t('sections.toc')}</h2>{content}</>}
      </section>
    )
  }

  if (section.type === 'related_products') {
    const items = relatedProducts.slice(0, Number(settings.limit) || 3)
    return items.length ? (
      <section className="blog-detail-sidebar-card">
        <h2>{settings.title || t('sections.relatedProducts')}</h2>
        <div className={`blog-product-stack blog-product-stack--${settings.layout || 'grid'}`}>
          {items.map(product => (
            <Link to={getProductUrl(product)} className="blog-product-card" key={product._id || getProductName(product)}>
              <ShoppingBag className="blog-detail-icon" />
              <span>{getProductName(product)}</span>
              {settings.showPrice === false ? null : <small>{formatProductPrice(product, language)}</small>}
              <ArrowRight className="blog-detail-icon" />
            </Link>
          ))}
        </div>
      </section>
    ) : null
  }

  if (section.type === 'tags') {
    return Array.isArray(post.tags) && post.tags.length ? <section className={`blog-detail-tags blog-detail-tags--${settings.style || 'pills'}`}><span>{settings.title || t('sections.tags')}</span><div>{post.tags.map((tag, index) => getDisplayText(tag) ? <Tag key={getStableKey(tag, index)}>{getDisplayText(tag)}</Tag> : null)}</div></section> : null
  }

  if (section.type === 'related_posts') {
    return (
      <section className={`blog-detail-related blog-detail-related--${settings.layout || 'cards'}`}>
        <h2>{settings.title || t('sections.relatedPosts')}</h2>
        <div className="blog-related-posts">
          {relatedPosts.slice(0, Number(settings.limit) || 3).map(item => (
            <Link to={`/blog/${item.slug}`} className="blog-related-card" key={item._id}>
              <img src={item.thumbnail || FALLBACK_IMAGE} alt={item.title} />
              <div className="blog-related-card__body">
                {getDisplayText(item.category) ? <span className="blog-related-card__category">{getDisplayText(item.category)}</span> : null}
                <strong>{item.title}</strong>
                {settings.showExcerpt === false || !item.excerpt ? null : <p>{item.excerpt}</p>}
                <small>
                  {item.publishedAt ? <>{formatDate(item.publishedAt, language)}<span>•</span></> : null}
                  {t('labels.readTime', { count: estimateReadTime(item.content || item.excerpt) })}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  if (section.type === 'cta') {
    return (
      <section className="blog-detail-cta">
        <div className="blog-detail-cta__body">
          <strong>{settings.title || t('detail.ctaTitle')}</strong>
          <span>{settings.description || t('detail.ctaDescription')}</span>
          <Button href={settings.primaryUrl || '/products'}>
            <span>{settings.primaryText || t('detail.ctaAction')}</span>
            <ArrowRight className="blog-detail-cta__button-icon" />
          </Button>
          {settings.secondaryText ? <Button className="blog-detail-cta__secondary" href={settings.secondaryUrl || '/blog'}>{settings.secondaryText}</Button> : null}
        </div>
        <div className="blog-detail-cta__art" aria-hidden="true">
          <img className="blog-detail-cta__gift" src="/images/box.png" alt="" loading="lazy" />
        </div>
      </section>
    )
  }

  if (section.type === 'author_box') {
    const author = getPostAuthor(post)
    return (
      <section className="blog-detail-sidebar-card blog-detail-author-box">
        <h2>{settings.title || 'Author'}</h2>
        <div className="blog-detail-author-box__body">
          {settings.showAvatar === false ? null : <span className="blog-detail-author-box__avatar">{author.avatar ? <img src={author.avatar} alt={author.name} /> : <UserRound className="blog-detail-icon" />}</span>}
          <div>
            <strong>{author.name || t('labels.author')}</strong>
            {settings.showBio === false ? null : <p>{author.bio || t('detail.authorFallback', { defaultValue: 'SmartMall editorial team shares shopping guides, product ideas and platform updates.' })}</p>}
            {settings.showSocial === false ? null : <Button href="/blog" size="small">{t('breadcrumb.blog')}</Button>}
          </div>
        </div>
      </section>
    )
  }
  if (section.type === 'comments') {
    if (settings.allowComments === false) return null
    return <section className="blog-detail-sidebar-card blog-detail-comments"><h2>{settings.title || 'Comments'}</h2>{settings.moderationNotice ? <p>{t('detail.commentModeration', { defaultValue: 'Comments are reviewed before appearing publicly.' })}</p> : null}<Empty image={<MessageCircle />} /></section>
  }
  return null
}

function BlogDetailLoading({ text }) {
  return (
    <main className="blog-detail-page" aria-busy="true">
      <section className="blog-detail-loading">
        <div className="blog-detail-loading__masthead">
          <span className="blog-detail-loading__line blog-detail-loading__line--kicker" />
          <span className="blog-detail-loading__line blog-detail-loading__line--kicker" />
        </div>

        <div className="blog-detail-loading__headline">
          <span />
          <span />
          <span />
        </div>

        <div className="blog-detail-loading__ticker">
          <span>{text}</span>
          <i />
        </div>

        <div className="blog-detail-loading__copy">
          <div>
            <span className="blog-detail-loading__line blog-detail-loading__line--lead" />
            <span className="blog-detail-loading__line blog-detail-loading__line--lead-short" />
          </div>
          <div className="blog-detail-loading__meta">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="blog-detail-loading__image" />
      </section>

      <section className="blog-detail-layout">
        <article className="blog-detail-content blog-detail-loading__content">
          <span />
          <span />
          <span />
          <span />
          <span />
        </article>
      </section>
    </main>
  )
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
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchPost = async () => {
      setLoading(true)
      setError('')
      setPost(null)

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

  const activePost = post?.slug === slug ? post : null
  const sanitizedContent = useMemo(() => sanitizeRichHtml(activePost?.content || activePost?.excerpt), [activePost?.content, activePost?.excerpt])
  const headings = useMemo(() => extractHeadings(activePost?.content), [activePost?.content])
  const readTime = estimateReadTime(activePost?.content || activePost?.excerpt)
  const templateSections = useMemo(() => {
    const sections = Array.isArray(templatePage?.sections) ? templatePage.sections.filter(section => section?.enabled !== false) : []
    return hydrateTemplateSections(sections.length ? sections : DEFAULT_TEMPLATE_SECTIONS)
  }, [templatePage])
  const relatedProducts = Array.isArray(activePost?.relatedProducts) ? activePost.relatedProducts.filter(product => typeof product === 'object').slice(0, 6) : []
  const pageEntity = useMemo(() => {
    if (!activePost) return null

    return {
      type: 'blog_post',
      id: activePost._id,
      slug: activePost.slug,
      title: activePost.title,
      description: getPlainTextFromHtml(activePost.excerpt || activePost.seo?.description || activePost.content).slice(0, 1000),
      category: getDisplayText(activePost.category)
    }
  }, [activePost])

  useRegisterPageEntity(pageEntity)
  const postUrl = useMemo(() => {
    if (!activePost?.slug) return ''
    if (typeof window !== 'undefined') return window.location.href
    return `https://smartmall.site/blog/${activePost.slug}`
  }, [activePost])

  if (loading) {
    return <BlogDetailLoading text={t('messages.loading')} />
  }

  if (error || !activePost) {
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
      <SEO title={activePost.seo?.title || activePost.title} description={activePost.seo?.description || activePost.excerpt} url={`https://smartmall.site/blog/${activePost.slug}`} />

      <section className="blog-detail-breadcrumb">
        <Link to="/"><Home className="blog-detail-icon" />{t('breadcrumb.home')}</Link>
        <span>/</span>
        <Link to="/blog">{t('breadcrumb.blog')}</Link>
        <span>/</span>
        <span>{activePost.title}</span>
      </section>

      {templateSections.map(section => (
        <BlogDetailSection
          key={section.id}
          section={section}
          post={activePost}
          sanitizedContent={sanitizedContent}
          headings={headings}
          readTime={readTime}
          relatedProducts={relatedProducts}
          relatedPosts={relatedPosts}
          language={language}
          t={t}
          onShareClick={() => setShareOpen(true)}
        />
      ))}

      <SharePostModal open={shareOpen} onClose={() => setShareOpen(false)} post={activePost} postUrl={postUrl} />
    </main>
  )
}
