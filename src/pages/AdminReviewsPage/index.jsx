import useAdminReviewsPage from './hooks/useAdminReviewsPage'
import AdminReviewsFiltersSection from './sections/AdminReviewsFiltersSection'
import AdminReviewsHeaderSection from './sections/AdminReviewsHeaderSection'
import AdminReviewsListSection from './sections/AdminReviewsListSection'
import AdminReviewsOverviewSection from './sections/AdminReviewsOverviewSection'
import AdminReviewsPaginationSection from './sections/AdminReviewsPaginationSection'
import AdminReviewsReplyModal from './sections/AdminReviewsReplyModal'

export default function AdminReviewsPage() {
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
  } = useAdminReviewsPage()

  return (
    <div className="space-y-6">
      <AdminReviewsHeaderSection onRefresh={handleRefresh} />

      <AdminReviewsOverviewSection
        stats={stats}
        replyRate={replyRate}
        ratingFilter={ratingFilter}
        onRatingFilterChange={handleRatingFilterChange}
      />

      <AdminReviewsFiltersSection
        search={search}
        total={total}
        onSearchChange={handleSearchChange}
      />

      <AdminReviewsListSection
        loading={loading}
        reviews={reviews}
        onReply={handleReplyOpen}
        onDeleteReply={handleDeleteReply}
        onHide={handleHide}
        onDelete={handleDelete}
      />

      <AdminReviewsPaginationSection
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AdminReviewsReplyModal
        review={replyTarget}
        open={!!replyTarget}
        loading={replySubmitting}
        onClose={handleReplyClose}
        onSubmit={handleReplySubmit}
      />
    </div>
  )
}
