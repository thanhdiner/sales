import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { message, Modal } from 'antd'
import { Star, ThumbsUp, MoreVertical, Pencil, Trash2, Send, X, ChevronLeft, ChevronRight, ImageIcon, VideoIcon, ShieldCheck } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getReviews, createReview, updateReview, deleteReview, voteReview, adminReplyReview, adminDeleteReply } from '@/services/reviewService'
import { getClientAccessToken, getAccessToken } from '@/utils/auth'

//──────────────────────────────────────────────
// Tiny helpers
//──────────────────────────────────────────────

const StarDisplay = ({ value, size = 16 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size} className={s <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
    ))}
  </div>
)

const Avatar = ({ user }) => {
  const name = user?.fullName || user?.username || '?'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (user?.avatarUrl)
    return <img src={user.avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow">
      {initials}
    </div>
  )
}

const timeAgo = dateStr => {
  const diff = Date.now() - new Date(dateStr)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

//──────────────────────────────────────────────
// Media Gallery Lightbox
//──────────────────────────────────────────────
const Lightbox = ({ items, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex)
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  const item = items[idx]
  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={onClose}><X size={32} /></button>
      {idx > 0 && (
        <button className="absolute left-4 text-white hover:text-gray-300 bg-black/40 p-2 rounded-full"
          onClick={e => { e.stopPropagation(); setIdx(i => i - 1) }}>
          <ChevronLeft size={28} />
        </button>
      )}
      {idx < items.length - 1 && (
        <button className="absolute right-4 text-white hover:text-gray-300 bg-black/40 p-2 rounded-full"
          onClick={e => { e.stopPropagation(); setIdx(i => i + 1) }}>
          <ChevronRight size={28} />
        </button>
      )}
      <div className="max-w-4xl max-h-[90vh] flex items-center" onClick={e => e.stopPropagation()}>
        {item?.isVideo
          ? <video src={item.url} controls autoPlay className="max-h-[85vh] max-w-full rounded-lg" />
          : <img src={item.url} alt="" className="max-h-[85vh] max-w-full rounded-lg object-contain" />
        }
      </div>
      <div className="absolute bottom-4 text-white/60 text-sm">{idx + 1} / {items.length}</div>
    </div>
  )
}

//──────────────────────────────────────────────
// File upload preview strip
//──────────────────────────────────────────────
const FilePreview = ({ files, onRemove }) => {
  if (!files.length) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {files.map((f, i) => (
        <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {f.type.startsWith('video')
            ? <video src={URL.createObjectURL(f)} className="w-full h-full object-cover" muted />
            : <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
          }
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}

//──────────────────────────────────────────────
// Review Form (create + edit)
//──────────────────────────────────────────────
const ReviewForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [rating, setRating] = useState(initial?.rating || 5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [newFiles, setNewFiles] = useState([])
  const [keepImages, setKeepImages] = useState(initial?.images || [])
  const [keepVideos, setKeepVideos] = useState(initial?.videos || [])
  const fileInputRef = useRef()

  const handleFiles = e => {
    const picked = Array.from(e.target.files)
    setNewFiles(prev => [...prev, ...picked])
    e.target.value = ''
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!rating) return message.warning('Vui lòng chọn số sao')
    const fd = new FormData()
    fd.append('rating', rating)
    fd.append('title', title)
    fd.append('content', content)
    fd.append('keepImages', JSON.stringify(keepImages))
    fd.append('keepVideos', JSON.stringify(keepVideos))
    newFiles.forEach(f => fd.append('files', f))
    onSubmit(fd)
  }

  const starLabels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc']
  const displayRating = hoverRating || rating

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star picker */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(s)}
              className="focus:outline-none transition-transform hover:scale-125"
            >
              <Star size={32} className={s <= displayRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            </button>
          ))}
        </div>
        {displayRating > 0 && (
          <span className="text-sm font-medium text-yellow-600">{starLabels[displayRating]}</span>
        )}
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Tiêu đề đánh giá (tuỳ chọn)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={200}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      {/* Content */}
      <textarea
        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={2000}
        rows={4}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <div className="text-xs text-gray-400 text-right -mt-2">{content.length}/2000</div>

      {/* Keep existing media */}
      {(keepImages.length > 0 || keepVideos.length > 0) && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Ảnh/video hiện tại:</p>
          <div className="flex flex-wrap gap-2">
            {keepImages.map((url, i) => (
              <div key={url} className="relative group w-16 h-16 rounded-lg overflow-hidden border">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setKeepImages(p => p.filter((_, j) => j !== i))}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            ))}
            {keepVideos.map((url, i) => (
              <div key={url} className="relative group w-16 h-16 rounded-lg overflow-hidden border">
                <video src={url} className="w-full h-full object-cover" muted />
                <button type="button" onClick={() => setKeepVideos(p => p.filter((_, j) => j !== i))}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New file upload */}
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-purple-400 hover:text-purple-500 transition-colors"
        >
          <ImageIcon size={16} />
          <VideoIcon size={16} />
          Thêm ảnh / video
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFiles} />
        <FilePreview files={newFiles} onRemove={i => setNewFiles(p => p.filter((_, j) => j !== i))} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow"
        >
          {loading
            ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
            : <Send size={16} />
          }
          {initial ? 'Cập nhật' : 'Gửi đánh giá'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Huỷ
          </button>
        )}
      </div>
    </form>
  )
}

//──────────────────────────────────────────────
// Rating Summary Bar
//──────────────────────────────────────────────
const RatingSummary = ({ summary, activeFilter, onFilter }) => {
  const { avgRating, totalCount, ratingDist } = summary
  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
      {/* Big number */}
      <div className="text-center min-w-[100px]">
        <div className="text-5xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</div>
        <StarDisplay value={avgRating} size={18} />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{totalCount} đánh giá</div>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-1.5 w-full">
        {[5, 4, 3, 2, 1].map(star => {
          const count = ratingDist[star] || 0
          const pct = totalCount ? (count / totalCount) * 100 : 0
          const isActive = activeFilter === String(star)
          return (
            <button
              key={star}
              onClick={() => onFilter(isActive ? '' : String(star))}
              className={`flex items-center gap-2 w-full group hover:opacity-80 transition-opacity ${isActive ? 'opacity-100' : ''}`}
            >
              <div className="flex items-center gap-1 min-w-[48px]">
                <span className="text-sm text-gray-600 dark:text-gray-300">{star}</span>
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-yellow-400' : 'bg-yellow-300 group-hover:bg-yellow-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[28px] text-right">{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

//──────────────────────────────────────────────
// Media Gallery (all images + videos from reviews)
//──────────────────────────────────────────────
const MediaGallery = ({ reviews }) => {
  const [lightbox, setLightbox] = useState(null)

  const allMedia = reviews.flatMap(r => [
    ...r.images.map(url => ({ url, isVideo: false })),
    ...r.videos.map(url => ({ url, isVideo: true }))
  ])

  if (!allMedia.length) return null

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <ImageIcon size={16} /> Ảnh &amp; Video từ khách hàng ({allMedia.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {allMedia.slice(0, 12).map((item, i) => (
          <button key={i} onClick={() => setLightbox(i)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200 hover:scale-105 transition-transform shadow-sm relative">
            {item.isVideo
              ? <>
                  <video src={item.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <VideoIcon size={20} className="text-white" />
                  </div>
                </>
              : <img src={item.url} alt="" className="w-full h-full object-cover" />
            }
          </button>
        ))}
        {allMedia.length > 12 && (
          <button onClick={() => setLightbox(12)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium hover:bg-gray-200 transition-colors">
            +{allMedia.length - 12}
          </button>
        )}
      </div>
      {lightbox !== null && <Lightbox items={allMedia} startIndex={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  )
}

//──────────────────────────────────────────────
// Single Review Card
//──────────────────────────────────────────────
const ReviewCard = ({ review, currentUserId, isAdmin, onVote, onEdit, onDelete, onReply, onDeleteReply }) => {
  const [lightbox, setLightbox] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyContent, setReplyContent] = useState(review.sellerReply?.content || '')
  const [replyLoading, setReplyLoading] = useState(false)
  const menuRef = useRef()

  const allMedia = [
    ...review.images.map(url => ({ url, isVideo: false })),
    ...review.videos.map(url => ({ url, isVideo: true }))
  ]

  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return
    setReplyLoading(true)
    try {
      await onReply(review._id, replyContent)
      setReplyOpen(false)
    } finally {
      setReplyLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar user={review.userId} />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {review.userId?.fullName || review.userId?.username || 'Khách hàng'}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay value={review.rating} size={14} />
              <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Overflow menu – only for owner */}
        {review.isOwner && (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(v => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 min-w-[140px] z-20">
                <button onClick={() => { setMenuOpen(false); onEdit(review) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Pencil size={14} /> Chỉnh sửa
                </button>
                <button onClick={() => { setMenuOpen(false); onDelete(review._id) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700">
                  <Trash2 size={14} /> Xoá đánh giá
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {review.title && <p className="font-semibold text-gray-800 dark:text-white text-sm">{review.title}</p>}
      {review.content && <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{review.content}</p>}

      {/* Media thumbnails */}
      {allMedia.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allMedia.map((item, i) => (
            <button key={i} onClick={() => setLightbox(i)}
              className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 hover:scale-105 transition-transform relative">
              {item.isVideo
                ? <>
                    <video src={item.url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><VideoIcon size={16} className="text-white" /></div>
                  </>
                : <img src={item.url} alt="" className="w-full h-full object-cover" />
              }
            </button>
          ))}
          {lightbox !== null && <Lightbox items={allMedia} startIndex={lightbox} onClose={() => setLightbox(null)} />}
        </div>
      )}

      {/* Helpful button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onVote(review._id)}
          disabled={review.isOwner || !currentUserId}
          title={review.isOwner ? 'Không thể vote đánh giá của mình' : !currentUserId ? 'Đăng nhập để vote' : ''}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
            ${review.isVoted
              ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500'
            }
            ${(review.isOwner || !currentUserId) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <ThumbsUp size={14} className={review.isVoted ? 'fill-current' : ''} />
          <span>Hữu ích{review.helpfulCount > 0 ? ` (${review.helpfulCount})` : ''}</span>
        </button>
      </div>

      {/* Seller Reply */}
      {review.sellerReply?.content && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold text-sm">
              <ShieldCheck size={15} /> Phản hồi từ Shop
            </div>
            {isAdmin && (
              <div className="flex gap-1">
                <button onClick={() => { setReplyContent(review.sellerReply.content); setReplyOpen(true) }}
                  className="p-1 rounded text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"><Pencil size={13} /></button>
                <button onClick={() => onDeleteReply(review._id)}
                  className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={13} /></button>
              </div>
            )}
          </div>
          <p className="text-blue-800 dark:text-blue-200 text-sm">{review.sellerReply.content}</p>
          <p className="text-xs text-blue-400">{timeAgo(review.sellerReply.repliedAt)}</p>
        </div>
      )}

      {/* Admin reply form */}
      {isAdmin && !review.sellerReply?.content && (
        replyOpen
          ? (
            <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-3 space-y-2">
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                rows={3}
                placeholder="Nhập phản hồi của Shop..."
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button onClick={handleReplySubmit} disabled={replyLoading}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
                  <Send size={13} /> Gửi phản hồi
                </button>
                <button onClick={() => setReplyOpen(false)} className="px-3 py-1.5 text-gray-500 text-sm hover:text-gray-700">Huỷ</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setReplyOpen(true)}
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1">
              <ShieldCheck size={13} /> Phản hồi với tư cách Shop
            </button>
          )
      )}

      {/* Admin reply edit form (when reply exists) */}
      {isAdmin && review.sellerReply?.content && replyOpen && (
        <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-3 space-y-2">
          <textarea
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            rows={3}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="flex gap-2">
            <button onClick={handleReplySubmit} disabled={replyLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
              <Send size={13} /> Cập nhật phản hồi
            </button>
            <button onClick={() => setReplyOpen(false)} className="px-3 py-1.5 text-gray-500 text-sm hover:text-gray-700">Huỷ</button>
          </div>
        </div>
      )}
    </div>
  )
}

//──────────────────────────────────────────────
// Main ReviewSection
//──────────────────────────────────────────────
export default function ReviewSection({ productId }) {
  const navigate = useNavigate()
  const clientUser = useSelector(s => s.clientUser.user)
  const adminUser = useSelector(s => s.user.user)

  const isLoggedIn = !!getClientAccessToken()
  const isAdmin = !!getAccessToken() && !!adminUser
  const currentUserId = clientUser?._id || clientUser?.id

  // ── state ──
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ avgRating: 0, totalCount: 0, ratingDist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const LIMIT = 10

  const [sort, setSort] = useState('newest')
  const [ratingFilter, setRatingFilter] = useState('')

  const [loadingReviews, setLoadingReviews] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null) // null = not editing

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'helpful', label: 'Hữu ích nhất' },
    { value: 'highRating', label: 'Cao nhất' },
    { value: 'lowRating', label: 'Thấp nhất' }
  ]

  // ── fetch ──
  const fetchReviews = useCallback(async (pg = 1, s = sort, rf = ratingFilter) => {
    setLoadingReviews(true)
    try {
      const params = { sort: s, page: pg, limit: LIMIT }
      if (rf) params.rating = rf
      const data = await getReviews(productId, params)
      setReviews(data.reviews || [])
      setTotal(data.total || 0)
      if (data.summary) setSummary(data.summary)
    } catch {
      // silent – show empty state
    } finally {
      setLoadingReviews(false)
    }
  }, [productId, sort, ratingFilter])

  useEffect(() => {
    fetchReviews(1, sort, ratingFilter)
    setPage(1)
    // eslint-disable-next-line
  }, [productId, sort, ratingFilter])

  // ── create review ──
  const handleCreate = async fd => {
    if (!isLoggedIn) { message.info('Vui lòng đăng nhập để đánh giá'); navigate('/user/login'); return }
    setSubmitting(true)

    // Optimistic: add placeholder at top
    const optimisticId = 'opt-' + Date.now()
    const optimisticReview = {
      _id: optimisticId,
      userId: { _id: currentUserId, fullName: clientUser?.fullName, avatarUrl: clientUser?.avatarUrl, username: clientUser?.username },
      rating: Number(fd.get('rating')),
      title: fd.get('title'),
      content: fd.get('content'),
      images: [],
      videos: [],
      helpfulCount: 0,
      isVoted: false,
      isOwner: true,
      createdAt: new Date().toISOString()
    }
    setReviews(prev => [optimisticReview, ...prev])
    setSummary(prev => recalcSummary(prev, optimisticReview.rating, null))
    setShowForm(false)

    try {
      const data = await createReview(productId, fd)
      setReviews(prev => prev.map(r => r._id === optimisticId ? data.review : r))
      if (data.summary) setSummary(data.summary)
      else await fetchSummary()
      message.success('Đánh giá đã được gửi!')
    } catch (err) {
      setReviews(prev => prev.filter(r => r._id !== optimisticId))
      setSummary(prev => recalcSummary(prev, null, optimisticReview.rating))
      message.error(err.message || 'Gửi đánh giá thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  // ── update review ──
  const handleUpdate = async fd => {
    const prev = editingReview
    setSubmitting(true)

    // Optimistic
    setReviews(ps => ps.map(r => r._id === prev._id ? {
      ...r,
      rating: Number(fd.get('rating')),
      title: fd.get('title'),
      content: fd.get('content')
    } : r))
    setEditingReview(null)

    try {
      const data = await updateReview(prev._id, fd)
      setReviews(ps => ps.map(r => r._id === prev._id ? { ...data.review, isOwner: true } : r))
      await fetchSummary()
      message.success('Đã cập nhật đánh giá!')
    } catch (err) {
      setReviews(ps => ps.map(r => r._id === prev._id ? prev : r))
      message.error(err.message || 'Cập nhật thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  // ── delete review ──
  const handleDelete = reviewId => {
    Modal.confirm({
      title: 'Xoá đánh giá',
      content: 'Bạn chắc chắn muốn xoá đánh giá này không?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        const removed = reviews.find(r => r._id === reviewId)
        // Optimistic remove
        setReviews(prev => prev.filter(r => r._id !== reviewId))
        setTotal(t => t - 1)
        setSummary(prev => recalcSummary(prev, null, removed?.rating))
        try {
          await deleteReview(reviewId)
          message.success('Đã xoá đánh giá')
        } catch (err) {
          setReviews(prev => [removed, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
          setTotal(t => t + 1)
          setSummary(prev => recalcSummary(prev, removed?.rating, null))
          message.error(err.message || 'Xoá thất bại')
        }
      }
    })
  }

  // ── vote ──
  const handleVote = async reviewId => {
    if (!isLoggedIn) { message.info('Vui lòng đăng nhập để vote'); navigate('/user/login'); return }

    const target = reviews.find(r => r._id === reviewId)
    if (!target || target.isOwner) return

    const wasVoted = target.isVoted
    // Optimistic update
    setReviews(prev => prev.map(r => r._id === reviewId ? {
      ...r,
      isVoted: !wasVoted,
      helpfulCount: wasVoted ? r.helpfulCount - 1 : r.helpfulCount + 1
    } : r))

    try {
      await voteReview(reviewId)
    } catch (err) {
      // Revert
      setReviews(prev => prev.map(r => r._id === reviewId ? {
        ...r,
        isVoted: wasVoted,
        helpfulCount: wasVoted ? r.helpfulCount + 1 : r.helpfulCount - 1
      } : r))
      message.error(err.message || 'Vote thất bại')
    }
  }

  // ── seller reply ──
  const handleReply = async (reviewId, content) => {
    const prev = reviews.find(r => r._id === reviewId)
    const optimistic = { content, repliedAt: new Date().toISOString() }
    setReviews(ps => ps.map(r => r._id === reviewId ? { ...r, sellerReply: optimistic } : r))
    try {
      const data = await adminReplyReview(reviewId, content)
      setReviews(ps => ps.map(r => r._id === reviewId ? { ...r, sellerReply: data.sellerReply } : r))
      message.success('Đã gửi phản hồi')
    } catch (err) {
      setReviews(ps => ps.map(r => r._id === reviewId ? { ...r, sellerReply: prev?.sellerReply } : r))
      message.error(err.message || 'Gửi phản hồi thất bại')
    }
  }

  const handleDeleteReply = replyReviewId => {
    Modal.confirm({
      title: 'Xoá phản hồi',
      content: 'Xoá phản hồi của Shop?',
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ',
      onOk: async () => {
        setReviews(ps => ps.map(r => r._id === replyReviewId ? { ...r, sellerReply: { content: '', repliedAt: null } } : r))
        try {
          await adminDeleteReply(replyReviewId)
          message.success('Đã xoá phản hồi')
        } catch (err) {
          await fetchReviews(page)
          message.error(err.message || 'Xoá phản hồi thất bại')
        }
      }
    })
  }

  // ── helpers ──
  const recalcSummary = (prev, addRating, removeRating) => {
    const dist = { ...prev.ratingDist }
    if (removeRating) dist[removeRating] = Math.max(0, (dist[removeRating] || 0) - 1)
    if (addRating) dist[addRating] = (dist[addRating] || 0) + 1
    const total = Object.values(dist).reduce((a, b) => a + b, 0)
    const avg = total ? Object.entries(dist).reduce((s, [r, c]) => s + Number(r) * c, 0) / total : 0
    return { avgRating: Math.round(avg * 10) / 10, totalCount: total, ratingDist: dist }
  }

  const fetchSummary = async () => {
    try {
      const data = await getReviews(productId, { page: 1, limit: 1 })
      if (data.summary) setSummary(data.summary)
    } catch {}
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Đánh giá sản phẩm</h2>

      {/* Rating summary */}
      {summary.totalCount > 0 && (
        <RatingSummary summary={summary} activeFilter={ratingFilter} onFilter={rf => { setRatingFilter(rf); setPage(1) }} />
      )}

      {/* Write review CTA */}
      {!showForm && !editingReview && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          {isLoggedIn ? (
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Bạn đã mua sản phẩm này? Chia sẻ cảm nhận của bạn!</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow transition-opacity"
              >
                Viết đánh giá
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Đăng nhập để viết đánh giá</p>
              <button onClick={() => navigate('/user/login')}
                className="px-5 py-2.5 border-2 border-purple-500 text-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors">
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-purple-200 dark:border-purple-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Viết đánh giá của bạn</h3>
          <ReviewForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={submitting} />
        </div>
      )}

      {/* Edit form */}
      {editingReview && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Chỉnh sửa đánh giá</h3>
          <ReviewForm initial={editingReview} onSubmit={handleUpdate} onCancel={() => setEditingReview(null)} loading={submitting} />
        </div>
      )}

      {/* Filters & Sort */}
      {summary.totalCount > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {sortOptions.map(opt => (
              <button key={opt.value} onClick={() => setSort(opt.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${sort === opt.value ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 hover:border-purple-400 hover:text-purple-500'}`}>
                {opt.label}
              </button>
            ))}
          </div>
          {ratingFilter && (
            <button onClick={() => setRatingFilter('')}
              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm border border-yellow-300 hover:bg-yellow-200">
              <Star size={13} className="fill-yellow-500 text-yellow-500" /> {ratingFilter} sao
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {/* Media gallery */}
      {reviews.length > 0 && <MediaGallery reviews={reviews} />}

      {/* Review list */}
      {loadingReviews ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm animate-pulse space-y-3">
              <div className="flex gap-3"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="space-y-2 flex-1"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" /></div></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Star size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Chưa có đánh giá nào</p>
          <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onVote={handleVote}
              onEdit={r => { setEditingReview(r); setShowForm(false); window.scrollTo({ top: document.getElementById('reviews-section')?.offsetTop - 80, behavior: 'smooth' }) }}
              onDelete={handleDelete}
              onReply={handleReply}
              onDeleteReply={handleDeleteReply}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); fetchReviews(page - 1) }}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            ← Trước
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = i + 1
            return (
              <button key={pg} onClick={() => { setPage(pg); fetchReviews(pg) }}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${pg === page ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                {pg}
              </button>
            )
          })}
          <button disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); fetchReviews(page + 1) }}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Tiếp →
          </button>
        </div>
      )}
    </div>
  )
}
