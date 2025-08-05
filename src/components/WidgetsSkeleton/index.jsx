import './WidgetsSkeleton.scss'

const skeletons = Array(10).fill(0)

export default function WidgetsSkeleton() {
  return (
    <div className="widgets-skeleton">
      <div className="widgets__list-skeleton">
        {skeletons.map((_, i) => (
          <div className="widgets__item-skeleton a" key={i}>
            <div className="widgets__icon--wrap-skeleton skeleton-animate"></div>
            <div className="widgets__title-skeleton skeleton-animate" />
          </div>
        ))}
      </div>
    </div>
  )
}
