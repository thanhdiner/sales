export default function BannerSkeleton() {
  return (
    <div className="HeroBanner-root skeleton-root">
      <div className="skeleton-banner">
        <div className="skeleton-content-wrap">
          <div className="skeleton-title" />
        </div>
      </div>
      <div className="skeleton-banner hidden md:block" style={{ display: window.innerWidth <= 576 ? 'none' : 'block' }}>
        <div className="skeleton-content-wrap">
          <div className="skeleton-title" />
        </div>
      </div>
      <div className="skeleton-dots flex">
        <div className="skeleton-dot" />
        <div className="skeleton-dot" />
        <div className="skeleton-dot" />
      </div>
    </div>
  )
}
