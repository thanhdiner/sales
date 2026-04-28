import SEO from '@/components/SEO'

const DESKTOP_ROWS = Array.from({ length: 4 })
const MOBILE_CARDS = Array.from({ length: 3 })
const FILTER_WIDTHS = ['w-[108px]', 'w-[96px]', 'w-[88px]', 'w-[112px]']

function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-gray-700 ${className}`} />
}

function WishlistLoadingState({ t }) {
  return (
    <div className="bg-slate-50 px-4 py-8 dark:bg-gray-900" aria-busy="true">
      <SEO title={t('seo.title')} noIndex />

      <main className="mx-auto w-full max-w-[1180px]">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <SkeletonBlock className="h-8 w-52 rounded-lg sm:w-64" />
              <SkeletonBlock className="mt-2 h-4 w-64 max-w-full rounded" />
            </div>

            <SkeletonBlock className="h-10 w-full rounded-md sm:w-[148px]" />
          </div>
        </section>

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTER_WIDTHS.map(width => (
                <SkeletonBlock key={width} className={`h-9 rounded-md ${width}`} />
              ))}
            </div>

            <SkeletonBlock className="h-9 w-24 self-start rounded-md sm:self-auto" />
          </div>
        </section>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:block">
          <div className="grid grid-cols-[minmax(0,1fr)_160px_140px_170px] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-900/60">
            <SkeletonBlock className="h-3 w-28 rounded" />
            <SkeletonBlock className="h-3 w-20 rounded" />
            <SkeletonBlock className="h-3 w-24 rounded" />
            <SkeletonBlock className="ml-auto h-3 w-16 rounded" />
          </div>

          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {DESKTOP_ROWS.map((_, index) => (
              <div
                key={index}
                className="grid min-h-[96px] grid-cols-[minmax(0,1fr)_160px_140px_170px] items-center gap-4 px-5 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <SkeletonBlock className="h-[72px] w-[72px] flex-shrink-0 rounded-lg" />

                  <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-4 w-4/5 max-w-[360px] rounded" />
                    <SkeletonBlock className="mt-2 h-4 w-1/2 max-w-[240px] rounded" />
                    <SkeletonBlock className="mt-2 h-5 w-12 rounded-md" />
                  </div>
                </div>

                <div>
                  <SkeletonBlock className="h-5 w-24 rounded" />
                  <SkeletonBlock className="mt-2 h-3 w-16 rounded" />
                </div>

                <SkeletonBlock className="h-7 w-24 rounded-lg" />

                <div className="flex items-center justify-end gap-2">
                  <SkeletonBlock className="h-9 w-[112px] rounded-lg" />
                  <SkeletonBlock className="h-9 w-9 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
            <SkeletonBlock className="h-4 w-56 rounded" />
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          {MOBILE_CARDS.map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex gap-3">
                <SkeletonBlock className="h-[88px] w-[88px] flex-shrink-0 rounded-lg" />

                <div className="min-w-0 flex-1">
                  <SkeletonBlock className="h-4 w-full rounded" />
                  <SkeletonBlock className="mt-2 h-4 w-2/3 rounded" />
                  <SkeletonBlock className="mt-2 h-5 w-12 rounded-md" />
                </div>
              </div>

              <div className="mt-4">
                <SkeletonBlock className="h-5 w-28 rounded" />
                <SkeletonBlock className="mt-2 h-3 w-20 rounded" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-gray-700">
                <SkeletonBlock className="h-4 w-24 rounded" />
                <SkeletonBlock className="h-7 w-24 rounded-lg" />
              </div>

              <div className="mt-4 grid gap-2">
                <SkeletonBlock className="h-10 w-full rounded-lg" />
                <SkeletonBlock className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <SkeletonBlock className="h-4 w-56 max-w-full rounded" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default WishlistLoadingState
