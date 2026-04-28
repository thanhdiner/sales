import { Button, Empty, Space, Table, Tag } from 'antd'
import { CalendarDays, Copy, DollarSign, Percent } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  formatPromoCodeDate,
  formatPromoCodeDateTime,
  getDiscountText,
  getDiscountTypeLabel,
  getPromoCodeAudienceText,
  getPromoCodeUsedByCount,
  isPercentDiscount
} from '../utils/promoCodeHelpers'
import {
  getLocalizedPromoCodeDescription,
  getLocalizedPromoCodeTitle
} from '@/utils/promoCodeLocalization'
import PromoCodeActions from './PromoCodeActions'
import PromoCodeConditionsCell from './PromoCodeConditionsCell'
import PromoCodeStatusBadge from './PromoCodeStatusBadge'
import PromoCodeUsageCell from './PromoCodeUsageCell'

const textButtonClass =
  '!text-[var(--admin-text-muted)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'

export default function PromoCodesTableSection({
  promoCodes,
  loading,
  language,
  onCopy,
  onShowDetail,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onExtendExpiry,
  onDelete
}) {
  const { t } = useTranslation('adminPromoCodes')

  const getCampaignTitle = record =>
    getLocalizedPromoCodeTitle(record, language, t('table.fallbackCampaignTitle', { code: record.code }))
  const getCampaignDescription = record => getLocalizedPromoCodeDescription(record, language, '')

  const columns = [
    {
      title: t('table.columns.code'),
      dataIndex: 'code',
      key: 'code',
      width: 160,
      render: (code, record) => (
        <div className="min-w-[132px]">
          <Space size={4}>
            <span className="font-mono text-base font-bold text-[var(--admin-accent)]">{code}</span>
            <Button
              type="text"
              size="small"
              icon={<Copy className="h-3.5 w-3.5" />}
              onClick={() => onCopy(code)}
              className={textButtonClass}
            />
          </Space>
          <div className="mt-2">
            <PromoCodeStatusBadge promoCode={record} />
          </div>
        </div>
      )
    },
    {
      title: t('table.columns.campaign'),
      key: 'campaign',
      width: 220,
      render: (_, record) => {
        const campaignTitle = getCampaignTitle(record)
        const campaignDescription = getCampaignDescription(record)

        return (
          <div className="min-w-[190px]">
            <div className="font-semibold text-[var(--admin-text)]">{campaignTitle}</div>
            {campaignDescription ? (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--admin-text-muted)]">
                {campaignDescription}
              </p>
            ) : null}
            <Tag className="mt-2" color="blue">{t(`categories.${record.category || 'all'}`)}</Tag>
          </div>
        )
      }
    },
    {
      title: t('table.columns.discountType'),
      key: 'discountType',
      width: 190,
      render: (_, record) => {
        const Icon = isPercentDiscount(record.discountType) ? Percent : DollarSign

        return (
          <div className="flex min-w-[150px] items-start gap-2 text-sm">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--admin-text-subtle)]" />
            <div>
              <div className="font-medium text-[var(--admin-text)]">{getDiscountText(record, language, t)}</div>
              <div className="mt-1 text-xs text-[var(--admin-text-muted)]">
                {getDiscountTypeLabel(record.discountType, t)}
              </div>
            </div>
          </div>
        )
      }
    },
    {
      title: t('table.columns.conditions'),
      key: 'conditions',
      width: 180,
      render: (_, record) => <PromoCodeConditionsCell promoCode={record} language={language} />
    },
    {
      title: t('table.columns.usage'),
      key: 'usage',
      width: 140,
      render: (_, record) => <PromoCodeUsageCell promoCode={record} language={language} />
    },
    {
      title: t('table.columns.audience'),
      key: 'audience',
      width: 180,
      render: (_, record) => (
        <div className="min-w-[150px] text-sm">
          <div className="font-medium text-[var(--admin-text)]">{getPromoCodeAudienceText(record, t)}</div>
          <div className="mt-1 text-xs text-[var(--admin-text-muted)]">
            {t('table.usedByCount', { count: getPromoCodeUsedByCount(record, language) })}
          </div>
        </div>
      )
    },
    {
      title: t('table.columns.expiresAt'),
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      width: 160,
      render: date => (
        <Space className="text-sm text-[var(--admin-text-muted)]">
          <CalendarDays className="h-4 w-4" />
          <span className="text-[var(--admin-text)]">{date ? formatPromoCodeDate(date, language) : t('common.noLimit')}</span>
        </Space>
      )
    },
    {
      title: t('table.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: date => (
        <Space className="text-sm text-[var(--admin-text-muted)]">
          <CalendarDays className="h-4 w-4" />
          <span className="text-[var(--admin-text)]">{date ? formatPromoCodeDateTime(date, language) : t('common.noLimit')}</span>
        </Space>
      )
    },
    {
      title: t('table.columns.status'),
      key: 'status',
      width: 120,
      render: (_, record) => <PromoCodeStatusBadge promoCode={record} />
    },
    {
      title: t('table.columns.actions'),
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <PromoCodeActions
          promoCode={record}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onToggleStatus={onToggleStatus}
          onShowUsage={onShowDetail}
          onExtendExpiry={onExtendExpiry}
          onDelete={onDelete}
        />
      )
    }
  ]

  return (
    <section className="admin-promo-table-section rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--admin-text)]">{t('table.title')}</h2>
          <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{t('table.description')}</p>
        </div>
        <p className="text-sm text-[var(--admin-text-subtle)]">
          {t('table.visibleCount', { count: promoCodes.length })}
        </p>
      </div>

      <div className="admin-promo-table-desktop">
        <Table
          columns={columns}
          dataSource={promoCodes}
          rowKey={record => record._id || record.code}
          loading={loading}
          pagination={false}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
          }}
          scroll={{ x: 1520 }}
          className="admin-promo-table"
        />
      </div>
    </section>
  )
}
