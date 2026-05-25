import './BuildYourKitSection.scss'

export default function BuildYourKitSkeleton() {
  return (
    <section className="build-kit build-kit--skeleton" aria-hidden="true">
      <div className="build-kit__content">
        <div className="build-kit__copy">
          <div className="build-kit-skeleton build-kit-skeleton--eyebrow" />
          <div className="build-kit-skeleton build-kit-skeleton--title" />
          <div className="build-kit-skeleton build-kit-skeleton--text" />
          <div className="build-kit-skeleton build-kit-skeleton--text build-kit-skeleton--short" />
          <div className="build-kit-skeleton build-kit-skeleton--card" />
          <div className="build-kit-skeleton-row">
            <div className="build-kit-skeleton build-kit-skeleton--chip" />
            <div className="build-kit-skeleton build-kit-skeleton--chip" />
            <div className="build-kit-skeleton build-kit-skeleton--chip" />
          </div>
        </div>
        <div className="build-kit__stage-card">
          <div className="build-kit-skeleton-stage" />
        </div>
      </div>
    </section>
  )
}
