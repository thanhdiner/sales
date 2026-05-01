import {
  CalendarOutlined,
  CopyOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PercentageOutlined,
  PlayCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Button, Card, Dropdown, Empty, Modal, Pagination, Popconfirm, Space, Switch, Table, Tag, Tooltip } from 'antd'
import {
  formatNumber,
  formatPromoCodeDate,
  formatPromoCodeDateTime,
  getConditionText,
  getDiscountText,
  getDiscountTypeLabel,
  getPromoCodeAudienceText,
  getPromoCodeStatusMeta,
  getPromoCodeUsedByCount,
  getPromoCodeUsagePercentage,
  getUsageText,
  isPercentDiscount
} from '../utils/promoCodeHelpers'
import {
  getLocalizedPromoCodeDescription,
  getLocalizedPromoCodeTitle
} from '@/utils/promoCodeLocalization'

export default function PromoCodesTable({
  promoCodes,
  loading,
  pagination,
  language,
  t,
  onCreate,
  onTableChange,
  onCopy,
  onShowDetail,
  onEdit,
  onToggleStatus,
  onDelete
}) {
  const textActionButtonClass =
    '!text-[var(--admin-text-muted)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
  const primaryButtonClass =
    '!border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'

  const total = Number(pagination?.total) || 0
  const current = Number(pagination?.current) || 1
  const pageSize = Number(pagination?.pageSize) || 10
  const rangeStart = total === 0 ? 0 : (current - 1) * pageSize + 1
  const rangeEnd = total === 0 ? 0 : Math.min(current * pageSize, total)
  const paginationSummary = t('table.paginationSummary', {
    rangeStart: formatNumber(rangeStart, language),
    rangeEnd: formatNumber(rangeEnd, language),
    total: formatNumber(total, language)
  })
  const getCampaignTitle = record =>
    getLocalizedPromoCodeTitle(record, language, t('table.fallbackCampaignTitle', { code: record.code }))
  const getCampaignDescription = record => getLocalizedPromoCodeDescription(record, language, '')

  const showDeleteConfirm = record => {
    Modal.confirm({
      title: t('table.deleteConfirmTitle'),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okButtonProps: {
        danger: true
      },
      centered: true,
      className: 'admin-promo-mobile-confirm',
      onOk: () => onDelete(record._id)
    })
  }

  const handleMobileMenuClick = (record, info) => {
    switch (info.key) {
      case 'detail':
        onShowDetail(record)
        break
      case 'edit':
        onEdit(record)
        break
      case 'toggle':
        onToggleStatus(record)
        break
      case 'delete':
        showDeleteConfirm(record)
        break
      default:
        break
    }
  }

  const columns = [
    {
      title: t('table.columns.code'),
      dataIndex: 'code',
      key: 'code',
      render: text => (
        <Space>
          <span className="font-mono font-bold text-[var(--admin-accent)]">{text}</span>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => onCopy(text)}
            className={textActionButtonClass}
          />
        </Space>
      )
    },
    {
      title: t('table.columns.campaign'),
      key: 'campaign',
      render: (_, record) => {
        const campaignTitle = getCampaignTitle(record)
        const campaignDescription = getCampaignDescription(record)

        return (
          <div className="min-w-[220px]">
            <div className="font-semibold text-[var(--admin-text)]">{campaignTitle}</div>
            {campaignDescription ? (
              <div className="mt-1 line-clamp-2 text-xs text-[var(--admin-text-muted)]">{campaignDescription}</div>
            ) : null}
            <Tag className="mt-2" color="blue">{t(`categories.${record.category || 'all'}`)}</Tag>
          </div>
        )
      }
    },
    {
      title: t('table.columns.discountType'),
      dataIndex: 'discountType',
      key: 'discountType',
      render: (type, record) => (
        <Space className="text-[var(--admin-text-muted)]">
          {isPercentDiscount(type) ? <PercentageOutlined /> : <DollarOutlined />}

          <span className="min-w-0">
            <span className="block text-[var(--admin-text)]">{getDiscountText(record, language, t)}</span>
            <span className="block text-xs text-[var(--admin-text-muted)]">{getDiscountTypeLabel(type, t)}</span>
          </span>
        </Space>
      )
    },
    {
      title: t('table.columns.conditions'),
      key: 'conditions',
      render: (_, record) => (
        <div className="text-sm text-[var(--admin-text-muted)]">
          {getConditionText(record, language, t)}
        </div>
      )
    },
    {
      title: t('table.columns.usage'),
      key: 'usage',
      render: (_, record) => {
        const percentage = getPromoCodeUsagePercentage(record)

        return (
          <div className="text-sm text-[var(--admin-text-muted)]">
            <div className="text-[var(--admin-text)]">{getUsageText(record, language, t)}</div>

            {record.usageLimit && (
              <div className="mt-1 h-2 w-full rounded-full bg-[var(--admin-surface-3)]">
                <div className="h-2 rounded-full bg-[var(--admin-accent)]" style={{ width: `${percentage}%` }} />
              </div>
            )}
          </div>
        )
      }
    },
    {
      title: t('table.columns.audience'),
      key: 'audience',
      render: (_, record) => (
        <div className="text-sm">
          <div className="text-[var(--admin-text)]">{getPromoCodeAudienceText(record, t)}</div>
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
      render: date => (
        <Space className="text-[var(--admin-text-muted)]">
          <CalendarOutlined />
          <span className="text-[var(--admin-text)]">{date ? formatPromoCodeDate(date, language) : t('common.noLimit')}</span>
        </Space>
      )
    },
    {
      title: t('table.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => (
        <Space className="text-[var(--admin-text-muted)]">
          <CalendarOutlined />
          <span className="text-[var(--admin-text)]">{date ? formatPromoCodeDateTime(date, language) : t('common.noLimit')}</span>
        </Space>
      )
    },
    {
      title: t('table.columns.status'),
      key: 'status',
      render: (_, record) => {
        const statusMeta = getPromoCodeStatusMeta(record, t)
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
      }
    },
    {
      title: t('table.columns.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title={t('table.actions.viewDetail')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onShowDetail(record)}
              className={textActionButtonClass}
            />
          </Tooltip>

          <Tooltip title={t('table.actions.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className={textActionButtonClass}
            />
          </Tooltip>

          <Tooltip title={record.isActive ? t('table.actions.disable') : t('table.actions.enable')}>
            <Switch size="small" checked={record.isActive} onChange={() => onToggleStatus(record)} />
          </Tooltip>

          <Popconfirm
            title={t('table.deleteConfirmTitle')}
            onConfirm={() => onDelete(record._id)}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            overlayClassName="admin-promo-popconfirm"
          >
            <Button type="text" danger icon={<DeleteOutlined />} className="hover:!bg-[var(--admin-surface-2)]" />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card className="admin-promo-main-card rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-[var(--admin-shadow)]">
      <div className="admin-promo-main-card__header mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">{t('table.title')}</h2>

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate} className={primaryButtonClass}>
          {t('table.createButton')}
        </Button>
      </div>

      <div className="admin-promo-table-desktop">
        <div className="-mx-2 overflow-x-auto sm:mx-0">
          <Table
            columns={columns}
            dataSource={promoCodes}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: () => <span className="text-[var(--admin-text-muted)]">{paginationSummary}</span>
            }}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
            }}
            onChange={onTableChange}
            scroll={{ x: 1320 }}
            className="admin-promo-table min-w-[1080px]"
          />
        </div>
      </div>

      <div className="admin-promo-mobile">
        <div className="admin-promo-mobile-list">
          {promoCodes.length === 0 && !loading ? (
            <div className="admin-promo-mobile-empty">
              <Empty description={t('table.empty')} />
            </div>
          ) : (
            promoCodes.map(record => {
              const statusMeta = getPromoCodeStatusMeta(record, t)
              const usagePercentage = getPromoCodeUsagePercentage(record)
              const campaignTitle = getCampaignTitle(record)
              const campaignDescription = getCampaignDescription(record)

              const mobileMenuItems = [
                {
                  key: 'detail',
                  icon: <EyeOutlined />,
                  label: t('table.actions.viewDetail')
                },
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: t('table.actions.edit')
                },
                {
                  key: 'toggle',
                  icon: <PlayCircleOutlined />,
                  label: record.isActive ? t('table.actions.disableCode') : t('table.actions.enableCode')
                },
                {
                  type: 'divider'
                },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                  label: t('table.actions.deleteCode')
                }
              ]

              return (
                <article className="admin-promo-mobile-card" key={record._id}>
                  <div className="admin-promo-mobile-card__head">
                    <div className="admin-promo-mobile-card__code-wrap">
                      <span className="admin-promo-mobile-card__code">{record.code}</span>

                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => onCopy(record.code)}
                        className="admin-promo-mobile-card__copy"
                      />
                    </div>

                    <div className="admin-promo-mobile-card__right">
                      <Tag color={statusMeta.color}>{statusMeta.label}</Tag>

                      <Dropdown
                        menu={{
                          items: mobileMenuItems,
                          onClick: info => handleMobileMenuClick(record, info)
                        }}
                        trigger={['click']}
                        placement="bottomRight"
                        overlayClassName="admin-promo-mobile-dropdown"
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          className="admin-promo-mobile-card__menu"
                        />
                      </Dropdown>
                    </div>
                  </div>

                  <p className="admin-promo-mobile-card__discount">{getDiscountText(record, language, t)}</p>
                  <h3 className="admin-promo-mobile-card__title">{campaignTitle}</h3>
                  <Tag className="mt-2" color="blue">{t(`categories.${record.category || 'all'}`)}</Tag>
                  {campaignDescription ? (
                    <p className="admin-promo-mobile-card__description">{campaignDescription}</p>
                  ) : null}
                  <p className="admin-promo-mobile-card__conditions">{getConditionText(record, language, t)}</p>

                  <div className="admin-promo-mobile-card__meta-row">
                    <span>
                      {t('table.usage')}: {getUsageText(record, language, t)}
                    </span>
                    <span>{t('table.audience')}: {getPromoCodeAudienceText(record, t)}</span>
                    <span>{t('table.expiry')}: {record.expiresAt ? formatPromoCodeDate(record.expiresAt, language) : t('common.noLimit')}</span>
                    <span>{t('table.createdAt')}: {record.createdAt ? formatPromoCodeDate(record.createdAt, language) : t('common.noLimit')}</span>
                  </div>

                  <div className="admin-promo-mobile-card__progress">
                    <div className="admin-promo-mobile-card__progress-fill" style={{ width: `${usagePercentage}%` }} />
                  </div>
                </article>
              )
            })
          )}
        </div>

        <div className="admin-promo-mobile-footer">
          <span className="admin-promo-mobile-footer__summary">{paginationSummary}</span>

          <Pagination
            size="small"
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={false}
            onChange={nextPage => onTableChange({ current: nextPage, pageSize: pagination.pageSize })}
            className="admin-promo-mobile-pagination"
          />
        </div>
      </div>
    </Card>
  )
}
