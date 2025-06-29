import { capitalize } from '../utils/capitalize'
import { formatVND } from './formatCurrency'
import { formatDate } from './formatDate'

export function adminProductRows(p) {
  const discounted = p.discountPercentage > 0 ? (p.price * (1 - p.discountPercentage / 100)).toFixed(2) : 0

  return [
    ['Product', p.title],
    ['Slug', p.slug],
    ['Category', p.productCategory],
    ['Description', p.description ?? '—'],
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
    ['Update history', p.updateBy?.length ? p.updateBy.map(u => `${u.account_id} (${formatDate(u.updatedAt)})`).join(', ') : '—']
  ].filter(Boolean)
}
