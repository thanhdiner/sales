import { Checkbox, Table } from 'antd'
import { buildRolePermissionDataSource, isGroupSelectAll, isRoleSelectAll } from '../utils'

export default function AdminRolePermissionsTableSection({
  roles,
  permissions,
  permissionGroups,
  loading,
  rolePerm,
  onRoleSelectAll,
  onGroupSelectAll,
  onPermissionToggle
}) {
  const roleLookup = roles.reduce((mapping, role) => {
    mapping[role._id] = role
    return mapping
  }, {})

  const permissionLookup = permissions.reduce((mapping, permission) => {
    mapping[permission.name] = permission
    return mapping
  }, {})

  const groupLookup = permissionGroups.reduce((mapping, group) => {
    mapping[group.value] = group
    return mapping
  }, {})

  const columns = [
    {
      title: 'Quyền',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 220,
      render: (title, row) => {
        if (row.isSelectAll) {
          return <span className="admin-role-permission-table__title admin-role-permission-table__title--all">Chọn tất cả</span>
        }

        if (row.isGroupSelectAll) {
          return <span className="admin-role-permission-table__title admin-role-permission-table__title--group">{title}</span>
        }

        return (
          <span className="admin-role-permission-table__title">
            <strong>{title}</strong>
            {row.name ? <span className="admin-role-permission-table__subtitle">{row.name}</span> : null}
          </span>
        )
      }
    },
    ...roles.map(role => ({
      title: <span className="admin-role-permission-table__role-label">{role.label}</span>,
      dataIndex: role._id,
      width: 140,
      align: 'center',
      render: (_, row) => {
        const currentRole = roleLookup[role._id]
        const currentGroup = groupLookup[row.groupValue]
        const currentPermission = permissionLookup[row.name]
        const isRoleInactive = currentRole?.isActive === false
        const isGroupInactive = currentGroup?.isActive === false
        const isPermissionInactive = currentPermission?.isActive === false

        if (row.isSelectAll) {
          return (
            <Checkbox
              className="admin-role-permission-checkbox admin-role-permission-checkbox--role"
              checked={isRoleSelectAll(rolePerm[role._id], permissions)}
              onChange={event => onRoleSelectAll(role._id, event.target.checked)}
              disabled={isRoleInactive}
            />
          )
        }

        if (row.isGroupSelectAll) {
          return (
            <Checkbox
              className="admin-role-permission-checkbox admin-role-permission-checkbox--group"
              checked={isGroupSelectAll(rolePerm[role._id], permissions, row.groupValue)}
              onChange={event => onGroupSelectAll(role._id, row.groupValue, event.target.checked)}
              disabled={isRoleInactive || isGroupInactive}
            />
          )
        }

        return (
          <Checkbox
            className="admin-role-permission-checkbox"
            checked={rolePerm[role._id]?.includes(row.name)}
            onChange={event => onPermissionToggle(role._id, row.name, event.target.checked)}
            disabled={isRoleInactive || isGroupInactive || isPermissionInactive}
          />
        )
      }
    }))
  ]

  const dataSource = buildRolePermissionDataSource(permissionGroups, permissions)

  return (
    <div className="admin-role-permission-table-wrap">
      <Table
        className="admin-role-permission-table min-w-[900px]"
        scroll={{ x: 1000, y: 520 }}
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        bordered
        pagination={false}
        loading={loading}
        rowClassName={record => {
          if (record.isSelectAll) {
            return 'admin-role-permission-row--all'
          }

          if (record.isGroupSelectAll) {
            return 'admin-role-permission-row--group'
          }

          return ''
        }}
      />
    </div>
  )
}
