import { Empty, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import { getBlogPostPreview } from '@/services/admin/content/blog'

export default function BlogPreview() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getBlogPostPreview(id)
      .then(response => { if (mounted) setPost(response?.data || null) })
      .catch(() => { if (mounted) setError('Preview unavailable') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) return <main className="blog-detail-page"><div className="blog-detail-state"><Spin /></div></main>
  if (error || !post) return <main className="blog-detail-page"><div className="blog-detail-state"><Empty description={error || 'Not found'} /></div></main>

  return (
    <main className="blog-detail-page">
      <SEO title={`Preview: ${post.title}`} noIndex />
      <article className="blog-detail-hero"><div className="blog-detail-hero__copy"><span>Draft preview</span><h1>{post.title}</h1>{post.excerpt ? <p>{post.excerpt}</p> : null}</div>{post.thumbnail ? <img src={post.thumbnail} alt={post.title} /> : null}</article>
      <section className="blog-detail-layout"><article className="blog-detail-content"><pre className="blog-detail-rich-content whitespace-pre-wrap">{String(post.content || post.excerpt || '').replace(/<[^>]*>/g, ' ')}</pre></article></section>
    </main>
  )
}
