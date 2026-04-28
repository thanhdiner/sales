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
    <div className="sticky top-0 z-30 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex h-12 items-center gap-2">
        <button
          type="button"
          onClick={() => onScrollTabs('prev')}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300"
          aria-label={t('category.prev')}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={tabsRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          className={`flex h-12 flex-1 touch-pan-y items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDraggingTabs ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
        >
          {categories.map(category => {
            const Icon = category.icon
            const active = selectedCategory === category.key

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => onCategoryChange(category.key)}
                className={`inline-flex h-12 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-sm font-bold transition-all ${
                  active
                    ? 'border-red-600 bg-red-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onScrollTabs('next')}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300"
          aria-label={t('category.next')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
