import { useState, useEffect, useCallback, useRef } from 'react'
import { message, Modal } from 'antd'
import { Star, Trash2, MessageSquare, Search, RefreshCw, ChevronLeft, ChevronRight, X, Send, ShieldCheck, ExternalLink } from 'lucide-react'
import { get, del } from '@/utils/request'
import { adminReplyReview, adminDeleteReply } from '@/services/reviewService'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

// ── Helpers ────────────────────────────────────────────────────────────────
const StarDisplay = ({ value, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size} className={s <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-600'} />
    ))}
  </div>
)

const Avatar = ({ user }) => {
  const name = user?.fullName || user?.username || '?'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (user?.avatarUrl)
    return <img src={user.avatarUrl} alt={name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow flex-shrink-0" />
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow flex-shrink-0">
      {initials}
    </div>
  )
}

const RatingBadge = ({ rating }) => {
  const colors = {
    5: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    4: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    1: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${colors[rating] || colors[3]}`}>
      <Star size={10} className="fill-current" />
      {rating}
    </span>
  )
}

// ── Reply Modal ─────────────────────────────────────────────────────────────
function ReplyModal({ review, open, onClose, onSave }) {
  const [content, setContent] = useState(review?.sellerReply?.content || '')
  const [loading, setLoading] = useState(false)
  const isEdit = !!review?.sellerReply?.content

  useEffect(() => {
    setContent(review?.sellerReply?.content || '')
  }, [review])

  const handleSubmit = async () => {
    if (!content.trim()) return message.warning('Vui lòng nhập nội dung phản hồi')
    setLoading(true)
    try {
      await adminReplyReview(review._id, content)
      message.success(isEdit ? 'Đã cập nhật phản hồi' : 'Đã gửi phản hồi')
      onSave(review._id, content)
      onClose()
    } catch (err) {
      message.error(err.message || 'Gửi phản hồi thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-500" />
            {isEdit ? 'Chỉnh sửa phản hồi Shop' : 'Phản hồi với tư cách Shop'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Original review snippet */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Avatar user={review?.userId} />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{review?.userId?.fullName || 'Khách hàng'}</p>
              <StarDisplay value={review?.rating} />
            </div>
          </div>
          {review?.content && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">"{review.content}"</p>}
        </div>

        <div className="px-6 py-4 space-y-3">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Nhập nội dung phản hồi của Shop..."
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          />
          <div className="text-xs text-gray-400 text-right -mt-1">{content.length}/1000</div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Huỷ</button>
            <button onClick={handleSubmit} disabled={loading || !content.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
              <Send size={14} />
              {loading ? 'Đang gửi...' : isEdit ? 'Cập nhật' : 'Gửi phản hồi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Review Row ───────────────────────────────────────────────────────────────
function ReviewRow({ review, onReply, onDeleteReply, onDelete }) {
  const [imgOpen, setImgOpen] = useState(false)

  const allMedia = [
    ...(review.images || []).map(url => ({ url, isVideo: false })),
    ...(review.videos || []).map(url => ({ url, isVideo: true }))
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: user + product */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* User & rating */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar user={review.userId} />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                  {review.userId?.fullName || review.userId?.username || 'Khách hàng'}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{review.userId?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RatingBadge rating={review.rating} />
              <span className="text-[11px] text-gray-400">{dayjs(review.createdAt).fromNow()}</span>
            </div>
          </div>

          {/* Product */}
          {review.productId && (
            <a href={`/product/${review.productId.slug}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
              <ExternalLink size={12} />
              <span className="truncate">{review.productId.title}</span>
            </a>
          )}

          {/* Content */}
          {review.title && <p className="font-semibold text-sm text-gray-800 dark:text-white">{review.title}</p>}
          {review.content && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.content}</p>}

          {/* Media */}
          {allMedia.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allMedia.slice(0, 6).map((item, i) => (
                <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
                  {item.isVideo
                    ? <video src={item.url} className="w-full h-full object-cover" muted />
                    : <img src={item.url} alt="" className="w-full h-full object-cover" />
                  }
                </div>
              ))}
              {allMedia.length > 6 && (
                <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-medium">
                  +{allMedia.length - 6}
                </div>
              )}
            </div>
          )}

          {/* Seller Reply */}
          {review.sellerReply?.content && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                  <ShieldCheck size={13} /> Phản hồi của Shop
                </span>
                <span className="text-[10px] text-blue-400">{dayjs(review.sellerReply.repliedAt).fromNow()}</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">{review.sellerReply.content}</p>
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex sm:flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onReply(review)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors"
          >
            <MessageSquare size={13} />
            {review.sellerReply?.content ? 'Sửa phản hồi' : 'Phản hồi'}
          </button>

          {review.sellerReply?.content && (
            <button
              onClick={() => onDeleteReply(review._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg transition-colors"
            >
              <X size={13} /> Xoá phản hồi
            </button>
          )}

          <button
            onClick={() => onDelete(review._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg transition-colors"
          >
            <Trash2 size={13} /> Xoá
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 border ${color} shadow-sm`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────
const LIMIT = 15

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [replyTarget, setReplyTarget] = useState(null)
  const [stats, setStats] = useState({ total: 0, avg: 0, replied: 0, dist: {} })

  const searchTimer = useRef(null)

  // ── Fetch ──
  const fetchReviews = useCallback(async (pg = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: pg, limit: LIMIT })
      if (ratingFilter) params.set('rating', ratingFilter)
      if (search.trim()) params.set('search', search.trim())
      const data = await get(`admin/reviews?${params}`)
      setReviews(data.reviews || [])
      setTotal(data.total || 0)

      // compute stats from full data (first load only)
      if (pg === 1 && !ratingFilter && !search.trim()) {
        const all = await get('admin/reviews?limit=10000')
        const allRevs = all.reviews || []
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        let sum = 0
        let repliedCount = 0
        allRevs.forEach(r => {
          dist[r.rating] = (dist[r.rating] || 0) + 1
          sum += r.rating
          if (r.sellerReply?.content) repliedCount++
        })
        setStats({
          total: allRevs.length,
          avg: allRevs.length ? (sum / allRevs.length).toFixed(1) : 0,
          replied: repliedCount,
          dist
        })
      }
    } catch (err) {
      message.error('Không thể tải đánh giá')
    } finally {
      setLoading(false)
    }
  }, [ratingFilter, search])

  useEffect(() => {
    setPage(1)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchReviews(1), 400)
    return () => clearTimeout(searchTimer.current)
  }, [ratingFilter, search, fetchReviews])

  // ── Actions ──
  const handleReply = (review) => setReplyTarget(review)

  const handleReplySaved = (reviewId, content) => {
    setReviews(prev => prev.map(r => r._id === reviewId ? {
      ...r,
      sellerReply: { content, repliedAt: new Date().toISOString() }
    } : r))
  }

  const handleDeleteReply = (reviewId) => {
    Modal.confirm({
      title: 'Xoá phản hồi',
      content: 'Bạn có chắc muốn xoá phản hồi của Shop không?',
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await adminDeleteReply(reviewId)
          setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, sellerReply: { content: '', repliedAt: null } } : r))
          message.success('Đã xoá phản hồi')
        } catch (err) {
          message.error(err.message || 'Xoá phản hồi thất bại')
        }
      }
    })
  }

  const handleDelete = (reviewId) => {
    Modal.confirm({
      title: 'Xoá đánh giá',
      content: 'Xoá vĩnh viễn đánh giá này? Hành động không thể hoàn tác.',
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await del(`admin/reviews/${reviewId}`)
          setReviews(prev => prev.filter(r => r._id !== reviewId))
          setTotal(t => t - 1)
          message.success('Đã xoá đánh giá')
        } catch (err) {
          message.error(err.message || 'Xoá thất bại')
        }
      }
    })
  }

  const totalPages = Math.ceil(total / LIMIT)

  const replyRate = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Star size={22} className="text-yellow-400 fill-yellow-400" />
            Quản lý đánh giá
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Xem, phản hồi và kiểm duyệt đánh giá sản phẩm</p>
        </div>
        <button onClick={() => fetchReviews(page)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Tổng đánh giá" value={stats.total} sub="tất cả sản phẩm" color="border-purple-100 dark:border-purple-800/40" />
        <StatCard label="Điểm trung bình" value={`⭐ ${stats.avg}`} sub="trên thang 5 sao" color="border-yellow-100 dark:border-yellow-800/40" />
        <StatCard label="Đã phản hồi" value={stats.replied} sub={`${replyRate}% tỷ lệ phản hồi`} color="border-blue-100 dark:border-blue-800/40" />
        <StatCard label="Chưa phản hồi" value={stats.total - stats.replied} sub="cần xử lý" color="border-red-100 dark:border-red-800/40" />
      </div>

      {/* Rating distribution */}
      {stats.total > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Phân bổ đánh giá</p>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.dist[star] || 0
              const pct = stats.total ? (count / stats.total) * 100 : 0
              const isActive = ratingFilter === String(star)
              return (
                <button key={star} onClick={() => setRatingFilter(isActive ? '' : String(star))}
                  className={`flex items-center gap-2 w-full group transition-opacity ${isActive ? 'opacity-100' : 'hover:opacity-80'}`}>
                  <div className="flex items-center gap-1 min-w-[40px]">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{star}</span>
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-yellow-400' : 'bg-yellow-300 group-hover:bg-yellow-400'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 min-w-[28px] text-right">{count}</span>
                </button>
              )
            })}
          </div>
          {ratingFilter && (
            <button onClick={() => setRatingFilter('')}
              className="mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline">
              <X size={11} /> Bỏ lọc {ratingFilter} sao
            </button>
          )}
        </div>
      )}

      {/* Search & filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng, nội dung..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-purple-400 transition-colors shadow-sm"
          />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
          {total} kết quả
        </span>
      </div>

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm animate-pulse border border-gray-100 dark:border-gray-700">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <Star size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-gray-400 dark:text-gray-500 font-medium">Không có đánh giá nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewRow
              key={review._id}
              review={review}
              onReply={handleReply}
              onDeleteReply={handleDeleteReply}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button disabled={page <= 1} onClick={() => { const np = page - 1; setPage(np); fetchReviews(np) }}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = i + 1
            return (
              <button key={pg} onClick={() => { setPage(pg); fetchReviews(pg) }}
                className={`w-9 h-9 rounded-xl text-sm font-medium border transition-colors ${pg === page ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                {pg}
              </button>
            )
          })}
          <button disabled={page >= totalPages} onClick={() => { const np = page + 1; setPage(np); fetchReviews(np) }}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Reply Modal */}
      <ReplyModal
        review={replyTarget}
        open={!!replyTarget}
        onClose={() => setReplyTarget(null)}
        onSave={handleReplySaved}
      />
    </div>
  )
}
