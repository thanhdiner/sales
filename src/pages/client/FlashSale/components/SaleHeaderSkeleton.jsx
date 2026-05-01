export default function SaleHeaderSkeleton({ upcoming = false }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`border-b p-4 sm:p-5 ${
          upcoming
            ? 'border-slate-200 bg-amber-50 dark:border-slate-800 dark:bg-amber-500/10'
            : 'border-red-100 bg-gradient-to-r from-red-50 to-orange-50 dark:border-red-500/20 dark:from-red-500/10 dark:to-orange-500/10'
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-8 w-full max-w-[320px] rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-4 w-full max-w-[280px] rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[...Array(upcoming ? 3 : 4)].map((_, index) => (
              <div key={index} className="h-[58px] w-[54px] rounded-lg bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>

        {!upcoming && (
          <div className="mt-4">
            <div className="mb-1.5 h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2 rounded-full bg-white dark:bg-slate-800" />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="grid auto-rows-fr grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="aspect-square rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
