import { Avatar, Button, Empty, Pagination, Popconfirm, Popover, Select } from 'antd'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  getAccountStatusOptions,
  getLocalizedAccountFullName,
  getLocalizedRoleLabel
} from '../utils'

const tableWrapperClass = 'admin-accounts-table overflow-hidden'

const tableHeaderClass = 'admin-accounts-table-grid admin-accounts-table-head hidden md:grid'
const tableRowClass = 'admin-accounts-table-grid admin-accounts-row hidden md:grid'
const mobileListClass = 'admin-accounts-mobile-list space-y-3 p-2.5 md:hidden'
const loadingStateClass = 'admin-accounts-state flex min-h-[220px] items-center justify-center px-4 py-12'
const emptyStateClass = 'admin-accounts-state flex min-h-[220px] items-center justify-center px-4 py-12'

const userCellClass = 'flex min-w-0 items-center gap-3'
const avatarClass =
  'h-10 w-10 flex-shrink-0 rounded-lg bg-[var(--admin-surface-3)] object-cover'
const userInfoClass = 'min-w-0'
const fullNameClass = 'truncate font-semibold text-[var(--admin-text)]'
const usernameClass = 'truncate text-[12px] text-[var(--admin-text-subtle)]'

const statusSelectClass = 'admin-accounts-status-select'
const statusSelectDropdownClass = 'admin-accounts-select-dropdown'

const actionsClass = 'admin-accounts-actions flex gap-2'
const actionButtonClass =
  'admin-accounts-action-btn !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'
const dangerButtonClass =
  'admin-accounts-action-btn admin-accounts-action-btn-danger !border-[var(--admin-danger-border)] !bg-[var(--admin-danger-bg-soft)] !text-[var(--admin-danger-text)] hover:!border-[var(--admin-danger-border)] hover:!bg-[color-mix(in_srgb,var(--admin-danger-bg-soft)_85%,var(--admin-surface-2))] hover:!text-[var(--admin-danger-text)]'
const moreButtonClass =
  'admin-accounts-more-btn !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'

const popconfirmClass = 'admin-accounts-popconfirm'
const actionsPopoverClass = 'admin-accounts-actions-popover'
const paginationClass = 'admin-accounts-pagination'

function getAvatarFallback(record, language) {
  const fallbackSource = getLocalizedAccountFullName(record, language, record.fullName || '') || record.username || record.email

  if (record.avatarUrl || !fallbackSource) {
    return null
  }

  return fallbackSource.trim().split(' ').pop()?.charAt(0)?.toUpperCase()
}

function getDisplayName(record, language, t) {
  return getLocalizedAccountFullName(record, language, record.fullName || '') || record.username || t('common.unknownAccount')
}

function getRoleLabel(value, roles, language, t) {
  if (value && typeof value === 'object') {
    return getLocalizedRoleLabel(value, language, t('common.unknownRole'))
  }

  const foundRole = roles.find(role => role._id === value)
  return getLocalizedRoleLabel(foundRole, language, t('common.unknownRole'))
}

function AccountIdentity({ record }) {
  const { t } = useTranslation('adminAccounts')
  const language = useCurrentLanguage()

  return (
    <div className={userCellClass}>
      <Avatar src={record.avatarUrl} size={40} shape="square" className={avatarClass}>
        {getAvatarFallback(record, language)}
      </Avatar>

      <div className={userInfoClass}>
        <div className={fullNameClass}>{getDisplayName(record, language, t)}</div>
        <div className={usernameClass}>{record.username || '--'}</div>
      </div>
    </div>
  )
}

function AccountStatusSelect({ value, record, onChangeStatus }) {
  const { t } = useTranslation('adminAccounts')

  return (
    <Select
      value={value}
      className={statusSelectClass}
      onChange={newStatus => onChangeStatus(record._id, newStatus)}
      popupClassName={statusSelectDropdownClass}
      options={getAccountStatusOptions(t)}
      size="small"
    />
  )
}

function AccountActions({ record, onEdit, onDelete, compact = false }) {
  const { t } = useTranslation('adminAccounts')

  return (
    <div className={`${actionsClass}${compact ? ' admin-accounts-actions--compact' : ''}`}>
      <Button
        className={actionButtonClass}
        icon={<EditOutlined />}
        onClick={() => onEdit(record)}
        aria-label={t('table.editAccount')}
      />

      <Popconfirm
        title={t('table.deleteConfirmTitle')}
        onConfirm={() => onDelete(record._id)}
        okText={t('table.deleteConfirmOk')}
        cancelText={t('table.deleteConfirmCancel')}
        overlayClassName={popconfirmClass}
      >
        <Button className={dangerButtonClass} icon={<DeleteOutlined />} danger aria-label={t('table.deleteAccount')} />
      </Popconfirm>
    </div>
  )
}

function AccountMoreActions({ record, onEdit, onDelete }) {
  const { t } = useTranslation('adminAccounts')

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      overlayClassName={actionsPopoverClass}
      content={<AccountActions record={record} onEdit={onEdit} onDelete={onDelete} compact />}
    >
      <Button className={moreButtonClass} icon={<MoreOutlined />} aria-label={t('table.openActions')} />
    </Popover>
  )
}

function AccountTableRow({ record, roles, onEdit, onDelete, onChangeStatus }) {
  const { t } = useTranslation('adminAccounts')
  const language = useCurrentLanguage()
  const roleLabel = getRoleLabel(record.role_id, roles, language, t)

  return (
    <div className={tableRowClass}>
      <AccountIdentity record={record} />

      <div className="admin-accounts-email truncate text-sm text-[var(--admin-text)]" title={record.email}>
        {record.email || '--'}
      </div>

      <div className="admin-accounts-role truncate text-sm text-[var(--admin-text)]" title={roleLabel}>
        {roleLabel}
      </div>

      <AccountStatusSelect value={record.status} record={record} onChangeStatus={onChangeStatus} />

      <div className="admin-accounts-row-actions flex justify-end lg:justify-start">
        <div className="hidden lg:block">
          <AccountActions record={record} onEdit={onEdit} onDelete={onDelete} />
        </div>

        <div className="lg:hidden">
          <AccountMoreActions record={record} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  )
}

function AccountMobileCard({ record, roles, onEdit, onDelete, onChangeStatus }) {
  const { t } = useTranslation('adminAccounts')
  const language = useCurrentLanguage()
  const roleLabel = getRoleLabel(record.role_id, roles, language, t)

  return (
    <article className="admin-accounts-card rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3">
      <div className="flex items-start justify-between gap-3">
        <AccountIdentity record={record} />

        <AccountActions record={record} onEdit={onEdit} onDelete={onDelete} compact />
      </div>

      <div className="mt-2 truncate text-xs text-[var(--admin-text-muted)]" title={record.email}>
        {record.email || '--'}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[var(--admin-border)] pt-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-[var(--admin-text-subtle)]">{t('table.columns.role')}</div>
          <div className="mt-1 truncate text-xs font-medium text-[var(--admin-text)]" title={roleLabel}>
            {roleLabel}
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-medium text-[var(--admin-text-subtle)]">{t('table.columns.status')}</div>
          <div className="mt-1">
            <AccountStatusSelect value={record.status} record={record} onChangeStatus={onChangeStatus} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function AdminAccountsTable({
  data,
  total,
  currentPage,
  pageSize,
  roles,
  loading,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onChangeStatus
}) {
  const { t } = useTranslation('adminAccounts')

  return (
    <div className={tableWrapperClass}>
      {loading ? (
        <div className={loadingStateClass}>
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--admin-border)] border-t-[var(--admin-accent)]" />
            <p className="text-sm font-medium text-[var(--admin-text-muted)]">{t('table.loading')}</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className={emptyStateClass}>
          <Empty description={<span className="text-[var(--admin-text-muted)]">{t('table.empty')}</span>} />
        </div>
      ) : (
        <>
          <div className={tableHeaderClass}>
            <div>{t('table.columns.userName')}</div>
            <div>{t('table.columns.email')}</div>
            <div>{t('table.columns.role')}</div>
            <div>{t('table.columns.status')}</div>
            <div className="admin-accounts-action-title">{t('table.columns.action')}</div>
          </div>

          <div className="admin-accounts-table-body hidden md:block">
            {data.map(record => (
              <AccountTableRow
                key={record._id}
                record={record}
                roles={roles}
                onEdit={onEdit}
                onDelete={onDelete}
                onChangeStatus={onChangeStatus}
              />
            ))}
          </div>

          <div className={mobileListClass}>
            {data.map(record => (
              <AccountMobileCard
                key={record._id}
                record={record}
                roles={roles}
                onEdit={onEdit}
                onDelete={onDelete}
                onChangeStatus={onChangeStatus}
              />
            ))}
          </div>

          <Pagination
            className={paginationClass}
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            responsive
            pageSizeOptions={['10', '20', '50']}
            showTotal={(count, range) => t('table.showTotal', {
              rangeStart: range[0],
              rangeEnd: range[1],
              total: count
            })}
            onChange={(page, size) => {
              if (size !== pageSize) {
                onPageSizeChange(page, size)
                return
              }

              onPageChange(page)
            }}
          />
        </>
      )}
    </div>
  )
}
