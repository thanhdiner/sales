import { Edit2, Trash2 } from 'lucide-react'
import { Button, Pagination } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  formatCurrency,
  formatFlashSaleDateRange,
  formatFlashSaleDateTime,
  formatFlashSaleDiscount,
  formatFlashSaleQuantity,
  getFlashSaleProgressPercent,
  getFlashSaleStatusMeta,
  getFlashSalesLocale,
  hasLocalizedFlashSaleName,
  getLocalizedFlashSaleName
} from '../utils/flashSaleHelpers'

export default function FlashSalesTable({
  flashSales,
  total,
  currentPage,
  pageSize,
  tableLoading,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete
}) {
  const { t, i18n } = useTranslation('adminFlashSales')
  const language = useSelector(state => state.language?.value || i18n.resolvedLanguage || i18n.language)
  const locale = getFlashSalesLocale(language)
  const rows = Array.isArray(flashSales) ? flashSales : []
  const hasRows = rows.length > 0

  return (
    <div className="admin-flash-sales-table-card overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]">
      {tableLoading ? (
        <FlashSalesLoadingState t={t} />
      ) : !hasRows ? (
        <FlashSalesEmptyState t={t} />
      ) : (
        <>
          <FlashSalesDesktopTable flashSales={rows} language={language} locale={locale} onEdit={onEdit} onDelete={onDelete} t={t} />
          <FlashSalesTabletTable flashSales={rows} language={language} locale={locale} onEdit={onEdit} onDelete={onDelete} t={t} />
          <FlashSalesMobileCards flashSales={rows} language={language} locale={locale} onEdit={onEdit} onDelete={onDelete} t={t} />
        </>
      )}

      {total > 0 && (
        <div className="admin-flash-sales-pagination flex justify-end border-t border-[var(--admin-border)] px-4 py-4 sm:px-6">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            responsive
            showTotal={(count, range) => t('table.paginationTotal', { from: range[0], to: range[1], total: count })}
            onChange={onPageChange}
            onShowSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  )
}

function FlashSalesLoadingState({ t }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--admin-border)] border-t-[var(--admin-accent)]" />
        <p className="text-sm font-medium text-[var(--admin-text-muted)]">{t('table.loading')}</p>
      </div>
    </div>
  )
}

function FlashSalesEmptyState({ t }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <h3 className="mb-1 text-base font-semibold text-[var(--admin-text)]">{t('table.emptyTitle')}</h3>
        <p className="text-sm text-[var(--admin-text-muted)]">{t('table.emptyDescription')}</p>
      </div>
    </div>
  )
}

function FlashSalesDesktopTable({ flashSales, language, locale, onEdit, onDelete, t }) {
  return (
    <div className="admin-flash-sales-desktop-table overflow-x-auto">
      <table className="w-full min-w-[980px] divide-y divide-[var(--admin-border)] text-sm">
        <thead className="bg-[var(--admin-surface-2)]">
          <tr>
            <DesktopHeaderCell>{t('table.columns.name')}</DesktopHeaderCell>
            <DesktopHeaderCell>{t('table.columns.time')}</DesktopHeaderCell>
            <DesktopHeaderCell>{t('table.columns.discount')}</DesktopHeaderCell>
            <DesktopHeaderCell>{t('table.columns.quantity')}</DesktopHeaderCell>
            <DesktopHeaderCell>{t('table.columns.status')}</DesktopHeaderCell>
            <DesktopHeaderCell>{t('table.columns.revenue')}</DesktopHeaderCell>
            <DesktopHeaderCell align="right">{t('table.columns.actions')}</DesktopHeaderCell>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
          {flashSales.map(sale => {
            const progressPercent = getFlashSaleProgressPercent(sale)

            return (
              <tr key={sale._id} className="transition-colors hover:bg-[var(--admin-surface-2)]">
                <td className="whitespace-nowrap px-4 py-4 align-top">
                  <SaleName language={language} sale={sale} t={t} />
                </td>

                <td className="whitespace-nowrap px-4 py-4 align-top">
                  <div className="text-sm text-[var(--admin-text)]">{formatFlashSaleDateTime(sale.startAt, locale)}</div>
                  <div className="text-sm text-[var(--admin-text-muted)]">
                    {t('table.until', { date: formatFlashSaleDateTime(sale.endAt, locale) })}
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-4 align-top">
                  <DiscountBadge discountPercent={sale.discountPercent} locale={locale} />
                </td>

                <td className="whitespace-nowrap px-4 py-4 align-top">
                  <QuantityProgress locale={locale} sale={sale} progressPercent={progressPercent} />
                </td>

                <td className="whitespace-nowrap px-4 py-4 align-top">
                  <StatusBadge status={sale.status} t={t} />
                </td>

                <td className="whitespace-nowrap px-4 py-4 align-top text-sm font-medium text-[var(--admin-text)]">
                  {formatCurrency(sale.revenue, locale)}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium align-top">
                  <FlashSaleActions sale={sale} onEdit={onEdit} onDelete={onDelete} t={t} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function FlashSalesTabletTable({ flashSales, language, locale, onEdit, onDelete, t }) {
  return (
    <div className="admin-flash-sales-tablet-table">
      <div className="grid grid-cols-12 gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
        <div className="col-span-5">{t('table.columns.name')}</div>
        <div className="col-span-3">{t('table.columns.status')}</div>
        <div className="col-span-2">{t('table.columns.revenue')}</div>
        <div className="col-span-2 text-right">{t('table.columns.actions')}</div>
      </div>

      <div className="divide-y divide-[var(--admin-border)]">
        {flashSales.map(sale => (
          <div key={sale._id} className="grid grid-cols-12 items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--admin-surface-2)]">
            <div className="col-span-5 min-w-0">
              <SaleName language={language} sale={sale} t={t} />
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--admin-text-muted)]">
                <span>{formatFlashSaleDateRange(sale, locale)}</span>
                <span>{formatFlashSaleDiscount(sale.discountPercent, locale)}</span>
                <span>{formatFlashSaleQuantity(sale, locale)}</span>
              </div>
            </div>

            <div className="col-span-3">
              <StatusBadge status={sale.status} t={t} />
            </div>

            <div className="col-span-2 text-sm font-semibold text-[var(--admin-text)]">
              {formatCurrency(sale.revenue, locale)}
            </div>

            <div className="col-span-2 flex justify-end">
              <FlashSaleActions sale={sale} onEdit={onEdit} onDelete={onDelete} t={t} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlashSalesMobileCards({ flashSales, language, locale, onEdit, onDelete, t }) {
  return (
    <div className="admin-flash-sales-card-list">
      {flashSales.map(sale => {
        const progressPercent = getFlashSaleProgressPercent(sale)

        return (
          <article key={sale._id} className="admin-flash-sale-card">
            <div className="admin-flash-sale-card__top">
              <div className="min-w-0">
                <SaleTitle language={language} sale={sale} t={t} titleClassName="admin-flash-sale-card__title" />
                <p className="admin-flash-sale-card__subtitle">{t('table.productCount', { count: getProductCount(sale) })}</p>
              </div>

              <StatusBadge status={sale.status} t={t} />
            </div>

            <div className="admin-flash-sale-card__revenue">
              <span>{t('table.columns.revenue')}</span>
              <strong>{formatCurrency(sale.revenue, locale)}</strong>
            </div>

            <div className="admin-flash-sale-card__meta">
              <div>
                <span>{t('table.columns.time')}</span>
                <strong>{formatFlashSaleDateRange(sale, locale)}</strong>
              </div>
              <div>
                <span>{t('table.columns.discount')}</span>
                <strong>{formatFlashSaleDiscount(sale.discountPercent, locale)}</strong>
              </div>
              <div>
                <span>{t('table.columns.quantity')}</span>
                <strong>{formatFlashSaleQuantity(sale, locale)}</strong>
              </div>
            </div>

            <div className="mt-3 h-2 w-full rounded-full bg-[var(--admin-surface-3)]">
              <div className="h-2 rounded-full bg-[var(--admin-accent)]" style={{ width: `${progressPercent}%` }} />
            </div>

            <FlashSaleActions sale={sale} onEdit={onEdit} onDelete={onDelete} showLabels t={t} />
          </article>
        )
      })}
    </div>
  )
}

function DesktopHeaderCell({ children, align = 'left' }) {
  const alignClassName = align === 'right' ? 'text-right' : 'text-left'

  return (
    <th className={`px-4 py-3 ${alignClassName} text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]`}>
      {children}
    </th>
  )
}

function SaleName({ language, sale, t }) {
  return (
    <div className="min-w-0">
      <SaleTitle language={language} sale={sale} t={t} titleClassName="truncate text-sm font-semibold text-[var(--admin-text)]" />
      <div className="text-sm text-[var(--admin-text-muted)]">{t('table.productCount', { count: getProductCount(sale) })}</div>
    </div>
  )
}

function SaleTitle({ language, sale, t, titleClassName }) {
  const isMissingTranslation = !hasLocalizedFlashSaleName(sale, language)

  return (
    <div className="min-w-0">
      <div className={titleClassName}>{getLocalizedFlashSaleName(sale, language, t('table.fallbackName'))}</div>
      {isMissingTranslation && (
        <div className="mt-1 inline-flex rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {t('table.translationMissing')}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status, t }) {
  const statusMeta = getFlashSaleStatusMeta(status, t)

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.className}`}>
      {statusMeta.label}
    </span>
  )
}

function DiscountBadge({ discountPercent, locale }) {
  return (
    <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-500/35 dark:bg-rose-500/10 dark:text-rose-200">
      {formatFlashSaleDiscount(discountPercent, locale)}
    </span>
  )
}

function QuantityProgress({ locale, sale, progressPercent }) {
  return (
    <div>
      <div className="text-sm text-[var(--admin-text)]">{formatFlashSaleQuantity(sale, locale)}</div>
      <div className="mt-1 h-2 w-full min-w-[5rem] rounded-full bg-[var(--admin-surface-3)]">
        <div className="h-2 rounded-full bg-[var(--admin-accent)]" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  )
}

function FlashSaleActions({ sale, onEdit, onDelete, showLabels = false, t }) {
  return (
    <div className={`admin-flash-sales-actions ${showLabels ? 'admin-flash-sales-actions--labeled' : ''}`}>
      <Button className="admin-flash-sales-action-btn" onClick={() => onEdit(sale)} icon={<Edit2 className="h-4 w-4" />}>
        {showLabels ? t('actions.edit') : null}
      </Button>
      <Button
        danger
        className="admin-flash-sales-action-btn admin-flash-sales-action-btn--delete"
        onClick={() => onDelete(sale._id)}
        icon={<Trash2 className="h-4 w-4" />}
      >
        {showLabels ? t('actions.delete') : null}
      </Button>
    </div>
  )
}

function getProductCount(sale) {
  return Array.isArray(sale?.products) ? sale.products.length : 0
}
