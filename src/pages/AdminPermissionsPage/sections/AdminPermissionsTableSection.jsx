import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table } from 'antd'
import { getPermissionGroupLabel } from '../utils'
import {
  getLocalizedPermissionDescription,
  getLocalizedPermissionGroupLabel,
  getLocalizedPermissionTitle
} from '@/utils/permissionLocalization'

export default function AdminPermissionsTableSection({
  t = key => key,
  permissionList,
  total,
  currentPage,
  pageSize,
  permissionGroups,
  language,
  loading,
  grantedPermissions,
  onPageChange,
  onPageSizeChange,
  onEditPermission,
  onDeletePermission
}) {
  const canEditPermission = grantedPermissions.includes('edit_permission')
  const canDeletePermission = grantedPermissions.includes('delete_permission')
  const actionButtonClass =
    'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'

  const renderActions = record => (
    <Space size="small" className="admin-permissions-actions">
      {canEditPermission && (
        <Button
          icon={<EditOutlined />}
          onClick={() => onEditPermission(record)}
          className={actionButtonClass}
          title={t('table.editPermission')}
          aria-label={t('table.editPermission')}
        />
      )}

      {canDeletePermission && (
        <Popconfirm
          title={t('table.deleteConfirmTitle')}
          description={t('table.deleteConfirmDescription')}
          onConfirm={() => onDeletePermission(record._id)}
          okText={t('common.delete')}
          cancelText={t('common.cancel')}
          overlayClassName="admin-permissions-popconfirm"
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            className="admin-permissions-delete-btn rounded-lg"
            title={t('table.deletePermission')}
            aria-label={t('table.deletePermission')}
          />
        </Popconfirm>
      )}

      {!canEditPermission && !canDeletePermission && (
        <span className="text-[var(--admin-text-subtle)]">{t('common.noActions')}</span>
      )}
    </Space>
  )

  const columns = [
    {
      title: t('table.columns.code'),
      dataIndex: 'name',
      key: 'name',
      className: 'admin-permissions-col-code',
      width: '18%',
      render: name => <span className="admin-permissions-code-text font-mono text-sm font-medium text-[var(--admin-text-muted)]">{name}</span>
    },
    {
      title: t('table.columns.name'),
      dataIndex: 'title',
      key: 'title',
      className: 'admin-permissions-col-title',
      width: '18%',
      render: (_, record) => (
        <span className="admin-permissions-title-text font-medium text-[var(--admin-text)]">
          {getLocalizedPermissionTitle(record, language, record.title || record.name)}
        </span>
      )
    },
    {
      title: t('table.columns.description'),
      dataIndex: 'description',
      key: 'description',
      className: 'admin-permissions-col-description',
      responsive: ['md'],
      render: (_, record) => (
        <span className="admin-permissions-muted-text text-[var(--admin-text-muted)]">
          {getLocalizedPermissionDescription(record, language, t('table.noDescription')) || t('table.noDescription')}
        </span>
      )
    },
    {
      title: t('table.columns.group'),
      dataIndex: 'group',
      key: 'group',
      className: 'admin-permissions-col-group',
      width: '16%',
      responsive: ['md'],
      render: group => {
        const matchedGroup = permissionGroups.find(item => item.value === group)
        const fallbackLabel = getPermissionGroupLabel(permissionGroups, group, t('table.noGroup'))

        return (
          <span className="admin-permissions-muted-text text-[var(--admin-text-muted)]">
            {getLocalizedPermissionGroupLabel(matchedGroup, language, fallbackLabel)}
          </span>
        )
      }
    },
    {
      title: t('table.columns.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      className: 'admin-permissions-col-status',
      width: 92,
      render: isActive => <PermissionStatus active={isActive !== false} t={t} />
    },
    {
      title: t('table.columns.actions'),
      key: 'action',
      className: 'admin-permissions-col-action',
      width: 96,
      render: (_, record) => renderActions(record)
    }
  ]

  return (
    <div className="admin-permissions-table-wrapper">
      <Table
        dataSource={permissionList}
        columns={columns}
        rowKey="_id"
        loading={loading}
        tableLayout="fixed"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          showTotal: (count, range) => (
            <span className="text-[var(--admin-text-muted)]">
              {t('table.showTotal', { rangeStart: range[0], rangeEnd: range[1], total: count })}
            </span>
          ),
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange
        }}
        className="admin-permissions-table"
      />
    </div>
  )
}

function PermissionStatus({ active, t }) {
  return (
    <span
      className={`admin-permissions-status-switch ${active ? 'admin-permissions-status-switch--active' : 'admin-permissions-status-switch--inactive'}`}
    >
      <span>{active ? t('status.enabled') : t('status.disabled')}</span>
      <i />
    </span>
  )
}
