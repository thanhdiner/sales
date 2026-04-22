import { useState, useEffect, useCallback, useRef } from 'react'
import { message, Modal } from 'antd'
import {
  Star,
  Trash2,
  MessageSquare,
  EyeOff,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  ShieldCheck,
  ExternalLink
} from 'lucide-react'
import { get, del } from '@/utils/request'
import { adminReplyReview, adminDeleteReply, adminHideReview } from '@/services/reviewService'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const LIMIT = 15

const StarDisplay = ({ value, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        size={size}
        strokeWidth={1.8}
        className={star <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}
      />
    ))}
  </div>
)

const Avatar = ({ user }) => {
  const name = user?.fullName || user?.username || '?'
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={name}
        className="h-9 w-9 flex-shrink-0 rounded-full border border-gray-200 object-cover dark:border-gray-700"
      />
    )
  }

  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
      {initials}
    </div>
  )
}

const RatingBadge = ({ rating }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
    <Star size={10} strokeWidth={1.8} className="fill-amber-400 text-amber-400" />
    {rating}
  </span>
)

function ReplyModal({ review, open, onClose, onSave }) {
  const [content, setContent] = useState(review?.sellerReply?.content || '')
  const [loading, setLoading] = useState(false)
  const isEdit = !!review?.sellerReply?.content

  useEffect(() => {
    setContent(review?.sellerReply?.content || '')
  }, [review])

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.warning('Vui lòng nhập nội dung phản hồi')
      return
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            <ShieldCheck size={18} strokeWidth={1.8} className="text-gray-600 dark:text-gray-300" />
            {isEdit ? 'Chỉnh sửa phản hồi Shop' : 'Phản hồi với tư cách Shop'}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="border-b border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center gap-2.5">
            <Avatar user={review?.userId} />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                {review?.userId?.fullName || 'Khách hàng'}
              </p>
              <StarDisplay value={review?.rating} />
            </div>
          </div>

          {review?.content && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">“{review.content}”</p>
          )}
        </div>

        <div className="space-y-3 px-5 py-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Nhập nội dung phản hồi của Shop..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-500"
          />

          <div className="text-right text-xs text-gray-400">{content.length}/1000</div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Huỷ
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Send size={14} strokeWidth={1.8} />
              {loading ? 'Đang gửi...' : isEdit ? 'Cập nhật' : 'Gửi phản hồi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewRow({ review, onReply, onDeleteReply, onHide, onDelete }) {
  const allMedia = [
    ...(review.images || []).map(url => ({ url, isVideo: false })),
    ...(review.videos || []).map(url => ({ url, isVideo: true }))
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar user={review.userId} />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {review.userId?.fullName || review.userId?.username || 'Khách hàng'}
                </p>
                <p className="truncate text-xs text-gray-400">{review.userId?.email}</p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              {review.hidden && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                  <EyeOff size={10} strokeWidth={1.8} />
                  Ẩn
                </span>
              )}
              <RatingBadge rating={review.rating} />
              <span className="text-xs text-gray-400">{dayjs(review.createdAt).fromNow()}</span>
            </div>
          </div>

          {review.productId && (
            <a
              href={`/product/${review.productId.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ExternalLink size={12} strokeWidth={1.8} />
              <span className="truncate">{review.productId.title}</span>
            </a>
          )}

          {review.title && <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{review.title}</p>}

          {review.content && <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{review.content}</p>}

          {allMedia.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allMedia.slice(0, 6).map((item, index) => (
                <div
                  key={index}
                  className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                >
                  {item.isVideo ? (
                    <video src={item.url} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              ))}

              {allMedia.length > 6 && (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  +{allMedia.length - 6}
                </div>
              )}
            </div>
          )}

          {review.sellerReply?.content && (
            <div className="space-y-1 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  <ShieldCheck size={13} strokeWidth={1.8} />
                  Phản hồi của Shop
                </span>

                <span className="text-[10px] text-gray-400">{dayjs(review.sellerReply.repliedAt).fromNow()}</span>
              </div>

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{review.sellerReply.content}</p>
            </div>
          )}

          {review.hidden && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Review này đang bị ẩn khỏi trang sản phẩm.
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => onReply(review)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <MessageSquare size={13} strokeWidth={1.8} />
            {review.sellerReply?.content ? 'Sửa phản hồi' : 'Phản hồi'}
          </button>

          {review.sellerReply?.content && (
            <button
              type="button"
              onClick={() => onDeleteReply(review._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X size={13} strokeWidth={1.8} />
              Xoá phản hồi
            </button>
          )}

          {!review.hidden && (
            <button
              type="button"
              onClick={() => onHide(review._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-900 dark:text-amber-300 dark:hover:bg-amber-950/20"
            >
              <EyeOff size={13} strokeWidth={1.8} />
              Ẩn review
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(review._id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-gray-700 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 size={13} strokeWidth={1.8} />
            Xoá
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

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

  const fetchReviews = useCallback(
    async (pg = 1) => {
      setLoading(true)

      try {
        const params = new URLSearchParams({ page: pg, limit: LIMIT })

        if (ratingFilter) params.set('rating', ratingFilter)
        if (search.trim()) params.set('search', search.trim())

        const data = await get(`admin/reviews?${params}`)

        setReviews(data.reviews || [])
        setTotal(data.total || 0)

        if (pg === 1 && !ratingFilter && !search.trim()) {
          const all = await get('admin/reviews?limit=10000')
          const allReviews = all.reviews || []
          const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

          let sum = 0
          let repliedCount = 0

          allReviews.forEach(review => {
            dist[review.rating] = (dist[review.rating] || 0) + 1
            sum += review.rating

            if (review.sellerReply?.content) {
              repliedCount += 1
            }
          })

          setStats({
            total: allReviews.length,
            avg: allReviews.length ? (sum / allReviews.length).toFixed(1) : 0,
            replied: repliedCount,
            dist
          })
        }
      } catch (err) {
        message.error('Không thể tải đánh giá')
      } finally {
        setLoading(false)
      }
    },
    [ratingFilter, search]
  )

  useEffect(() => {
    setPage(1)
    clearTimeout(searchTimer.current)

    searchTimer.current = setTimeout(() => fetchReviews(1), 400)

    return () => clearTimeout(searchTimer.current)
  }, [ratingFilter, search, fetchReviews])

  const handleReply = review => {
    setReplyTarget(review)
  }

  const handleReplySaved = (reviewId, content) => {
    setReviews(prev =>
      prev.map(review =>
        review._id === reviewId
          ? {
              ...review,
              sellerReply: {
                content,
                repliedAt: new Date().toISOString()
              }
            }
          : review
      )
    )
  }

  const handleDeleteReply = reviewId => {
    Modal.confirm({
      title: 'Xoá phản hồi',
      content: 'Bạn có chắc muốn xoá phản hồi của Shop không?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await adminDeleteReply(reviewId)

          setReviews(prev =>
            prev.map(review =>
              review._id === reviewId
                ? {
                    ...review,
                    sellerReply: {
                      content: '',
                      repliedAt: null
                    }
                  }
                : review
            )
          )

          message.success('Đã xoá phản hồi')
        } catch (err) {
          message.error(err.message || 'Xoá phản hồi thất bại')
        }
      }
    })
  }

  const handleDelete = reviewId => {
    Modal.confirm({
      title: 'Xoá đánh giá',
      content: 'Xoá vĩnh viễn đánh giá này? Hành động không thể hoàn tác.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await del(`admin/reviews/${reviewId}`)
          setReviews(prev => prev.filter(review => review._id !== reviewId))
          setTotal(prev => prev - 1)
          message.success('Đã xoá đánh giá')
        } catch (err) {
          message.error(err.message || 'Xoá thất bại')
        }
      }
    })
  }

  const handleHide = reviewId => {
    Modal.confirm({
      title: 'Ẩn đánh giá',
      content: 'Ẩn review này khỏi trang sản phẩm? Người dùng vẫn thấy review của họ nhưng khách khác sẽ không thấy.',
      okText: 'Ẩn',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await adminHideReview(reviewId)
          setReviews(prev =>
            prev.map(review =>
              review._id === reviewId
                ? {
                    ...review,
                    hidden: true,
                    hiddenAt: new Date().toISOString()
                  }
                : review
            )
          )
          message.success('Đã ẩn review')
        } catch (err) {
          message.error(err.message || 'Ẩn review thất bại')
        }
      }
    })
  }

  const totalPages = Math.ceil(total / LIMIT)
  const replyRate = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Quản lý đánh giá</h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem, phản hồi và kiểm duyệt đánh giá sản phẩm.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchReviews(page)}
          className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <RefreshCw size={14} strokeWidth={1.8} />
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Tổng đánh giá" value={stats.total} sub="tất cả sản phẩm" />
        <StatCard label="Điểm trung bình" value={stats.avg} sub="trên thang 5 sao" />
        <StatCard label="Đã phản hồi" value={stats.replied} sub={`${replyRate}% tỷ lệ phản hồi`} />
        <StatCard label="Chưa phản hồi" value={stats.total - stats.replied} sub="cần xử lý" />
      </div>

      {stats.total > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Phân bổ đánh giá
          </p>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.dist[star] || 0
              const percent = stats.total ? (count / stats.total) * 100 : 0
              const isActive = ratingFilter === String(star)

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingFilter(isActive ? '' : String(star))}
                  className="group flex w-full items-center gap-2"
                >
                  <div className="flex min-w-[42px] items-center gap-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{star}</span>
                    <Star size={11} strokeWidth={1.8} className="fill-amber-400 text-amber-400" />
                  </div>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isActive ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="min-w-[28px] text-right text-xs text-gray-400">{count}</span>
                </button>
              )
            })}
          </div>

          {ratingFilter && (
            <button
              type="button"
              onClick={() => setRatingFilter('')}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <X size={11} strokeWidth={1.8} />
              Bỏ lọc {ratingFilter} sao
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={1.8} />

          <input
            type="text"
            placeholder="Tìm theo tên khách hàng, nội dung..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-500"
          />
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400">{total} kết quả</span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex gap-3">
                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-900">
          <Star size={44} strokeWidth={1.5} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
          <p className="font-medium text-gray-400 dark:text-gray-500">Không có đánh giá nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewRow
              key={review._id}
              review={review}
              onReply={handleReply}
              onDeleteReply={handleDeleteReply}
              onHide={handleHide}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              const nextPage = page - 1
              setPage(nextPage)
              fetchReviews(nextPage)
            }}
            className="rounded-xl border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => {
            const pageNumber = index + 1

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => {
                  setPage(pageNumber)
                  fetchReviews(pageNumber)
                }}
                className={`h-9 w-9 rounded-xl border text-sm font-medium transition-colors ${
                  pageNumber === page
                    ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {pageNumber}
              </button>
            )
          })}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => {
              const nextPage = page + 1
              setPage(nextPage)
              fetchReviews(nextPage)
            }}
            className="rounded-xl border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>
        </div>
      )}

      <ReplyModal review={replyTarget} open={!!replyTarget} onClose={() => setReplyTarget(null)} onSave={handleReplySaved} />
    </div>
  )
}
