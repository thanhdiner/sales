export default function BannerSkeleton() {
  return (
    <div className="HeroBanner-root skeleton-root" aria-busy="true" aria-label="Đang tải banner">
      <div className="skeleton-track">
        <div className="skeleton-banner">
          <div className="skeleton-content-wrap">
            <div className="skeleton-title" />
          </div>
        </div>

        <div className="skeleton-banner skeleton-banner--desktop">
          <div className="skeleton-content-wrap">
            <div className="skeleton-title" />
          </div>
        </div>
      </div>

      <div className="skeleton-dots">
        <div className="skeleton-dot" />
        <div className="skeleton-dot" />
        <div className="skeleton-dot" />
      </div>
    </div>
  )
}