import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, ListChecks, MessageSquareText, ReceiptText, RotateCcw } from 'lucide-react'
import { useDashboardStats } from '../hooks/useDashboardQueries'
import DashboardRowSkeleton from './DashboardRowSkeleton'

export default function PendingActionsPanel() {
  const { t } = useTranslation('adminDashboard')
  const { statsData, statsLoading } = useDashboardStats()
  const actions = statsData.pendingActions

  const rows = [
    {
      key: 'orders',
      title: t('pendingActions.orders.title'),
      count: actions?.ordersToConfirm || 0,
      to: '/admin/orders',
      icon: ClipboardCheck
    },
    {
      key: 'refunds',
      title: t('pendingActions.refunds.title'),
      count: actions?.refundsToProcess || 0,
      to: '/admin/orders',
      icon: RotateCcw
    },
    {
      key: 'receipts',
      title: t('pendingActions.receipts.title'),
      count: actions?.receiptsToReview || 0,
      to: '/admin/purchase-receipts',
      icon: ReceiptText
    },
    {
      key: 'reviews',
      title: t('pendingActions.reviews.title'),
      count: actions?.reviewsToApprove || 0,
      to: '/admin/reviews',
      icon: MessageSquareText
    }
  ]

  const total = rows.reduce((sum, row) => sum + (Number(row.count) || 0), 0)
  const hasTotal = total > 0

  return (
    <div className="dashboard-panel dashboard-pending-actions">
      <div className="dashboard-panel-header dashboard-panel-header--action">
        <h2>{t('pendingActions.title')}</h2>

        <Link className="dashboard-panel-view-link" to="/admin/orders">
          {t('pendingActions.viewAll')}
          <ArrowRight size={14} />
        </Link>
      </div>

      {statsLoading ? (
        <DashboardRowSkeleton rows={4} compact />
      ) : (
        <div className="dashboard-pending-actions-list">
          {rows.map(row => {
            const Icon = row.icon
            const hasCount = Number(row.count) > 0

            return (
              <Link className="dashboard-pending-action-row" key={row.key} to={row.to}>
                <span className={`dashboard-pending-action-icon ${hasCount ? 'is-active' : ''}`}>
                  <Icon size={16} />
                </span>

                <span className="dashboard-pending-action-copy">
                  <strong>{row.title}</strong>
                </span>

                <span className={`dashboard-pending-action-count ${hasCount ? 'is-active' : ''}`}>{row.count}</span>

                <ArrowRight className="dashboard-pending-action-arrow" size={15} />
              </Link>
            )
          })}

          <div className="dashboard-pending-action-row dashboard-pending-action-row--total">
            <span className={`dashboard-pending-action-icon ${hasTotal ? 'is-active' : ''}`}>
              <ListChecks size={16} />
            </span>

            <span className="dashboard-pending-action-copy">
              <strong>{t('pendingActions.summary.total')}</strong>
            </span>

            <span className={`dashboard-pending-action-count ${hasTotal ? 'is-active' : ''}`}>{total}</span>

            <span />
          </div>
        </div>
      )}
    </div>
  )
}

