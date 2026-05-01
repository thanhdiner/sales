export default function TimeBox({ value, label }) {
  return (
    <div className="min-w-[54px] rounded-lg bg-slate-900 px-2.5 py-2 text-center text-white shadow-sm dark:bg-white dark:text-slate-950">
      <div className="text-lg font-black leading-none">{String(value).padStart(2, '0')}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/65 dark:text-slate-500">{label}</div>
    </div>
  )
}
