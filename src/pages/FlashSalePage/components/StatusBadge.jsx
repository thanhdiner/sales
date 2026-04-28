import { Clock, Flame } from 'lucide-react'

export default function StatusBadge({ status, t }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
        <Flame className="h-3.5 w-3.5" />
        {t('status.active')}
      </span>
    )
  }

  if (status === 'scheduled') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
        <Clock className="h-3.5 w-3.5" />
        {t('status.scheduled')}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      {t('status.ended')}
    </span>
  )
}
