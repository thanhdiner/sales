import './WhyChooseUsSkeleton.scss'

const positions = ['pos-top', 'pos-top-right', 'pos-bottom-right', 'pos-bottom', 'pos-bottom-left', 'pos-top-left']

export default function WhyChooseUsSkeleton() {
  return (
    <section className="why-choose-us-skeleton mt-10 rounded-2xl border border-gray-200 dark:border-gray-600">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-8 w-40 rounded-full bg-gray-200 dark:bg-[#202327]" />
          <div className="mx-auto mt-5 h-9 w-full max-w-[620px] rounded-xl bg-gray-200 dark:bg-[#202327]" />
          <div className="mx-auto mt-3 h-9 w-full max-w-[520px] rounded-xl bg-gray-200 dark:bg-[#202327]" />
          <div className="mx-auto mt-5 h-5 w-full max-w-[680px] rounded bg-gray-200 dark:bg-[#202327]" />
          <div className="mx-auto mt-3 h-5 w-full max-w-[560px] rounded bg-gray-200 dark:bg-[#202327]" />
        </div>

        <div className="wcu-skeleton-hub mt-12">
          <div className="wcu-skeleton-hub__center">
            <div className="grid grid-cols-2 gap-1 rounded-2xl border-2 border-dashed border-emerald-200 bg-white p-3 shadow-sm dark:border-emerald-500/20 dark:bg-[#151719]">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-8 w-8 rounded-md bg-gray-200 dark:bg-[#202327]" />
              ))}
            </div>
          </div>

          {positions.map(position => (
            <div className={`wcu-skeleton-card ${position}`} key={position}>
              <div className="h-9 w-9 rounded-xl bg-gray-200 dark:bg-[#202327]" />
              <div className="mt-4 h-5 w-3/4 rounded bg-gray-200 dark:bg-[#202327]" />
              <div className="mt-3 space-y-2">
                <div className="h-3.5 w-full rounded bg-gray-200 dark:bg-[#202327]" />
                <div className="h-3.5 w-5/6 rounded bg-gray-200 dark:bg-[#202327]" />
                <div className="h-3.5 w-2/3 rounded bg-gray-200 dark:bg-[#202327]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 h-12 w-40 rounded-full bg-gray-200 dark:bg-[#202327]" />
      </div>
    </section>
  )
}
