import { capitalize } from '../utils/capitalize'
import { formatVND } from './formatCurrency'
import { formatDate } from './formatDate'

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

export function adminProductRows(p) {
  const discounted = p.discountPercentage > 0 ? (p.price * (1 - p.discountPercentage / 100)).toFixed(2) : 0

  return [
    ['Product', p.title],
    ['Slug', p.slug],
    ['Category', p.productCategory],
    [
      'Price',
      discounted ? (
        <>
          <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{`${formatVND(p.price, { withSuffix: true })}`}</span>{' '}
          <strong>{`${formatVND(discounted, { withSuffix: true })}`}</strong>
        </>
      ) : (
        `${formatVND(p.price, { withSuffix: true })}`
      )
    ],
    p.discountPercentage > 0 && ['Discount (%)', `${p.discountPercentage}%`],
    ['Stock', p.stock ?? 0],
    ['Position', p.position ?? '—'],
    ['Status', capitalize(p.status)],
    ['Rate', p.rate ? `${p.rate} ⭐` : 'N/A'],
    ['Time start', formatDate(p.timeStart)],
    ['Time finish', formatDate(p.timeFinish)],
    ['Created by', p.createdBy?.account_id ?? '—'],
    ['Created at', formatDate(p.createdAt)],
    ['Last updated', p.updatedAt ? formatDate(p.updatedAt) : '—'],
    ['Update history', formatUpdateHistory(p.updateBy)]
  ].filter(Boolean)
}
