import { useCallback, useEffect, useState } from 'react'
import { message, Modal } from 'antd'
import { useAsyncListData } from '@/hooks/useAsyncListData'
import { del, get } from '@/utils/request'
import { useDebouncedFilterSync } from '@/hooks/useListFilterHelpers'
import { stringFilter, useListSearchParams } from '@/hooks/useListSearchParams'
import {
  adminDeleteReply,
  adminHideReview,
  adminReplyReview
} from '@/services/reviewService'
import {
  ADMIN_REVIEWS_PAGE_LIMIT,
  ADMIN_REVIEWS_SEARCH_DEBOUNCE_MS,
  ADMIN_REVIEWS_STATS_LIMIT,
  calculateReviewStats,
  createEmptyReviewStats,
  getAdminReviewsQueryParams
} from '../utils'

export default function useAdminReviewsPage() {
  const { page, setPage, filters, setFilters } = useListSearchParams({
    defaultPage: 1,
    filterParsers: {
      search: stringFilter,
      rating: stringFilter
    }
  })
  const [search, setSearch] = useState(filters.search || '')
  const [ratingFilter, setRatingFilter] = useState(filters.rating || '')
  const [replyTarget, setReplyTarget] = useState(null)
  const [replySubmitting, setReplySubmitting] = useState(false)
  const [stats, setStats] = useState(createEmptyReviewStats)

  const syncFiltersToUrl = useCallback(
    ({ nextSearch, nextRating }) => {
      setFilters({ search: nextSearch, rating: nextRating })
    },
    [setFilters]
  )

  useEffect(() => {
    const nextSearch = filters.search || ''
    const nextRating = filters.rating || ''

    setSearch(prevSearch => (prevSearch === nextSearch ? prevSearch : nextSearch))
    setRatingFilter(prevRating => (prevRating === nextRating ? prevRating : nextRating))
  }, [filters.rating, filters.search])

  const normalizedSearch = search.trim()

  const refreshStats = useCallback(async () => {
    try {
      const response = await get(
        `admin/reviews?${getAdminReviewsQueryParams({ limit: ADMIN_REVIEWS_STATS_LIMIT })}`
      )

      setStats(calculateReviewStats(Array.isArray(response?.reviews) ? response.reviews : []))
    } catch (error) {
      return null
    }

    return null
  }, [])

  const fetchReviews = useCallback(async () => {
    try {
      const response = await get(
        `admin/reviews?${getAdminReviewsQueryParams({
          page,
          limit: ADMIN_REVIEWS_PAGE_LIMIT,
          rating: ratingFilter,
          search: normalizedSearch
        })}`
      )

      if (page === 1 && !ratingFilter && !normalizedSearch) {
        void refreshStats()
      }

      return {
        items: response?.reviews,
        total: response?.total
      }
    } catch (error) {
      message.error('Không thể tải đánh giá')
      throw error
    }
  }, [normalizedSearch, page, ratingFilter, refreshStats])

  const {
    items: reviews,
    setItems: setReviews,
    total,
    setTotal,
    loading,
    refetch: refetchReviews
  } = useAsyncListData(fetchReviews, [fetchReviews])

  const totalPages = Math.ceil(total / ADMIN_REVIEWS_PAGE_LIMIT)
  const replyRate = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0

  useDebouncedFilterSync(
    () => syncFiltersToUrl({ nextSearch: normalizedSearch, nextRating: ratingFilter }),
    [normalizedSearch, ratingFilter, syncFiltersToUrl],
    ADMIN_REVIEWS_SEARCH_DEBOUNCE_MS
  )

  const handleRefresh = useCallback(() => {
    refetchReviews()
  }, [refetchReviews])

  const handleSearchChange = useCallback(value => {
    setSearch(value)
  }, [])

  const handleRatingFilterChange = useCallback(value => {
    setRatingFilter(value)
  }, [])

  const handlePageChange = useCallback(
    nextPage => {
      setPage(nextPage)
    },
    [setPage]
  )

  const handleReplyOpen = useCallback(review => {
    setReplyTarget(review)
  }, [])

  const handleReplyClose = useCallback(() => {
    if (!replySubmitting) {
      setReplyTarget(null)
    }
  }, [replySubmitting])

  const handleReplySubmit = useCallback(
    async content => {
      const trimmedContent = content.trim()

      if (!replyTarget) return false

      if (!trimmedContent) {
        message.warning('Vui lòng nhập nội dung phản hồi')
        return false
      }

      const isEdit = !!replyTarget?.sellerReply?.content

      setReplySubmitting(true)

      try {
        await adminReplyReview(replyTarget._id, trimmedContent)

        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === replyTarget._id
              ? {
                  ...review,
                  sellerReply: {
                    content: trimmedContent,
                    repliedAt: new Date().toISOString()
                  }
                }
              : review
          )
        )

        setReplyTarget(null)
        message.success(isEdit ? 'Đã cập nhật phản hồi' : 'Đã gửi phản hồi')
        void refreshStats()
        return true
      } catch (error) {
        message.error(error.message || 'Gửi phản hồi thất bại')
        return false
      } finally {
        setReplySubmitting(false)
      }
    },
    [refreshStats, replyTarget, setReviews]
  )

  const handleDeleteReply = useCallback(
    reviewId => {
      Modal.confirm({
        className: 'admin-reviews-confirm-modal',
        title: 'Xoá phản hồi',
        content: 'Bạn có chắc muốn xoá phản hồi của Shop không?',
        okText: 'Xoá',
        okType: 'danger',
        cancelText: 'Huỷ',
        okButtonProps: {
          className: 'admin-reviews-confirm-ok admin-reviews-confirm-ok--danger'
        },
        cancelButtonProps: {
          className: 'admin-reviews-confirm-cancel'
        },
        onOk: async () => {
          try {
            await adminDeleteReply(reviewId)

            setReviews(prevReviews =>
              prevReviews.map(review =>
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

            if (replyTarget?._id === reviewId) {
              setReplyTarget(prevTarget =>
                prevTarget
                  ? {
                      ...prevTarget,
                      sellerReply: {
                        content: '',
                        repliedAt: null
                      }
                    }
                  : prevTarget
              )
            }

            message.success('Đã xoá phản hồi')
            void refreshStats()
          } catch (error) {
            message.error(error.message || 'Xoá phản hồi thất bại')
          }
        }
      })
    },
    [refreshStats, replyTarget?._id, setReviews]
  )

  const handleHide = useCallback(reviewId => {
    Modal.confirm({
      className: 'admin-reviews-confirm-modal',
      title: 'Ẩn đánh giá',
      content:
        'Ẩn review này khỏi trang sản phẩm? Người dùng vẫn thấy review của họ nhưng khách khác sẽ không thấy.',
      okText: 'Ẩn',
      cancelText: 'Huỷ',
      okButtonProps: {
        className: 'admin-reviews-confirm-ok'
      },
      cancelButtonProps: {
        className: 'admin-reviews-confirm-cancel'
      },
      onOk: async () => {
        try {
          await adminHideReview(reviewId)

          setReviews(prevReviews =>
            prevReviews.map(review =>
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
        } catch (error) {
          message.error(error.message || 'Ẩn review thất bại')
        }
      }
    })
  }, [setReviews])

  const handleDelete = useCallback(
    reviewId => {
      Modal.confirm({
        className: 'admin-reviews-confirm-modal',
        title: 'Xoá đánh giá',
        content: 'Xoá vĩnh viễn đánh giá này? Hành động không thể hoàn tác.',
        okText: 'Xoá',
        okType: 'danger',
        cancelText: 'Huỷ',
        okButtonProps: {
          className: 'admin-reviews-confirm-ok admin-reviews-confirm-ok--danger'
        },
        cancelButtonProps: {
          className: 'admin-reviews-confirm-cancel'
        },
        onOk: async () => {
          try {
            await del(`admin/reviews/${reviewId}`)

            setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId))
            setTotal(prevTotal => Math.max(prevTotal - 1, 0))
            setReplyTarget(prevTarget =>
              prevTarget?._id === reviewId ? null : prevTarget
            )

            message.success('Đã xoá đánh giá')
            void refreshStats()
          } catch (error) {
            message.error(error.message || 'Xoá thất bại')
          }
        }
      })
    },
    [refreshStats, setReviews, setTotal]
  )

  return {
    reviews,
    total,
    page,
    totalPages,
    loading,
    search,
    ratingFilter,
    replyTarget,
    replySubmitting,
    stats,
    replyRate,
    handleRefresh,
    handleSearchChange,
    handleRatingFilterChange,
    handlePageChange,
    handleReplyOpen,
    handleReplyClose,
    handleReplySubmit,
    handleDeleteReply,
    handleHide,
    handleDelete
  }
}
