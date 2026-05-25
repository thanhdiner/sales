import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CategoryTabs({
  categories,
  isDraggingTabs,
  onCategoryChange,
  onClickCapture,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onScrollTabs,
  selectedCategory,
  tabsRef,
  t
}) {
  return (
    <div className="flash-sale-category-bar">
      <div className="flash-sale-category-bar__inner">
        <button
          type="button"
          onClick={() => onScrollTabs('prev')}
          className="flash-sale-category-bar__arrow"
          aria-label={t('category.prev')}
        >
          <ChevronLeft className="flash-sale-category-bar__arrow-icon" />
        </button>

        <div
          ref={tabsRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          className={`flash-sale-category-bar__track ${isDraggingTabs ? 'is-dragging' : ''}`}
        >
          {categories.map(category => {
            const Icon = category.icon
            const active = selectedCategory === category.key

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => onCategoryChange(category.key)}
                className={`flash-sale-category-bar__tab ${active ? 'is-active' : ''}`}
              >
                <Icon className="flash-sale-category-bar__tab-icon" />
                <span className="flash-sale-category-bar__tab-label">{category.label}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onScrollTabs('next')}
          className="flash-sale-category-bar__arrow"
          aria-label={t('category.next')}
        >
          <ChevronRight className="flash-sale-category-bar__arrow-icon" />
        </button>
      </div>
    </div>
  )
}
