import { DeleteOutlined, EditOutlined, EyeOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Empty, Image, Pagination, Popconfirm, Space, Spin, Table, Tag, Tooltip, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { StatusPill } from '@/components/admin/ui'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  BANK_INFO_TABLE_PAGE_SIZE,
  getLocalizedBankInfoAccountHolder,
  getLocalizedBankInfoBankName,
  getLocalizedBankInfoNoteTemplate
} from '../utils'

const { Text } = Typography

const PAGE_SIZE_OPTIONS = ['8', '16', '24', '32']

function getBankBadgeText(bankName = '') {
  const compactName = String(bankName || '').replace(/\s+/g, '')

  if (!compactName) return 'bank'

  return compactName.slice(0, 4).toLowerCase()
}

function getBankSubtitle(bankName = '', t) {
  return bankName ? t('table.bankSubtitle', { bankName }) : t('table.defaultBankSubtitle')
}

function BankBadge({ bankName }) {
  return <div className="admin-bank-info-bank-icon">{getBankBadgeText(bankName)}</div>
}

function BankStatusPill({ record, t }) {
  return (
    <StatusPill
      tone={record.isActive ? 'success' : 'neutral'}
      className={`admin-bank-info-status-pill ${record.isActive ? 'admin-bank-info-status-pill--active' : 'admin-bank-info-status-pill--inactive'}`}
    >
      {record.isActive ? t('status.active') : t('status.inactive')}
    </StatusPill>
  )
}

function BankIdentity({ record, t, language }) {
  const bankName = getLocalizedBankInfoBankName(record, language, record.bankName || '')

  return (
    <div className="admin-bank-info-bank-cell">
      <BankBadge bankName={bankName} />

      <div className="min-w-0">
        <div className="admin-bank-info-bank-title-row">
          <div className="admin-bank-info-bank-name">{bankName}</div>
          <BankStatusPill record={record} t={t} />
        </div>

        <div className="admin-bank-info-bank-sub">{getBankSubtitle(bankName, t)}</div>
      </div>
    </div>
  )
}

function renderQrCode(url, t, variant = 'table') {
  if (!url) {
    return <Tag className="admin-bank-info-qr-empty">{t('table.noQr')}</Tag>
  }

  const size = variant === 'card' ? 64 : 72

  return (
    <Image
      src={url}
      width={size}
      height={size}
      className={`admin-bank-info-qr-image admin-bank-info-qr-image--${variant}`}
      preview={{ mask: <EyeOutlined /> }}
    />
  )
}

function AccountActions({ record, onEdit, onDelete, t }) {
  return (
    <Space size="small" className="admin-bank-info-actions">
      <Tooltip title={t('table.editTooltip')}>
        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} className="admin-bank-info-action-btn" />
      </Tooltip>

      <Popconfirm
        overlayClassName="admin-bank-info-popconfirm"
        title={t('table.deleteConfirmTitle')}
        description={t('table.deleteConfirmDescription')}
        okText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={() => onDelete(record._id)}
      >
        <Tooltip title={t('table.deleteTooltip')}>
          <Button icon={<DeleteOutlined />} danger className="admin-bank-info-action-btn admin-bank-info-action-btn--danger" />
        </Tooltip>
      </Popconfirm>
    </Space>
  )
}

function AccountCard({ record, onEdit, onDelete, t, language }) {
  const [expanded, setExpanded] = useState(true)
  const contentId = `admin-bank-info-account-card-${record._id}`
  const accountHolder = getLocalizedBankInfoAccountHolder(record, language, record.accountHolder || '')
  const noteTemplate = getLocalizedBankInfoNoteTemplate(record, language, record.noteTemplate || '')

  const toggleExpanded = () => {
    setExpanded(current => !current)
  }

  const handleToggleKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    toggleExpanded()
  }

  return (
    <article className={`admin-bank-info-account-card ${expanded ? '' : 'admin-bank-info-account-card--collapsed'}`}>
      <div
        className="admin-bank-info-account-card__top"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={toggleExpanded}
        onKeyDown={handleToggleKeyDown}
      >
        <BankIdentity record={record} t={t} language={language} />
        <UpOutlined
          className={`admin-bank-info-account-card__chevron ${expanded ? '' : 'admin-bank-info-account-card__chevron--collapsed'}`}
          aria-hidden="true"
        />
      </div>

      {expanded && (
        <div id={contentId} className="admin-bank-info-account-card__content">
          <div className="admin-bank-info-account-card__body">
            <div className="admin-bank-info-account-card__field">
              <span className="admin-bank-info-account-card__label">{t('table.columns.accountNumber')}</span>
              <Text copyable className="admin-bank-info-account-number">
                {record.accountNumber}
              </Text>
            </div>

            <div className="admin-bank-info-account-card__field">
              <span className="admin-bank-info-account-card__label">{t('table.columns.accountHolder')}</span>
              <span className="admin-bank-info-account-holder">{accountHolder}</span>
            </div>

            <div className="admin-bank-info-account-card__field">
              <span className="admin-bank-info-account-card__label">{t('table.columns.noteTemplate')}</span>
              <span className="admin-bank-info-account-card__value">{noteTemplate || t('table.notConfigured')}</span>
            </div>

            <div className="admin-bank-info-account-card__field admin-bank-info-account-card__field--qr">
              <span className="admin-bank-info-account-card__label">{t('table.columns.qrCode')}</span>
              {renderQrCode(record.qrCode, t, 'card')}
            </div>
          </div>

          <div className="admin-bank-info-account-card__actions">
            <AccountActions record={record} onEdit={onEdit} onDelete={onDelete} t={t} />
          </div>
        </div>
      )}
    </article>
  )
}

export default function BankInfoTable({
  t,
  data,
  loading,
  onEdit,
  onDelete
}) {
  const language = useCurrentLanguage()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: BANK_INFO_TABLE_PAGE_SIZE
  })

  useEffect(() => {
    setPagination(currentPagination => {
      const maxPage = Math.max(1, Math.ceil(data.length / currentPagination.pageSize))

      if (currentPagination.current <= maxPage) return currentPagination

      return {
        ...currentPagination,
        current: maxPage
      }
    })
  }, [data.length])

  const { current, pageSize } = pagination

  const paginatedData = useMemo(() => {
    const start = (current - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, current, pageSize])

  const handlePaginationChange = (current, pageSize) => {
    setPagination({ current, pageSize })
  }

  const showTotal = (total, range) => t('table.showTotal', { rangeStart: range[0], rangeEnd: range[1], total })

  const columns = [
    {
      title: t('table.columns.bank'),
      dataIndex: 'bankName',
      key: 'bankName',
      width: 230,
      render: (_, record) => <BankIdentity record={record} t={t} language={language} />
    },
    {
      title: t('table.columns.accountNumber'),
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      width: 160,
      render: value => (
        <Text copyable className="admin-bank-info-account-number">
          {value}
        </Text>
      )
    },
    {
      title: t('table.columns.accountHolder'),
      dataIndex: 'accountHolder',
      key: 'accountHolder',
      width: 170,
      render: (_, record) => (
        <span className="admin-bank-info-account-holder">
          {getLocalizedBankInfoAccountHolder(record, language, record.accountHolder || '')}
        </span>
      )
    },
    {
      title: t('table.columns.noteTemplate'),
      dataIndex: 'noteTemplate',
      key: 'noteTemplate',
      width: 200,
      render: (_, record) => {
        const noteTemplate = getLocalizedBankInfoNoteTemplate(record, language, record.noteTemplate || '')

        return (
          <Tooltip title={noteTemplate || t('table.notConfigured')}>
            <span className="admin-bank-info-note">{noteTemplate || t('table.notConfigured')}</span>
          </Tooltip>
        )
      }
    },
    {
      title: t('table.columns.qrCode'),
      dataIndex: 'qrCode',
      key: 'qrCode',
      width: 110,
      render: url => renderQrCode(url, t)
    },
    {
      title: t('table.columns.actions'),
      key: 'actions',
      fixed: 'right',
      width: 110,
      render: (_, record) => <AccountActions record={record} onEdit={onEdit} onDelete={onDelete} t={t} />
    }
  ]

  return (
    <section className="admin-bank-info-table-card">
      <div className="admin-bank-info-table-card__header">
        <h2 className="admin-bank-info-table-card__title">{t('table.title')}</h2>
        <p className="admin-bank-info-table-card__description">{t('table.description')}</p>
      </div>

      <div className="admin-bank-info-table-card__wrap admin-bank-info-table-card__desktop">
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{
            current,
            pageSize,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            showSizeChanger: true,
            showTotal,
            onChange: handlePaginationChange
          }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
          }}
          className="admin-bank-info-table"
          scroll={{ x: 980 }}
        />
      </div>

      <div className="admin-bank-info-card-list">
        {loading ? (
          <div className="admin-bank-info-card-state">
            <Spin />
          </div>
        ) : paginatedData.length ? (
          paginatedData.map(record => (
            <AccountCard
              key={record._id}
              record={record}
              onEdit={onEdit}
              onDelete={onDelete}
              t={t}
              language={language}
            />
          ))
        ) : (
          <div className="admin-bank-info-card-state">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
          </div>
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="admin-bank-info-card-pagination">
          <Pagination
            current={current}
            pageSize={pageSize}
            total={data.length}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showSizeChanger
            showTotal={showTotal}
            onChange={handlePaginationChange}
          />
        </div>
      )}
    </section>
  )
}
