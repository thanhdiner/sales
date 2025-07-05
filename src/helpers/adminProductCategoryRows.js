import { capitalize } from '../utils/capitalize'
import { formatDate } from './formatDate'

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
    ['Update history', p.updateBy?.length ? p.updateBy.map(u => `${u.account_id} (${formatDate(u.updatedAt)})`).join(', ') : '—']
  ].filter(Boolean)
}
