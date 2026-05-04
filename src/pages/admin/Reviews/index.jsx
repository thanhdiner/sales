import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useReviews from './hooks/useReviews'
import ReviewsFilters from './sections/ReviewsFilters'
import ReviewsHeader from './sections/ReviewsHeader'
import ReviewsList from './sections/ReviewsList'
import ReviewsOverview from './sections/ReviewsOverview'
import ReviewsPagination from './sections/ReviewsPagination'
import ReviewsReplyModal from './sections/ReviewsReplyModal'
import './index.scss'

export default function Reviews() {
  const { t } = useTranslation('adminReviews')
  const {
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
  } = useReviews()

  return (
    <div className="admin-reviews-page space-y-6">
      <SEO title={t('seo.title')} noIndex />

      <ReviewsHeader onRefresh={handleRefresh} />

      <ReviewsOverview stats={stats} replyRate={replyRate} ratingFilter={ratingFilter} onRatingFilterChange={handleRatingFilterChange} />

      <ReviewsFilters search={search} total={total} onSearchChange={handleSearchChange} />

      <ReviewsList
        loading={loading}
        reviews={reviews}
        onReply={handleReplyOpen}
        onDeleteReply={handleDeleteReply}
        onHide={handleHide}
        onDelete={handleDelete}
      />

      <ReviewsPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

      <ReviewsReplyModal
        review={replyTarget}
        open={!!replyTarget}
        loading={replySubmitting}
        onClose={handleReplyClose}
        onSubmit={handleReplySubmit}
      />
    </div>
  )
}
