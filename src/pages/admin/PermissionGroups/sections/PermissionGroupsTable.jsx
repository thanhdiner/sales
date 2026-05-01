import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  MoreOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserSwitchOutlined
} from '@ant-design/icons'
import { Button, Dropdown, Empty, Pagination, Popconfirm, Skeleton, Space, Switch, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { getLocalizedPermissionGroupDescription, getLocalizedPermissionGroupLabel } from '../utils'

const getGroupPermissionCount = group => {
  if (typeof group.permissionCount === 'number') {
    return group.permissionCount
  }

  if (Array.isArray(group.permissions)) {
    return group.permissions.length
  }

  return null
}

const getGroupIcon = value => {
  if (value?.includes('product')) {
    return <ProductOutlined />
  }

  if (value?.includes('permission')) {
    return <SafetyCertificateOutlined />
  }

  if (value?.includes('role')) {
    return <UserSwitchOutlined />
  }

  if (value?.includes('account')) {
    return <TeamOutlined />
  }

  if (value?.includes('auth')) {
    return <KeyOutlined />
  }

  return <AppstoreOutlined />
}

function PermissionCount({ group }) {
  const { t } = useTranslation('adminPermissionGroups')
  const count = getGroupPermissionCount(group)

  if (count === null) {
    return null
  }

  return <span className="admin-permission-groups-count">{t('table.permissionCount', { count })}</span>
}

function GroupStatusBadge({ isActive }) {
  const { t } = useTranslation('adminPermissionGroups')

  return (
    <span
      className={`admin-permission-groups-status ${isActive ? 'admin-permission-groups-status--active' : 'admin-permission-groups-status--inactive'}`}
    >
      <span className="admin-permission-groups-status__dot" />
      {isActive ? t('status.active') : t('status.inactive')}
    </span>
  )
}

function GroupActions({ group, canEditGroup, canDeleteGroup, textActionButtonClass, onEditGroup, onDeleteGroup }) {
  const { t, i18n } = useTranslation('adminPermissionGroups')
  const language = i18n.resolvedLanguage || i18n.language
  const groupLabel = getLocalizedPermissionGroupLabel(group, language, group.label || group.value || '')

  if (!canEditGroup && !canDeleteGroup) {
    return null
  }

  return (
    <Space size="small">
      {canEditGroup && (
        <Button
          icon={<EditOutlined />}
          onClick={() => onEditGroup(group)}
          className={`admin-permission-groups-action-btn rounded-lg ${textActionButtonClass}`}
        >
          {t('common.edit')}
        </Button>
      )}

      {canDeleteGroup && (
        <Popconfirm
          title={t('table.deleteConfirmTitle')}
          description={t('table.deleteConfirmDescription', { name: groupLabel })}
          onConfirm={() => onDeleteGroup(group._id)}
          okText={t('common.delete')}
          cancelText={t('common.cancel')}
          overlayClassName="admin-permission-groups-popconfirm"
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            className="admin-permission-groups-action-btn admin-permission-groups-delete-btn rounded-lg"
          >
            {t('common.delete')}
          </Button>
        </Popconfirm>
      )}
    </Space>
  )
}

function GroupMobileMenu({ group, canEditGroup, canDeleteGroup, onEditGroup, onDeleteGroup }) {
  const { t, i18n } = useTranslation('adminPermissionGroups')
  const language = i18n.resolvedLanguage || i18n.language
  const groupLabel = getLocalizedPermissionGroupLabel(group, language, group.label || group.value || '')

  if (!canEditGroup && !canDeleteGroup) {
    return null
  }

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{ items: [] }}
      dropdownRender={() => (
        <div className="admin-permission-groups-mobile-menu">
          {canEditGroup && (
            <button type="button" className="admin-permission-groups-mobile-menu__item" onClick={() => onEditGroup(group)}>
              <EditOutlined />
              <span>{t('common.edit')}</span>
            </button>
          )}

          {canDeleteGroup && (
            <Popconfirm
              title={t('table.deleteConfirmTitle')}
              description={t('table.deleteConfirmDescription', { name: groupLabel })}
              onConfirm={() => onDeleteGroup(group._id)}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              overlayClassName="admin-permission-groups-popconfirm"
            >
              <button type="button" className="admin-permission-groups-mobile-menu__item admin-permission-groups-mobile-menu__item--danger">
                <DeleteOutlined />
                <span>{t('common.delete')}</span>
              </button>
            </Popconfirm>
          )}
        </div>
      )}
    >
      <Button type="text" icon={<MoreOutlined />} aria-label={t('table.openActions')} className="admin-permission-groups-menu-btn" />
    </Dropdown>
  )
}

function GroupMobileItem({ group, canEditGroup, canDeleteGroup, onEditGroup, onDeleteGroup }) {
  const { i18n, t } = useTranslation('adminPermissionGroups')
  const language = i18n.resolvedLanguage || i18n.language
  const groupLabel = getLocalizedPermissionGroupLabel(group, language, group.label || t('table.untitledGroup'))

  return (
    <article className="admin-permission-groups-mobile-item">
      <span className="admin-permission-groups-mobile-item__icon">{getGroupIcon(group.value)}</span>

      <div className="admin-permission-groups-mobile-item__content">
        <h3 className="admin-permission-groups-mobile-item__title">{groupLabel}</h3>
        <PermissionCount group={group} />
      </div>

      <div className="admin-permission-groups-mobile-item__status">
        <GroupStatusBadge isActive={group.isActive} />
      </div>

      <GroupMobileMenu
        group={group}
        canEditGroup={canEditGroup}
        canDeleteGroup={canDeleteGroup}
        onEditGroup={onEditGroup}
        onDeleteGroup={onDeleteGroup}
      />
    </article>
  )
}

function MobileLoadingList() {
  return (
    <div className="admin-permission-groups-mobile-list">
      {Array.from({ length: 5 }).map((_, index) => (
        <article key={index} className="admin-permission-groups-mobile-item admin-permission-groups-mobile-item--loading">
          <Skeleton.Avatar active size={34} shape="circle" />
          <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 1, width: '36%' }} />
        </article>
      ))}
    </div>
  )
}

export default function PermissionGroupsTable({
  groups,
  total,
  currentPage,
  pageSize,
  loading,
  updatingId,
  permissions,
  onPageChange,
  onPageSizeChange,
  onEditGroup,
  onDeleteGroup,
  onToggleGroupActive
}) {
  const { t, i18n } = useTranslation('adminPermissionGroups')
  const language = i18n.resolvedLanguage || i18n.language
  const canEditGroup = permissions.includes('edit_permission_group')
  const canDeleteGroup = permissions.includes('delete_permission_group')
  const textActionButtonClass = '!text-[var(--admin-text-muted)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
  const showTotal = (count, range) =>
    t('table.showTotal', {
      rangeStart: range[0],
      rangeEnd: range[1],
      total: count
    })

  const columns = [
    {
      title: t('table.columns.name'),
      dataIndex: 'label',
      key: 'label',
      render: (text, record) => (
        <div className="admin-permission-groups-name-cell">
          <span className="admin-permission-groups-name-cell__label">
            {getLocalizedPermissionGroupLabel(record, language, text || t('table.untitledGroup'))}
          </span>
          <PermissionCount group={record} />
        </div>
      )
    },
    {
      title: t('table.columns.code'),
      dataIndex: 'value',
      key: 'value',
      render: text => <span className="admin-permission-groups-code">{text}</span>
    },
    {
      title: t('table.columns.description'),
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <span className="admin-permission-groups-description">
          {getLocalizedPermissionGroupDescription(record, language, text || t('table.noDescription'))}
        </span>
      )
    },
    {
      title: t('table.columns.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren={t('common.enable')}
          unCheckedChildren={t('common.disable')}
          loading={updatingId === record._id}
          onChange={() => onToggleGroupActive(record)}
          disabled={!canEditGroup}
        />
      )
    },
    {
      title: t('table.columns.actions'),
      key: 'action',
      width: 170,
      render: (_, record) => (
        <GroupActions
          group={record}
          canEditGroup={canEditGroup}
          canDeleteGroup={canDeleteGroup}
          textActionButtonClass={textActionButtonClass}
          onEditGroup={onEditGroup}
          onDeleteGroup={onDeleteGroup}
        />
      )
    }
  ]

  return (
    <>
      <div className="admin-permission-groups-table-wrap">
        <Table
          dataSource={groups}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (count, range) => <span className="text-[var(--admin-text-muted)]">{showTotal(count, range)}</span>,
            onChange: onPageChange,
            onShowSizeChange: onPageSizeChange
          }}
          className="admin-permission-groups-table"
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
          }}
        />
      </div>

      <div className="admin-permission-groups-mobile">
        {loading ? (
          <MobileLoadingList />
        ) : groups.length > 0 ? (
          <>
            <div className="admin-permission-groups-mobile-list">
              {groups.map(group => (
                <GroupMobileItem
                  key={group._id}
                  group={group}
                  canEditGroup={canEditGroup}
                  canDeleteGroup={canDeleteGroup}
                  onEditGroup={onEditGroup}
                  onDeleteGroup={onDeleteGroup}
                />
              ))}
            </div>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              showTotal={showTotal}
              onChange={(page, size) => {
                if (size !== pageSize) {
                  onPageSizeChange(page, size)
                  return
                }

                onPageChange(page)
              }}
              size="small"
              className="admin-permission-groups-mobile-pagination"
            />
          </>
        ) : (
          <div className="admin-permission-groups-empty-state">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
          </div>
        )}
      </div>
    </>
  )
}
