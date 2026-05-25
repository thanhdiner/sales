import { useCallback, useEffect, useState } from 'react'
import { message, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAdminResourceList } from '@/hooks/shared/adminResourceList'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { del, get } from '@/utils/request'
import { useDebouncedFilterSync } from '@/hooks/shared/useListFilterHelpers'
import { stringFilter } from '@/hooks/shared/useListSearchParams'
import { deleteReply, hideReview, replyReview } from '@/services/client/commerce/review'
import {
  REVIEWS_PAGE_LIMIT,
  REVIEWS_SEARCH_DEBOUNCE_MS,
  REVIEWS_STATS_LIMIT,
  calculateReviewStats,
  createEmptyReviewStats,
  getReviewsQueryParams,
  normalizeReviewReplyPayload
} from '../utils'

export default function useReviews() {
  const { t } = useTranslation('adminReviews')
  const language = useCurrentLanguage()
  const {
    page,
    setPage,
    filters,
    setFilters,
    items: reviews,
    setItems: setReviews,
    total,
    setTotal,
    loading,
    refetch: refetchReviews
  } = useAdminResourceList({
    resource: 'reviews',
    defaultPage: 1,
    defaultPageSize: REVIEWS_PAGE_LIMIT,
    filterParsers: {
      search: stringFilter,
      rating: stringFilter
    },
    queryKeyDeps: { language },
    queryFn: async query => {
      const response = await get(
        `admin/reviews?${getReviewsQueryParams({
          page: query.page,
          limit: REVIEWS_PAGE_LIMIT,
          rating: query.rating,
          search: query.search
        })}`
      )

      return {
        reviews: response?.reviews,
        total: response?.total
      }
    },
    selectItems: response => response?.reviews,
    selectTotal: response => response?.total,
    onError: () => message.error(t('messages.fetchError'))
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

    queueMicrotask(() => {
      setSearch(prevSearch => (prevSearch === nextSearch ? prevSearch : nextSearch))
      setRatingFilter(prevRating => (prevRating === nextRating ? prevRating : nextRating))
    })
  }, [filters.rating, filters.search])

  const normalizedSearch = search.trim()

  const refreshStats = useCallback(async () => {
    try {
      const response = await get(`admin/reviews?${getReviewsQueryParams({ limit: REVIEWS_STATS_LIMIT })}`)

      setStats(calculateReviewStats(Array.isArray(response?.reviews) ? response.reviews : []))
    } catch {
      return null
    }

    return null
  }, [])

  const totalPages = Math.ceil(total / REVIEWS_PAGE_LIMIT)
  const replyRate = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0

  useEffect(() => {
    if (page === 1 && !ratingFilter && !normalizedSearch) queueMicrotask(() => void refreshStats())
  }, [normalizedSearch, page, ratingFilter, refreshStats, reviews])

  useDebouncedFilterSync(
    () => syncFiltersToUrl({ nextSearch: normalizedSearch, nextRating: ratingFilter }),
    [normalizedSearch, ratingFilter, syncFiltersToUrl],
    REVIEWS_SEARCH_DEBOUNCE_MS
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
    async values => {
      const payload = normalizeReviewReplyPayload(typeof values === 'string' ? { content: values } : values)
      const trimmedContent = payload.content

      if (!replyTarget) return false

      if (!trimmedContent) {
        message.warning(t('messages.replyRequired'))
        return false
      }

      const isEdit = !!replyTarget?.sellerReply?.content

      setReplySubmitting(true)

      try {
        await replyReview(replyTarget._id, payload)

        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === replyTarget._id
              ? {
                  ...review,
                  sellerReply: {
                    content: trimmedContent,
                    translations: payload.translations,
                    repliedAt: new Date().toISOString()
                  }
                }
              : review
          )
        )

        setReplyTarget(null)
        message.success(isEdit ? t('messages.replyUpdated') : t('messages.replySent'))
        void refreshStats()
        return true
      } catch (error) {
        message.error(error.message || t('messages.replyFailed'))
        return false
      } finally {
        setReplySubmitting(false)
      }
    },
    [refreshStats, replyTarget, setReviews, t]
  )

  const handleDeleteReply = useCallback(
    reviewId => {
      Modal.confirm({
        className: 'admin-reviews-confirm-modal',
        title: t('confirm.deleteReplyTitle'),
        content: t('confirm.deleteReplyContent'),
        okText: t('common.delete'),
        okType: 'danger',
        cancelText: t('common.cancel'),
        okButtonProps: {
          className: 'admin-reviews-confirm-ok admin-reviews-confirm-ok--danger'
        },
        cancelButtonProps: {
          className: 'admin-reviews-confirm-cancel'
        },
        onOk: async () => {
          try {
            await deleteReply(reviewId)

            setReviews(prevReviews =>
              prevReviews.map(review =>
                review._id === reviewId
                  ? {
                      ...review,
                      sellerReply: {
                        content: '',
                        translations: {
                          en: {
                            content: ''
                          }
                        },
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
                        translations: {
                          en: {
                            content: ''
                          }
                        },
                        repliedAt: null
                      }
                    }
                  : prevTarget
              )
            }

            message.success(t('messages.deleteReplySuccess'))
            void refreshStats()
          } catch (error) {
            message.error(error.message || t('messages.deleteReplyFailed'))
          }
        }
      })
    },
    [refreshStats, replyTarget, setReviews, t]
  )

  const handleHide = useCallback(
    reviewId => {
      Modal.confirm({
        className: 'admin-reviews-confirm-modal',
        title: t('confirm.hideTitle'),
        content: t('confirm.hideContent'),
        okText: t('confirm.hideOk'),
        cancelText: t('common.cancel'),
        okButtonProps: {
          className: 'admin-reviews-confirm-ok'
        },
        cancelButtonProps: {
          className: 'admin-reviews-confirm-cancel'
        },
        onOk: async () => {
          try {
            await hideReview(reviewId)

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

            message.success(t('messages.hideSuccess'))
          } catch (error) {
            message.error(error.message || t('messages.hideFailed'))
          }
        }
      })
    },
    [setReviews, t]
  )

  const handleDelete = useCallback(
    reviewId => {
      Modal.confirm({
        className: 'admin-reviews-confirm-modal',
        title: t('confirm.deleteReviewTitle'),
        content: t('confirm.deleteReviewContent'),
        okText: t('common.delete'),
        okType: 'danger',
        cancelText: t('common.cancel'),
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
            setReplyTarget(prevTarget => (prevTarget?._id === reviewId ? null : prevTarget))

            message.success(t('messages.deleteSuccess'))
            void refreshStats()
          } catch (error) {
            message.error(error.message || t('messages.deleteFailed'))
          }
        }
      })
    },
    [refreshStats, setReviews, setTotal, t]
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
