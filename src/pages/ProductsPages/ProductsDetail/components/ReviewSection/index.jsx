import { useCallback, useEffect, useState } from 'react'
import { message, Modal } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  adminDeleteReply,
  adminReplyReview,
  createReview,
  deleteReview,
  getReviews,
  updateReview,
  voteReview
} from '@/services/reviewService'
import { getAccessToken, getStoredClientAccessToken } from '@/utils/auth'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import { MediaGallery } from './ReviewMediaPreview'
import { ReviewEmptyState, ReviewListSkeleton, ReviewPagination } from './ReviewListStates'
import { RatingSummary, ReviewSectionHeader, ReviewSortFilters } from './ReviewSummaryFilters'
import { DEFAULT_REVIEW_SUMMARY, REVIEW_LIMIT, REVIEW_SORT_OPTIONS } from './utils'

const DEFAULT_VIEWER = {
  isLoggedIn: false,
  state: 'login_required',
  canCreate: false,
  hasPurchased: false,
  hasCompletedOrder: false,
  orderId: null,
  orderStatus: null,
  myReview: null
}

const getOwnerNote = (review, t) => {
  if (!review?.isOwner) return ''

  if (review.canEdit) {
    return t('productDetail.reviewSection.ownerNote.canEdit', {
      count: review.editCount || 0
    })
  }

  return t('productDetail.reviewSection.ownerNote.editLimitReached')
}

export default function ReviewSection({ productId }) {
  const { t } = useTranslation('clientProducts')
  const navigate = useNavigate()
  const clientUser = useSelector(state => state.clientUser.user)
  const adminUser = useSelector(state => state.adminUser.user)

  const currentUserId = clientUser?._id || clientUser?.id
  const isLoggedIn = !!(currentUserId || getStoredClientAccessToken())
  const isAdmin = !!getAccessToken() && !!adminUser

  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(DEFAULT_REVIEW_SUMMARY)
  const [viewer, setViewer] = useState(DEFAULT_VIEWER)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('newest')
  const [ratingFilter, setRatingFilter] = useState('')
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  const fetchReviews = useCallback(
    async ({ nextPage = 1, nextSort = sort, nextRatingFilter = ratingFilter } = {}) => {
      setLoadingReviews(true)

      try {
        const params = {
          sort: nextSort,
          page: nextPage,
          limit: REVIEW_LIMIT
        }

        if (nextRatingFilter) {
          params.rating = nextRatingFilter
        }

        const data = await getReviews(productId, params)

        setReviews(data.reviews || [])
        setTotal(data.total || 0)
        setSummary(data.summary || DEFAULT_REVIEW_SUMMARY)
        setViewer(data.viewer || DEFAULT_VIEWER)
      } catch {
        // silent
      } finally {
        setLoadingReviews(false)
      }
    },
    [productId, ratingFilter, sort]
  )

  useEffect(() => {
    setPage(1)
    setEditingReview(null)
    fetchReviews({ nextPage: 1, nextSort: sort, nextRatingFilter: ratingFilter })
  }, [currentUserId, fetchReviews, isLoggedIn, productId, ratingFilter, sort])

  const syncCurrentPage = useCallback(async () => {
    await fetchReviews({ nextPage: page, nextSort: sort, nextRatingFilter: ratingFilter })
  }, [fetchReviews, page, ratingFilter, sort])

  const handleCreate = async formData => {
    if (!isLoggedIn) {
      message.info(t('productDetail.reviewSection.message.loginRequiredReview'))
      navigate('/user/login')
      return
    }

    setSubmitting(true)

    try {
      await createReview(productId, formData)
      message.success(t('productDetail.reviewSection.message.createSuccess'))
      setPage(1)
      await fetchReviews({ nextPage: 1, nextSort: sort, nextRatingFilter: ratingFilter })
    } catch (error) {
      message.error(error.message || t('productDetail.reviewSection.message.createFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async formData => {
    if (!editingReview) return

    setSubmitting(true)

    try {
      await updateReview(editingReview._id, formData)
      setEditingReview(null)
      message.success(t('productDetail.reviewSection.message.updateSuccess'))
      await syncCurrentPage()
    } catch (error) {
      message.error(error.message || t('productDetail.reviewSection.message.updateFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = reviewId => {
    Modal.confirm({
      title: t('productDetail.reviewSection.modal.deleteReviewTitle'),
      content: t('productDetail.reviewSection.modal.deleteReviewContent'),
      okText: t('productDetail.reviewSection.modal.okDelete'),
      okType: 'danger',
      cancelText: t('productDetail.reviewSection.modal.cancel'),
      onOk: async () => {
        try {
          await deleteReview(reviewId)
          if (editingReview?._id === reviewId) {
            setEditingReview(null)
          }
          message.success(t('productDetail.reviewSection.message.deleteSuccess'))
          await syncCurrentPage()
        } catch (error) {
          message.error(error.message || t('productDetail.reviewSection.message.deleteFailed'))
        }
      }
    })
  }

  const handleVote = async reviewId => {
    if (!isLoggedIn) {
      message.info(t('productDetail.reviewSection.message.loginRequiredVote'))
      navigate('/user/login')
      return
    }

    const targetReview = reviews.find(review => review._id === reviewId)

    if (!targetReview || targetReview.isOwner) return

    const wasVoted = targetReview.isVoted

    setReviews(prevReviews =>
      prevReviews.map(review =>
        review._id === reviewId
          ? {
              ...review,
              isVoted: !wasVoted,
              helpfulCount: wasVoted ? review.helpfulCount - 1 : review.helpfulCount + 1
            }
          : review
      )
    )

    try {
      await voteReview(reviewId)
    } catch (error) {
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? {
                ...review,
                isVoted: wasVoted,
                helpfulCount: wasVoted ? review.helpfulCount + 1 : review.helpfulCount - 1
              }
            : review
        )
      )

      message.error(error.message || t('productDetail.reviewSection.message.voteFailed'))
    }
  }

  const updateReviewInState = useCallback((reviewId, updater) => {
    setReviews(prevReviews => prevReviews.map(review => (review._id === reviewId ? updater(review) : review)))
    setViewer(prevViewer =>
      prevViewer.myReview?._id === reviewId ? { ...prevViewer, myReview: updater(prevViewer.myReview) } : prevViewer
    )
  }, [])

  const handleReply = async (reviewId, content) => {
    const optimisticReply = {
      content,
      repliedAt: new Date().toISOString()
    }

    const previousReview = reviews.find(review => review._id === reviewId) || viewer.myReview

    updateReviewInState(reviewId, review => ({
      ...review,
      sellerReply: optimisticReply
    }))

    try {
      const data = await adminReplyReview(reviewId, content)

      updateReviewInState(reviewId, review => ({
        ...review,
        sellerReply: data.sellerReply
      }))
      message.success(t('productDetail.reviewSection.message.replySuccess'))
    } catch (error) {
      if (previousReview) {
        updateReviewInState(reviewId, () => previousReview)
      }
      message.error(error.message || t('productDetail.reviewSection.message.replyFailed'))
    }
  }

  const handleDeleteReply = reviewId => {
    Modal.confirm({
      title: t('productDetail.reviewSection.modal.deleteReplyTitle'),
      content: t('productDetail.reviewSection.modal.deleteReplyContent'),
      okText: t('productDetail.reviewSection.modal.okDelete'),
      okType: 'danger',
      cancelText: t('productDetail.reviewSection.modal.cancel'),
      onOk: async () => {
        const previousReview = reviews.find(review => review._id === reviewId) || viewer.myReview

        updateReviewInState(reviewId, review => ({
          ...review,
          sellerReply: { content: '', repliedAt: null }
        }))

        try {
          await adminDeleteReply(reviewId)
          message.success(t('productDetail.reviewSection.message.deleteReplySuccess'))
        } catch (error) {
          if (previousReview) {
            updateReviewInState(reviewId, () => previousReview)
          }
          message.error(error.message || t('productDetail.reviewSection.message.deleteReplyFailed'))
        }
      }
    })
  }

  const handleEdit = review => {
    if (!review?.canEdit) return

    setEditingReview(review)

    window.scrollTo({
      top: document.getElementById('reviews-section')?.offsetTop - 80,
      behavior: 'smooth'
    })
  }

  const handlePageChange = nextPage => {
    setPage(nextPage)
    fetchReviews({ nextPage, nextSort: sort, nextRatingFilter: ratingFilter })
  }

  const myReview = viewer.myReview
  const galleryReviews = myReview ? [myReview, ...reviews] : reviews
  const totalPages = Math.ceil(total / REVIEW_LIMIT)

  return (
    <section id="reviews-section" className="mt-10 space-y-5">
      <ReviewSectionHeader summary={summary} />

      {viewer.state === 'login_required' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('productDetail.reviewSection.loginRequired.title')}</p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('productDetail.reviewSection.loginRequired.description')}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/user/login')}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              {t('productDetail.reviewSection.loginRequired.button')}
            </button>
          </div>
        </div>
      )}

      {viewer.state === 'not_purchased' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
          <p className="font-semibold">{t('productDetail.reviewSection.notPurchased.title')}</p>
          <p className="mt-1 text-amber-800/90 dark:text-amber-100/80">{t('productDetail.reviewSection.notPurchased.description')}</p>
        </div>
      )}

      {viewer.state === 'order_not_completed' && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-100">
          <p className="font-semibold">{t('productDetail.reviewSection.orderNotCompleted.title')}</p>
          <p className="mt-1 text-blue-800/90 dark:text-blue-100/80">{t('productDetail.reviewSection.orderNotCompleted.description')}</p>
        </div>
      )}

      {viewer.state === 'can_review' && !editingReview && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            {t('productDetail.reviewSection.form.createTitle')}
          </h3>

          <ReviewForm onSubmit={handleCreate} loading={submitting} />
        </div>
      )}

      {myReview && !editingReview && (
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('productDetail.reviewSection.myReview.title')}</h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('productDetail.reviewSection.myReview.description')}</p>
            </div>

            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t('productDetail.reviewSection.myReview.editCount', {
                count: myReview.editCount || 0
              })}
            </span>
          </div>

          <ReviewCard
            review={myReview}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onVote={handleVote}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReply={handleReply}
            onDeleteReply={handleDeleteReply}
            canEdit={myReview.canEdit}
            canDelete
            ownerNote={getOwnerNote(myReview, t)}
          />
        </div>
      )}

      {editingReview && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t('productDetail.reviewSection.form.editTitle')}</h3>

          <ReviewForm
            key={`edit-${editingReview._id}`}
            initial={editingReview}
            onSubmit={handleUpdate}
            onCancel={() => setEditingReview(null)}
            loading={submitting}
          />
        </div>
      )}

      {summary.totalCount > 0 && (
        <RatingSummary
          summary={summary}
          activeFilter={ratingFilter}
          onFilter={nextFilter => {
            setRatingFilter(nextFilter)
            setPage(1)
          }}
        />
      )}

      {summary.totalCount > 0 && (
        <ReviewSortFilters
          sortOptions={REVIEW_SORT_OPTIONS}
          sort={sort}
          onSortChange={setSort}
          ratingFilter={ratingFilter}
          onClearRatingFilter={() => setRatingFilter('')}
        />
      )}

      {galleryReviews.length > 0 && <MediaGallery reviews={galleryReviews} />}

      {loadingReviews ? (
        <ReviewListSkeleton />
      ) : reviews.length === 0 ? (
        !myReview && <ReviewEmptyState />
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onVote={handleVote}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReply={handleReply}
              onDeleteReply={handleDeleteReply}
            />
          ))}
        </div>
      )}

      <ReviewPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  )
}
