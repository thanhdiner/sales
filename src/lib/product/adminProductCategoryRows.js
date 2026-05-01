import { capitalize } from '@/utils/capitalize'
import { formatDate } from '@/utils/formatDate'

const getUserLabel = updateEntry => {
  if (typeof updateEntry?.account_id === 'string' && updateEntry.account_id) return updateEntry.account_id
  if (updateEntry?.account_id?.fullName) return updateEntry.account_id.fullName
  if (updateEntry?.by?.fullName) return updateEntry.by.fullName
  if (updateEntry?.by?.email) return updateEntry.by.email
  return '—'
}

const formatUpdateHistory = updateBy => {
  if (!updateBy?.length) return '—'

  return (
    <div className="flex flex-col gap-2">
      {updateBy.map((entry, index) => {
        const userLabel = getUserLabel(entry)
        const updatedAt = entry?.updatedAt || entry?.createdAt
        const dateLabel = updatedAt ? formatDate(updatedAt) : '—'

        return (
          <div key={`${userLabel}-${updatedAt || index}`} className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
            <div className="min-w-0">
              <div className="font-medium">{userLabel}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{dateLabel}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function adminProductCategoryRows(p) {
  return [
    ['Product Category', p.title],
    ['Slug', p.slug],
    ['Parent Category', p?.parent_id?.title || '—'],
    ['Position', p.position ?? '—'],
    ['Status', capitalize(p.status)],
    ['Created by', p.createdBy?.account_id ?? '—'],
    ['Created at', formatDate(p.createdAt)],
    ['Last updated', p.updatedAt ? formatDate(p.updatedAt) : '—'],
    ['Update history', formatUpdateHistory(p.updateBy)]
  ].filter(Boolean)
}
