import { capitalize } from '../utils/capitalize'
import { formatVND } from './formatCurrency'
import { formatDate } from './formatDate'

const getUserLabel = updateEntry => {
  if (typeof updateEntry?.account_id === 'string' && updateEntry.account_id) return updateEntry.account_id
  if (updateEntry?.account_id?.fullName) return updateEntry.account_id.fullName
  if (updateEntry?.by?.fullName) return updateEntry.by.fullName
  if (updateEntry?.by?.email) return updateEntry.by.email
  return 'N/A'
}

const formatUpdateHistory = updateBy => {
  if (!updateBy?.length) return 'N/A'

  return (
    <div className="admin-product__history">
      {updateBy.map((entry, index) => {
        const userLabel = getUserLabel(entry)
        const updatedAt = entry?.updatedAt || entry?.createdAt
        const dateLabel = updatedAt ? formatDate(updatedAt) : 'N/A'

        return (
          <div key={`${userLabel}-${updatedAt || index}`} className="admin-product__history-item">
            <span className="admin-product__history-dot" />
            <div className="admin-product__history-content">
              <div className="admin-product__history-user">{userLabel}</div>
              <div className="admin-product__history-time">{dateLabel}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function adminProductRows(product) {
  const discounted =
    product.discountPercentage > 0 ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2) : 0

  return [
    ['Product', product.title],
    ['Slug', product.slug],
    ['Category', product.productCategory],
    [
      'Price',
      discounted ? (
        <>
          <span className="admin-product__price-original">{`${formatVND(product.price, { withSuffix: true })}`}</span>{' '}
          <strong className="admin-product__price-discounted">{`${formatVND(discounted, { withSuffix: true })}`}</strong>
        </>
      ) : (
        `${formatVND(product.price, { withSuffix: true })}`
      )
    ],
    product.discountPercentage > 0 && ['Discount (%)', `${product.discountPercentage}%`],
    ['Stock', product.stock ?? 0],
    ['Position', product.position ?? 'N/A'],
    ['Status', capitalize(product.status)],
    ['Rate', product.rate ? `${product.rate} *` : 'N/A'],
    ['Time start', formatDate(product.timeStart)],
    ['Time finish', formatDate(product.timeFinish)],
    ['Created by', product.createdBy?.account_id ?? 'N/A'],
    ['Created at', formatDate(product.createdAt)],
    ['Last updated', product.updatedAt ? formatDate(product.updatedAt) : 'N/A'],
    ['Update history', formatUpdateHistory(product.updateBy)]
  ].filter(Boolean)
}
